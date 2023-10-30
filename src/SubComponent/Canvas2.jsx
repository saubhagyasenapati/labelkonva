import React, { useEffect, useMemo, useRef, useState } from "react";
import { render } from "react-dom";
import { Stage, Layer, Rect, Image, Text, Group } from "react-konva";
import RTransformer from "./utils/rttransformer";
import imgsrc from "../../src/assets/table.png";
import { Button, Select, Input, Modal, Space, Form } from "antd";
import { dragBoundFuncRectangle } from "./utils";
import ModalComp from "./ModalComp";
const Rectangle = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
  currentMode,
  size,
}) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);
  return (
    <React.Fragment>
      <Group>
        <Rect
          onClick={onSelect}
          onTap={onSelect}
          ref={shapeRef}
          {...shapeProps}
          draggable={currentMode === "Drag"}
          onDragEnd={(e) => {
            onChange({
              ...shapeProps,
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
          dragBoundFunc={(pos) => dragBoundFuncRectangle(pos, size, shapeProps)}
          onTransformEnd={(e) => {
            // transformer is changing scale of the node
            // and NOT its width or height
            // but in the store we have only width and height
            // to match the data better we will reset scale on transform end
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            // we will reset it back
            node.scaleX(1);
            node.scaleY(1);
            onChange({
              ...shapeProps,
              x: node.x(),
              y: node.y(),
              // set minimal value
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(node.height() * scaleY),
            });
          }}
        />
        {/* <Text
          text={shapeProps.label} // The text you want to display
          x={shapeProps.x}
          y={shapeProps.y}
          // draggable={currentMode === "Drag
          align="left" // Optional: Text alignment
          width={shapeProps.width} // Optional: Set text width to match the rectangle
        /> */}
      </Group>
      {isSelected && (
        <RTransformer
          anchorSize={4}
          keepRatio={false}
          anchorStrokeWidth={0}
          ignoreStroke
          anchorFill={"rgb(0, 161, 255)"}
          borderEnabled={false}
          rotateEnabled={false}
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            let maxWidth;
            let maxHeight;
            if(oldBox.x === newBox.x) {
              maxWidth = size.width - oldBox.x;
            } else {
              maxWidth = oldBox.width + oldBox.x;
            }
            if(oldBox.y === newBox.y) {
              maxHeight = size.height - oldBox.y;
            } else {
              maxHeight = oldBox.height + oldBox.y;
            }
            // Calculate the maximum width and height based on the 'size' prop
            // maxWidth = size.width - oldBox.x;
            // const maxWidth = oldBox.width + oldBox.x;
            // const maxHeight = size.height - oldBox.y;
            // Ensure the new dimensions don't exceed the maximum dimensions
            const limitedBox = {
              ...newBox,
              width: Math.min(maxWidth, newBox.width),
              height: Math.min(maxHeight, newBox.height),
            };
            // Ensure the dimensions don't go below a minimum size (e.g., 5)
            if (newBox.x > 0) {
              limitedBox.width = Math.max(10, limitedBox.width);
            }
            limitedBox.height = Math.max(10, limitedBox.height);
            // Calculate the maximum x and y positions based on the 'size' prop
            const maxX = size.width - limitedBox.width;
            const maxY = size.height - limitedBox.height;
            const maxX1 = size.width - oldBox.x;
            const maxY1 = size.height - oldBox.y;
            // Ensure the new x and y values don't exceed the maximum positions
            limitedBox.x = Math.min(maxX, Math.max(0, newBox.x));
            limitedBox.y = Math.min(maxY, Math.max(0, newBox.y));
            return limitedBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

const initialRectangles = [
  {
    x: 10,
    y: 10,
    width: 100,
    height: 100,
    fill: "red",
    id: "rect1",
  },
  {
    x: 150,
    y: 150,
    width: 100,
    height: 100,
    fill: "green",
    id: "rect2",
  },
];

const Canvas2 = () => {
  const data = {
    rows: [
      [
        284.7437791824341, 239.61235809326172, 1061.3192443847656,
        270.72985076904297,
      ],
      [
        286.6624789237976, 359.82649993896484, 1065.4853820800781,
        389.8419418334961,
      ],
      [
        288.00671100616455, 75.71719098091125, 1159.0402526855469,
        103.84453010559082,
      ],
      [
        285.24916648864746, 179.4874267578125, 1055.7348327636719,
        211.5497055053711,
      ],
      [
        287.62196683883667, 120.8697738647461, 1077.8252258300781,
        151.55270385742188,
      ],
      [
        284.3829975128174, 300.28658294677734, 1093.5763244628906,
        331.4762496948242,
      ],
    ],
    cols: [
      [
        286.541054725647, 74.711590051651, 453.61036682128906,
        387.3278121948242,
      ],
      [
        928.3492126464844, 75.5934636592865, 1108.6687316894531,
        390.46910858154297,
      ],
      [
        804.5260925292969, 74.4367516040802, 885.7144470214844,
        386.46456146240234,
      ],
      [
        503.67433166503906, 74.45886063575745, 714.3262329101562,
        387.35863494873047,
      ],
      [
        1140.7747497558594, 74.00506353378296, 1160.4089660644531,
        106.00876998901367,
      ],
    ],
    cells: [
      [
        501.4615173339844, 120.98585510253906, 713.7736511230469,
        148.53421783447266,
      ],
      [
        503.1932830810547, 360.4459762573242, 567.540283203125,
        388.0676803588867,
      ],
      [
        852.0621032714844, 358.92711639404297, 885.6369934082031,
        387.5333786010742,
      ],
      [
        503.99476623535156, 241.28917694091797, 613.2478332519531,
        268.6570510864258,
      ],
      [
        851.5832824707031, 177.79300689697266, 885.1075744628906,
        208.72135162353516,
      ],
      [
        852.1183776855469, 119.54637908935547, 885.6233825683594,
        146.61707305908203,
      ],
      [
        502.90721130371094, 180.20439910888672, 627.626708984375,
        207.89043426513672,
      ],
      [
        286.8772168159485, 299.6888198852539, 444.797119140625,
        328.51436614990234,
      ],
      [
        851.6106872558594, 298.41527557373047, 885.5552062988281,
        329.1888961791992,
      ],
      [
        503.02809143066406, 75.33225560188293, 597.8068542480469,
        101.6751937866211,
      ],
      [
        851.8806457519531, 239.07508087158203, 885.4985046386719,
        267.80655670166016,
      ],
      [
        803.8464660644531, 75.44499373435974, 877.2015075683594,
        104.59272003173828,
      ],
      [
        287.35918521881104, 241.46260833740234, 438.4962615966797,
        268.15100860595703,
      ],
      [
        501.09999084472656, 298.97547149658203, 625.0780029296875,
        328.80867767333984,
      ],
      [
        286.9360704421997, 180.13665008544922, 453.30535888671875,
        208.43462371826172,
      ],
      [
        287.40679121017456, 75.13640117645264, 360.42293548583984,
        101.75970268249512,
      ],
      [
        926.3351135253906, 76.116708278656, 1106.3937072753906,
        102.04405784606934,
      ],
      [
        285.93439054489136, 359.6777877807617, 428.0581970214844,
        388.36437225341797,
      ],
      [
        286.2194347381592, 120.79045867919922, 442.1675720214844,
        148.21612548828125,
      ],
      [
        1020.4866027832031, 360.6022262573242, 1054.2368469238281,
        390.78194427490234,
      ],
      [
        739.4118041992188, 74.93983507156372, 760.9661865234375,
        106.5726318359375,
      ],
      [
        467.8076477050781, 80.82692241668701, 488.96600341796875,
        99.88358879089355,
      ],
      [
        1020.2688903808594, 180.99060821533203, 1054.4784851074219,
        212.42156219482422,
      ],
      [
        1020.0362243652344, 239.97777557373047, 1054.6132507324219,
        272.23253631591797,
      ],
      [
        1139.4548645019531, 74.95124316215515, 1161.1999816894531,
        106.38163757324219,
      ],
      [
        1018.0589904785156, 119.03471755981445, 1050.6003723144531,
        153.130615234375,
      ],
      [
        1019.5374450683594, 315.25829315185547, 1049.1683654785156,
        334.38793182373047,
      ],
      [
        1021.2361145019531, 302.1698684692383, 1047.9303283691406,
        306.6818313598633,
      ],
      [
        287.40679121017456, 74.93983507156372, 760.9661865234375,
        106.5726318359375,
      ],
      [
        1019.5374450683594, 302.1698684692383, 1049.1683654785156,
        334.38793182373047,
      ],
    ],

    //     "csv_text": "Name - Position [t][t] [t]Remote worker [t] [n]Andrew_L V Long [t]General Manager [t]32 [t] [t][n]Carla Stevens [t]Developer [t]28 [t] [t][n]EricJackson [t]Designer [t]30 [t] [t][n]Gabby Gilson [t]Sales sRep [t]24 [t] [t][n]Jake Hobbs [t]Diver [t]32 [t] [t]"
  };

  const [rectangles, setRectangles] = React.useState(initialRectangles);
  const [selectedId, selectShape] = React.useState(null);
  const [selectedRect, setSelectedRect] = useState(null);
  const [selectedRectDetails, setSelectedRectDetails] = useState(null);
  const [selectedDisplayType, setSelectedDisplayType] = useState("rows");
  const [isCreatingRect, setIsCreatingRect] = useState(false);
  const [size, setSize] = useState({ width: 900, height: 700 });
  const [currentMode, setcurrentMode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rectangleHistory, setRectangleHistory] = useState([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);
  const [form] = Form.useForm();
  const showModal = () => {
    resetForm();
    setIsModalOpen(true);
    // console.log(selectedRectDetails);
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
      console.log(updatedRectangles);
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
      setIsModalOpen(false); // Close the modal after updating the label
      resetForm();
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
        x: x1,
        y: y1,
        width,
        height,
        label: null,
        id: i,
        fill: "rgba(245, 183, 186, 0.4)",
      });
    }
    handleRectangleChange(convertedAnnotations);
  };
  
  useEffect(() => {
    convertBoundingBoxData();
  }, [selectedDisplayType]);
  const ImageDisplay = ({ src }) => {
    const imageRef = useRef(null);
    const videoElement = useMemo(() => {
      const element = new window.Image();
      element.src = src;

      return element;
    }, [src]);

    useEffect(() => {
      const onload = function () {
        setSize({
          width: videoElement.width,
          height: videoElement.height,
        });
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
          id: rectangles.length - 1,
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
        const newAnnotations = [...rectangles];
        newAnnotations.splice(selectedRect, 1);

        handleRectangleChange(newAnnotations);
        // setRectangles(newAnnotations);

        // Depending on your data structure, remove the corresponding entry
        if (selectedDisplayType === "rows") {
          const updatedRows = [...data.rows];
          updatedRows.splice(selectedRect, 1);
          // setData({ ...data, rows: updatedRows });
        } else if (selectedDisplayType === "cols") {
          const updatedCols = [...data.cols];
          updatedCols.splice(selectedRect, 1);
          // setData({ ...data, cols: updatedCols });
        } else if (selectedDisplayType === "cells") {
          const updatedCells = [...data.cells];
          updatedCells.splice(selectedRect, 1);
          // setData({ ...data, cells: updatedCells });
        }
        setSelectedRect(null);
      }
    }
  }, [selectedRect]);
  const handleUndo = () => {
    console.log(currentHistoryIndex);
    if (currentHistoryIndex > 0) {
      const previousAnnotations = rectangleHistory[currentHistoryIndex - 1];
      rectangleHistory.pop();
      setCurrentHistoryIndex(currentHistoryIndex - 1);
      setRectangles(previousAnnotations);
    }
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
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
              handleDelete();
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
          <Button onClick={handleUndo} disabled={currentHistoryIndex < 1}>
            Undo
          </Button>
          <Button
            type="primary"
            onClick={showModal}
            disabled={!selectedRectDetails}
          >
            Update Label
          </Button>
        </Space>

        <ModalComp
          isModalOpen={isModalOpen}
          handleOk={handleOk}
          handleCancel={handleCancel}
          handleUpdateLabel={handleUpdateLabel}
          form={form}
          selectedRectDetails={selectedRectDetails}
        />
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
          {rectangles.map((rect, i) => {
            return (
              <Rectangle
                key={i}
                shapeProps={rect}
                isSelected={rect.id === selectedRect}
                onSelect={() => {
                  setSelectedRect(i);
                  setSelectedRectDetails(rect);
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

export default Canvas2;
