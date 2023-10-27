import React, { useState, useEffect, useMemo, useRef } from "react";
import { Stage, Layer, Rect, Image, Circle, Group } from "react-konva";
import imgsrc from "../../src/assets/table.png";
import { Button, Space } from "antd";
import { dragBoundFunc, dragBoundFuncRectangle,} from "./utils";

const Canvas = () => {
  const data={
          "rows": [
              [
                  284.7437791824341,
                  239.61235809326172,
                  1061.3192443847656,
                  270.72985076904297
              ],
              [
                  286.6624789237976,
                  359.82649993896484,
                  1065.4853820800781,
                  389.8419418334961
              ],
              [
                  288.00671100616455,
                  75.71719098091125,
                  1159.0402526855469,
                  103.84453010559082
              ],
              [
                  285.24916648864746,
                  179.4874267578125,
                  1055.7348327636719,
                  211.5497055053711
              ],
              [
                  287.62196683883667,
                  120.8697738647461,
                  1077.8252258300781,
                  151.55270385742188
              ],
              [
                  284.3829975128174,
                  300.28658294677734,
                  1093.5763244628906,
                  331.4762496948242
              ]
          ],
          "cols": [
              [
                  286.541054725647,
                  74.711590051651,
                  453.61036682128906,
                  387.3278121948242
              ],
              [
                  928.3492126464844,
                  75.5934636592865,
                  1108.6687316894531,
                  390.46910858154297
              ],
              [
                  804.5260925292969,
                  74.4367516040802,
                  885.7144470214844,
                  386.46456146240234
              ],
              [
                  503.67433166503906,
                  74.45886063575745,
                  714.3262329101562,
                  387.35863494873047
              ],
              [
                  1140.7747497558594,
                  74.00506353378296,
                  1160.4089660644531,
                  106.00876998901367
              ]
          ],
          "cells": [
              [
                  501.4615173339844,
                  120.98585510253906,
                  713.7736511230469,
                  148.53421783447266
              ],
              [
                  503.1932830810547,
                  360.4459762573242,
                  567.540283203125,
                  388.0676803588867
              ],
              [
                  852.0621032714844,
                  358.92711639404297,
                  885.6369934082031,
                  387.5333786010742
              ],
              [
                  503.99476623535156,
                  241.28917694091797,
                  613.2478332519531,
                  268.6570510864258
              ],
              [
                  851.5832824707031,
                  177.79300689697266,
                  885.1075744628906,
                  208.72135162353516
              ],
              [
                  852.1183776855469,
                  119.54637908935547,
                  885.6233825683594,
                  146.61707305908203
              ],
              [
                  502.90721130371094,
                  180.20439910888672,
                  627.626708984375,
                  207.89043426513672
              ],
              [
                  286.8772168159485,
                  299.6888198852539,
                  444.797119140625,
                  328.51436614990234
              ],
              [
                  851.6106872558594,
                  298.41527557373047,
                  885.5552062988281,
                  329.1888961791992
              ],
              [
                  503.02809143066406,
                  75.33225560188293,
                  597.8068542480469,
                  101.6751937866211
              ],
              [
                  851.8806457519531,
                  239.07508087158203,
                  885.4985046386719,
                  267.80655670166016
              ],
              [
                  803.8464660644531,
                  75.44499373435974,
                  877.2015075683594,
                  104.59272003173828
              ],
              [
                  287.35918521881104,
                  241.46260833740234,
                  438.4962615966797,
                  268.15100860595703
              ],
              [
                  501.09999084472656,
                  298.97547149658203,
                  625.0780029296875,
                  328.80867767333984
              ],
              [
                  286.9360704421997,
                  180.13665008544922,
                  453.30535888671875,
                  208.43462371826172
              ],
              [
                  287.40679121017456,
                  75.13640117645264,
                  360.42293548583984,
                  101.75970268249512
              ],
              [
                  926.3351135253906,
                  76.116708278656,
                  1106.3937072753906,
                  102.04405784606934
              ],
              [
                  285.93439054489136,
                  359.6777877807617,
                  428.0581970214844,
                  388.36437225341797
              ],
              [
                  286.2194347381592,
                  120.79045867919922,
                  442.1675720214844,
                  148.21612548828125
              ],
              [
                  1020.4866027832031,
                  360.6022262573242,
                  1054.2368469238281,
                  390.78194427490234
              ],
              [
                  739.4118041992188,
                  74.93983507156372,
                  760.9661865234375,
                  106.5726318359375
              ],
              [
                  467.8076477050781,
                  80.82692241668701,
                  488.96600341796875,
                  99.88358879089355
              ],
              [
                  1020.2688903808594,
                  180.99060821533203,
                  1054.4784851074219,
                  212.42156219482422
              ],
              [
                  1020.0362243652344,
                  239.97777557373047,
                  1054.6132507324219,
                  272.23253631591797
              ],
              [
                  1139.4548645019531,
                  74.95124316215515,
                  1161.1999816894531,
                  106.38163757324219
              ],
              [
                  1018.0589904785156,
                  119.03471755981445,
                  1050.6003723144531,
                  153.130615234375
              ],
              [
                  1019.5374450683594,
                  315.25829315185547,
                  1049.1683654785156,
                  334.38793182373047
              ],
              [
                  1021.2361145019531,
                  302.1698684692383,
                  1047.9303283691406,
                  306.6818313598633
              ],
              [
                  287.40679121017456,
                  74.93983507156372,
                  760.9661865234375,
                  106.5726318359375
              ],
              [
                  1019.5374450683594,
                  302.1698684692383,
                  1049.1683654785156,
                  334.38793182373047
              ]
          ]

  //     "csv_text": "Name - Position [t][t] [t]Remote worker [t] [n]Andrew_L V Long [t]General Manager [t]32 [t] [t][n]Carla Stevens [t]Developer [t]28 [t] [t][n]EricJackson [t]Designer [t]30 [t] [t][n]Gabby Gilson [t]Sales sRep [t]24 [t] [t][n]Jake Hobbs [t]Diver [t]32 [t] [t]"
   }
   const [selectedDisplayType, setSelectedDisplayType] = useState("rows");
   const [currentMode, setcurrentMode] = useState(null);
   const [annotations, setAnnotations] = useState([]);
   const [selectedRect, setSelectedRect] = useState(null);
   const [isCreatingRect, setIsCreatingRect] = useState(false);
   const [size, setSize] = useState({ width: 900, height: 700 });
   const [annotationHistory, setAnnotationHistory] = useState([]);
   const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);
   const convertBoundingBoxData = () => {
    const convertedAnnotations = [];
    const displayData = data[selectedDisplayType];
    for (let i = 0; i < displayData.length; i++) {
      const [x1, y1, x2, y2] = displayData[i];
      const width = x2 - x1;
      const height = y2 - y1;
      convertedAnnotations.push({ x: x1, y: y1, width, height });
    }
    handleAnnotationChange(convertedAnnotations)
  
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

  const handleMouseDown = (event) => {
    if(currentMode==='Create'){
      const { x, y } = event.target.getStage().getPointerPosition();
      setIsCreatingRect(true);
      const newAnnotations=[...annotations, { x, y, width: 0, height: 0 }]
     setAnnotations(newAnnotations)
    }
   
  };

  const handleMouseUp = () => {
    if(currentMode==='Create'){
      setIsCreatingRect(false);
      setSelectedRect(null);
      handleAnnotationChange(annotations); 
    }
  
  };

  const handleMouseMove = (event) => {
    if(currentMode==='Create'){
      if (isCreatingRect) {
        const { x, y } = event.target.getStage().getPointerPosition();
        const lastAnnotation = annotations[annotations.length - 1];
        const width = x - lastAnnotation.x;
        const height = y - lastAnnotation.y;
  
        if (width > 0 && height > 0) {
          const newAnnotations = [...annotations];
          newAnnotations[newAnnotations.length - 1] = {
            ...lastAnnotation,
            width,
            height,
          };
          setAnnotations(newAnnotations);
        }
      }
    }

  };
 

  const handleRectClick = (index) => {
    setSelectedRect(index);
  };



  // Function to delete the selected rectangle
  const handleDelete = () => {
    if (selectedRect !== null) {
      const newAnnotations = [...annotations];
      newAnnotations.splice(selectedRect, 1);
      setAnnotations(newAnnotations);
      setSelectedRect(null);
    }

  };

  // Function to update the selected rectangle
  const handleUpdate = () => {
    // Implement the update logic here
    // You can modify the properties of the selected rectangle
  };

  // Function to create a new rectangle
  const handleCreate = () => {
    setIsCreatingEnabled(true);
  };

  // Function to enable or disable rectangle dragging
  const handleModeSelect = (mode) => {
     if(currentMode!==mode){
      setcurrentMode(mode);
     }
     else{
      setcurrentMode(null);
     }
    // Implement the drag logic here
    // You can toggle a state variable to enable/disable dragging
  };

  useEffect(() => {
    if(currentMode==='Delete'){
      if (selectedRect !== null) {
        const newAnnotations = [...annotations];
        
        newAnnotations.splice(selectedRect, 1);
        handleAnnotationChange(newAnnotations);
        setSelectedRect(null);
    
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
      }
    }
  
    
  }, [selectedRect])

  const handleResize = (event, index, indexRect) => {
    const newAnnotations = [...annotations];
    const rect = newAnnotations[indexRect];
    const { x, y } = event.target.getStage().getPointerPosition();
    
    // Check dragging bounds, assuming dragBoundFunc returns a limited position
    const limitedPosition = dragBoundFunc({ x, y }, size);
  
    switch (index) {
      case 0: // Top left corner
        rect.width = rect.x + rect.width - limitedPosition.x;
        rect.height = rect.y + rect.height - limitedPosition.y;
        rect.x = limitedPosition.x;
        rect.y = limitedPosition.y;
        break;
      case 1: // Top right corner
        rect.width = limitedPosition.x - rect.x;
        rect.height = rect.y + rect.height - limitedPosition.y;
        rect.y = limitedPosition.y;
        break;
      case 2: // Bottom left corner
        rect.width = rect.x + rect.width - limitedPosition.x;
        rect.height = limitedPosition.y - rect.y;
        rect.x = limitedPosition.x;
        break;
      case 3: // Bottom right corner
        rect.width = limitedPosition.x - rect.x;
        rect.height = limitedPosition.y - rect.y;
        break;
      default:
        break;
    }
  
    // Update the entire annotations array
    setAnnotations(newAnnotations);
  };
  const handleDragRectangle = (event, indexRect) => {
    if(currentMode==='Drag'){
      const newAnnotations = [...annotations];
      const rect = newAnnotations[indexRect];
      const { x, y } = event.target.getStage().getPointerPosition();
      
      // Apply the drag bounds to ensure the rectangle stays within the limits
      // const limitedPosition = dragBoundFuncRectangle({ x, y }, size, rect);
      rect.x = x;
      rect.y = y;
    
      setAnnotations(newAnnotations);
    }
  
  };
  
  
  // // This function will be called when the drag operation ends
  // const handleDragEnd = () => {
  //   // You can use the updated `annotations` array here
  //   // to perform any final updates if needed.
  //   // For example, you can save the annotations to the server or update the state.
  
  //   // In this case, we'll simply update the annotation history.
  //   handleAnnotationChangeCurrent();
  // };
  
  

    const handleUndo = () => {
      console.log(currentHistoryIndex);
      if (currentHistoryIndex >0) {
        const previousAnnotations = annotationHistory[currentHistoryIndex - 1];
        setCurrentHistoryIndex(currentHistoryIndex - 1);
        setAnnotations(previousAnnotations);
      }
    };
    const handleAnnotationChange = (newAnnotations) => {
      setAnnotations(newAnnotations);
      // Add the current state to the history
      setAnnotationHistory((prevHistory) => {
        const newHistory = [...prevHistory.slice(0, currentHistoryIndex + 1), newAnnotations];
        setCurrentHistoryIndex(newHistory.length - 1);
        return newHistory;
      });
    };
    const handleAnnotationChangeCurrent = () => {
      // Add the current state to the history
      setAnnotationHistory((prevHistory) => {
        const newHistory = [...prevHistory.slice(0, currentHistoryIndex + 1), annotations];
        setCurrentHistoryIndex(newHistory.length - 1);
        return newHistory;
      });
    };
    console.log(annotationHistory);
  return (
    <>
      <div class="centered-div">
        <Space direction="vertical">  
          <Button onClick={()=>{handleModeSelect('Delete') }} type={currentMode==='Delete'?'primary':'default'}>Delete</Button>
          <Button onClick={()=>handleModeSelect('Create')} type={currentMode==='Create'?'primary':'default'}>Create</Button>
          <Button onClick={()=>handleModeSelect('Drag')} type={currentMode==='Drag'?'primary':'default'}>Drag</Button>
          <Button onClick={()=>handleModeSelect('Resize')} type={currentMode==='Resize'?'primary':'default'}>Resize</Button>
          <Button onClick={handleUndo}>Undo</Button>

        </Space>
      </div>
      <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
        <select
          value={selectedDisplayType}
          onChange={(e) => setSelectedDisplayType(e.target.value)}
        >
          <option value="rows">Rows</option>
          <option value="cols">Columns</option>
          <option value="cells">Cells</option>
        </select>
      </div>
      <Stage
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      width={size.width}
      height={size.height}
    >
      <Layer>
        <ImageDisplay src={imgsrc} />
        {annotations.map((value, index) => (
          <Group
            key={index}
            draggable={currentMode==='Drag'?true:false}
            x={value.x}
            y={value.y}
            width={value.width}
            height={value.height}
            dragBoundFunc={(pos)=>dragBoundFuncRectangle(pos,size,value)}
            // onDragMove={(e) => handleDragRectangle(e, index)}
            // onDragEnd={(e) => {
            //   onChange({
            //     ...annotations,
            //     x: e.target.x(),
            //     y: e.target.y()
            //   });
            // }}
            // onDragEnd={handleDragEnd} 
          >
            <Rect
              x={0}
              y={0}
              width={value.width}
              height={value.height}
              fill="transparent"
              stroke="#F9835F"
              onClick={() => handleRectClick(index)}
            
            />
            {Array(4)
              .fill()
              .map((_, i) => (
                <Circle
                  key={i}
                  x={i % 2 === 0 ? 0 : value.width}
                  y={i < 2 ? 0 : value.height}
                  radius={5}
                  fill="#F9835F"
                  draggable={currentMode==='Resize'?true:false}
                  onDragMove={(e) => handleResize(e, i,index)}
                  onDragEnd={()=>handleAnnotationChangeCurrent()}
                  dragBoundFunc={(pos) => dragBoundFunc(pos, size)}
                
                />
              ))}
          </Group>
        ))}
      </Layer>
    </Stage>
    </>
    
  );
};

export default Canvas;
