import React, { useContext, useEffect, useState } from "react";
import Draggable from "react-draggable";
import UserContext from "../../../../context/UserContext";

const ResizePolygon = ({ color }) => {
  const {
    calibrateCamera,
    setcalibrateCamera,
    selectedCamera,
  } = useContext(UserContext);

  const colorBackgrounds = {
    yellow: ["#FFFBD6", "#ffffa2"],
    red: ["#FFAA99", "#fa6b4e"],
    blue: ["#DEF7F6", "#8ceeeb"],
    purple: ["#F1DEFF", "#d5a2fa"],
  };

  const [showPoints, setShowPoints] = useState(true);
useEffect(() => {
  if (calibrateCamera[selectedCamera].cameraSetupStep1Complete) {
    setShowPoints(false);
  }
  else{
    setShowPoints(true);
  }

}, [])


  const handleDoubleClick = () => {
    if (!calibrateCamera[selectedCamera].cameraSetupStep1Complete) {
      setShowPoints(!showPoints); // Toggle points visibility on double-click
    }
  };
  const handleAddPoint = (e) => {
    if (calibrateCamera[selectedCamera].cameraSetupStep1Complete) {
      return;
    }
    if (!calibrateCamera[selectedCamera].cameraZoneData[color]) {
      calibrateCamera[selectedCamera].cameraZoneData[color] = [];
    }
  
    const updatedCalibrateCamera = { ...calibrateCamera };
    const points = updatedCalibrateCamera[selectedCamera].cameraZoneData[color];
  
    const svg = e.currentTarget; // Get the current SVG element
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const transformedPoint = point.matrixTransform(svg.getScreenCTM().inverse());
  
    const newPoint = { x: transformedPoint.x, y: transformedPoint.y };
  
    // Find the two closest points
    let closestIndex = -1;
    let minDistance = Number.MAX_VALUE;
  
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const distance = Math.sqrt((p1.x - newPoint.x) ** 2 + (p1.y - newPoint.y) ** 2) +
                       Math.sqrt((p2.x - newPoint.x) ** 2 + (p2.y - newPoint.y) ** 2);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }
  
    if (closestIndex !== -1) {
      // Insert the new point between the two closest points
      points.splice(closestIndex + 1, 0, newPoint);
    } else {
      // If there are less than 2 points, just add the new point to the array
      points.push(newPoint);
    }
  
    setcalibrateCamera(updatedCalibrateCamera);
  };
  
  
  
  
  const handleDrag = (e, data, index) => {
    if (!calibrateCamera[selectedCamera].cameraZoneData[color]) {
      return; // Exit early if color data is undefined
    }

    const { deltaX, deltaY } = data;
    const updatedCalibrateCamera = { ...calibrateCamera };

    const newPoints = calibrateCamera[selectedCamera].cameraZoneData[color].map(
      (point, i) => {
        if (i === index) {
          // Update the point at the specified index
          return {
            x: point.x + deltaX,
            y: point.y + deltaY,
          };
        } else {
          return point;
        }
      }
    );

    updatedCalibrateCamera[selectedCamera].cameraZoneData[color] = newPoints;
    setcalibrateCamera(updatedCalibrateCamera);
  };

  return (
    <div className="resize-polygon-container">
      <svg
        width="100%"
        height="100%"
        onDoubleClick={handleAddPoint} // Double-click event for toggling points
        // onClick={}
      >
        {calibrateCamera[selectedCamera].cameraZoneData[color] && (
          <polygon
            points={calibrateCamera[selectedCamera].cameraZoneData[color]
              .map((point) => `${point.x},${point.y}`)
              .join(" ")}
            fill={colorBackgrounds[color][0]}
            stroke="rgba(88, 87, 87, 0.1)"
            strokeWidth="2"
          />
        )}
        {showPoints &&
          calibrateCamera[selectedCamera].cameraZoneData[color] &&
          calibrateCamera[selectedCamera].cameraZoneData[color].map(
            (point, index) => (
              <Draggable
                key={index}
                onDrag={(e, data) => handleDrag(e, data, index)}
                position={{ x: point.x, y: point.y }}
              >
                <circle
                  r="8"
                  fill={colorBackgrounds[color][1]}
                  stroke="black"
                  cursor="pointer"
                />
              </Draggable>
            )
          )}
      </svg>
    </div>
  );
};

export default ResizePolygon;
