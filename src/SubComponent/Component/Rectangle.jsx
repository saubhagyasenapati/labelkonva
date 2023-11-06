import React from "react";
import { Stage, Layer, Rect, Image, Text, Group } from "react-konva";
import { dragBoundFuncRectangle } from "../utils";
import RTransformer from "../utils/rttransformer";


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
  const [isHovered, setIsHovered] = React.useState(false);

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
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
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
        {isHovered && (
          <Text
            text={shapeProps.label} // The text you want to display
            x={shapeProps.x}
            y={shapeProps.y - 15} // Adjust the vertical position as needed
            align="center" // Optional: Text alignment
            fill="red"
          />
        )}
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
            limitedBox.width = Math.max(10, limitedBox.width);
            limitedBox.height = Math.max(10, limitedBox.height);
            // Calculate the maximum x and y positions based on the 'size' prop
            const maxX = size.width - limitedBox.width;
            const maxY = size.height - limitedBox.height;
            const maxX1 = size.width - oldBox.x;
            const maxY1 = size.height - oldBox.y;
            // Ensure the new x and y values don't exceed the maximum positions
            if(limitedBox.width === 10) {
              limitedBox.x = oldBox.x;
            } else {
              limitedBox.x = Math.min(maxX, Math.max(0, newBox.x));
            }
            if(limitedBox.height === 10) {
              limitedBox.y = oldBox.y;
            } else {
              limitedBox.y = Math.min(maxY, Math.max(0, newBox.y));
            }
            return limitedBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

export default Rectangle