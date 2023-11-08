import React, { useEffect, useMemo, useRef, useState } from "react";
import { render } from "react-dom";
import { Stage, Layer, Rect, Image, Text, Group } from "react-konva";
import imgsrc from "../../src/assets/table.png";
import { Button, Select, Input, Modal, Space, Form, message } from "antd";
import ModalComp from "./Component/ModalComp";
import Rectangle from "./Component/Rectangle";

const Canvas = ({data}) => {
  
  const [rectangles, setRectangles] = React.useState();
  const [selectedId, selectShape] = React.useState(null);
  const [selectedRect, setSelectedRect] = useState(null);
  const [selectedRectDetails, setSelectedRectDetails] = useState(null);
  const [selectedDisplayType, setSelectedDisplayType] = useState("rows");
  const [isCreatingRect, setIsCreatingRect] = useState(false);
  const [size, setSize] = useState({ width: 900, height: 700});
  const [ratio, setRatio] = useState(1);
  const [currentMode, setcurrentMode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rectangleHistory, setRectangleHistory] = useState([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);
  const [form] = Form.useForm();
  const showModal = () => {
    resetForm();
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    resetForm();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    resetForm();
  };
  const handleUpdateLabel = (values) => {
    if (selectedRectDetails) {
      const updatedRectangles = rectangles.map((rect) =>
        rect.id === selectedRectDetails.id
          ? { ...rect, label: values.label }
          : rect
      );
      handleRectangleChange(updatedRectangles);
      const updatedSelectedRect = updatedRectangles.find(
        (rect) => rect.id === selectedRectDetails.id
      );

      if (
        updatedSelectedRect &&
        updatedSelectedRect.label !== selectedRectDetails.label
      ) {
        setSelectedRectDetails(updatedSelectedRect);
      }
      // setIsModalOpen(false); // Close the modal after updating the label
      // resetForm();
      message.success('Label Added')
    }
  };
  const resetForm = () => {
    form.resetFields(); // Assuming `form` is your Form instance
  };

  const convertBoundingBoxData = () => {
    const convertedAnnotations = [];
    const displayData = data[selectedDisplayType];
    for (let i = 0; i < displayData.length; i++) {
      const [x1, y1, x2, y2] = displayData[i];
      const width = x2 - x1;
      const height = y2 - y1;
      convertedAnnotations.push({
        x: x1*ratio,
        y: y1*ratio,
        width:width*ratio,
        height:height*ratio,
        label: null,
        id: i,
        fill: "rgba(245, 183, 186, 0.4)",
      });
    }
    handleRectangleChange(convertedAnnotations);
  };
  
  useEffect(() => {
    convertBoundingBoxData();
  }, [selectedDisplayType,ratio]);
  const ImageDisplay = ({ src }) => {
    const imageRef = useRef(null);
    const videoElement = useMemo(() => {
      const element = new window.Image();
      element.src = src;

      return element;
    }, [src]);

    useEffect(() => {
      const onload = function () {
        const fixedWidth = 1200; 
        const ratio = fixedWidth/ videoElement.width;
        setSize({
          width: videoElement.width*ratio,
          height: videoElement.height*ratio,
        })
        setRatio(ratio)
        imageRef.current = videoElement;
      };
      videoElement.addEventListener("load", onload);
    
      return () => {
        videoElement.removeEventListener("load", onload);
      };
    }, [videoElement]);
    

    return (
      <Image
        ref={imageRef}
        image={videoElement}
        x={0}
        y={0}
        width={size.width}
        height={size.height}
      />
    );
  };
  const checkDeselect = (e) => {
    const target = e.target;
  
    
    if (target instanceof Konva.Stage) {
      setSelectedRect(null);
      setSelectedRectDetails(null);
    }
  };
  
  const handleMouseDown = (event) => {
    
    if (currentMode === "Create") {
      const { x, y } = event.target.getStage().getPointerPosition();
      setIsCreatingRect(true);
      const newAnnotations = [
        ...rectangles,
        {
          x,
          y,
          width: 0,
          height: 0,
          id: `${rectangles.length - 1}`,
          fill: "rgba(245, 183, 186, 0.4)",
        },
      ];
      setRectangles(newAnnotations);
    }
  };

  const handleMouseUp = () => {
    if (currentMode === "Create") {
      setIsCreatingRect(false);
      setSelectedRect(null);
      handleRectangleChange(rectangles);
    }
  };

  const handleMouseMove = (event) => {
    if (currentMode === "Create") {
      if (isCreatingRect) {
        const { x, y } = event.target.getStage().getPointerPosition();
        const lastAnnotation = rectangles[rectangles.length - 1];
        const width = x - lastAnnotation.x;
        const height = y - lastAnnotation.y;

        if (width > 0 && height > 0) {
          const newAnnotations = [...rectangles];
          newAnnotations[newAnnotations.length - 1] = {
            ...lastAnnotation,
            width,
            height,
            id: newAnnotations.length - 1,
            fill: "rgba(245, 183, 186, 0.4)",
          };

          setRectangles(newAnnotations); // Use setRectangles to update the state
        }
      }
    }
  };
  const handleRectangleChange = (newAnnotations) => {
    setRectangles(newAnnotations);
    // Add the current state to the history
    setRectangleHistory((prevHistory) => {
      const newHistory = [
        ...prevHistory.slice(0, currentHistoryIndex + 1),
        newAnnotations,
      ];
      setCurrentHistoryIndex(newHistory.length - 1);
      return newHistory;
    });
  };
  const handleModeSelect = (mode) => {
    if (currentMode !== mode) {
      setcurrentMode(mode);
    } else {
      setcurrentMode(null);
    }
    // Implement the drag logic here
    // You can toggle a state variable to enable/disable dragging
  };
  useEffect(() => {
    if (currentMode === "Delete") {
      if (selectedRect !== null) {
        const newAnnotations = rectangles.filter(rect => rect.id !== selectedRect);
        handleRectangleChange(newAnnotations);
        // setRectangles(newAnnotations);
        // Depending on your data structure, remove the corresponding entry
        // if (selectedDisplayType === "rows") {
        //   const updatedRows = [...data.rows];
        //   updatedRows.splice(selectedRect, 1);
        //   // setData({ ...data, rows: updatedRows });
        // } else if (selectedDisplayType === "cols") {
        //   const updatedCols = [...data.cols];
        //   updatedCols.splice(selectedRect, 1);
        //   // setData({ ...data, cols: updatedCols });
        // } else if (selectedDisplayType === "cells") {
        //   const updatedCells = [...data.cells];
        //   updatedCells.splice(selectedRect, 1);
        //   // setData({ ...data, cells: updatedCells });
        // }
        setSelectedRect(null);
        setSelectedRectDetails(null)
      }
    }
  }, [selectedRect]);
  const handleUndo = () => {
    if (currentHistoryIndex > 2) {
      const previousAnnotations = rectangleHistory[currentHistoryIndex - 1];
      rectangleHistory.pop();
      setCurrentHistoryIndex(currentHistoryIndex - 1);
      setRectangles(previousAnnotations);
    }
  };
 
  return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',flexDirection:'column'}}>
      {selectedRectDetails&&currentMode!=='Delete'&&
        <ModalComp
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
        handleUpdateLabel={handleUpdateLabel}
        form={form}
        selectedRectDetails={selectedRectDetails}
      />
      }
      
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom:'20px'
        }}
      >
        <Select
          value={selectedDisplayType}
          onChange={(value) => setSelectedDisplayType(value)}
        >
          <Option value="rows">Rows</Option>
          <Option value="cols">Columns</Option>
          <Option value="cells">Cells</Option>
        </Select>
      </div>
      <div class="centered-div">
        <Space direction="vertical">
          <Button
            onClick={() => {
              handleModeSelect("Delete");
              setSelectedRectDetails(null);
              setSelectedRect(null)
            }}
            type={currentMode === "Delete" ? "primary" : "default"}
          >
            Delete
          </Button>

          <Button
            onClick={() => handleModeSelect("Create")}
            type={currentMode === "Create" ? "primary" : "default"}
          >
            Create
          </Button>
          <Button
            onClick={() => handleModeSelect("Drag")}
            type={currentMode === "Drag" ? "primary" : "default"}
          >
            Drag
          </Button>
          {/* <Button
            onClick={() => handleModeSelect("Resize")}
            type={currentMode === "Resize" ? "primary" : "default"}
          >
            Resize
          </Button> */}

          <Button
            onClick={() => {
              setSelectedRect(null);
              setSelectedRectDetails(null);
            }}
            disabled={selectedRect === null}
          >
            Deselect
          </Button>
          <Button onClick={handleUndo} disabled={currentHistoryIndex<2}>
            Undo
          </Button>
          {/* <Button
            type="primary"
            onClick={showModal}
            disabled={!selectedRectDetails}
          >
            Update Label
          </Button> */}
        </Space>

      
      </div>
      <Stage
        width={size.width}
        height={size.height}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <Layer>
          <ImageDisplay src={imgsrc} />
          {rectangles&&rectangles.map((rect, i) => {
            return (
              <Rectangle
                key={i}
                shapeProps={rect}
                isSelected={rect.id === selectedRect}
                onSelect={() => {
                  setSelectedRect(rect.id);
                  setSelectedRectDetails(rect);
                  resetForm();
                }}
                size={size}
                currentMode={currentMode}
                onChange={(newAttrs) => {
                  const rects = rectangles.slice();
                  rects[i] = newAttrs;
                  setRectangles(rects);
                }}
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas;
