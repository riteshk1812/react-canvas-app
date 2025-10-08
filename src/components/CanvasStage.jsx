import React, { useRef, useState } from "react";
import { Stage, Layer, Rect, Circle, Text } from "react-konva";
import KonvaTransformer from "./KonvaTransformer";
import URLImage from "./URLImage";
import { GRID } from "../utils/shapeFactory";

export default function CanvasStage({ shapes, setShapes, selectedIds, setSelectedIds }) {
  const stageRef = useRef();
  const layerRef = useRef();
  const nodeRefs = useRef({});
  const marqueeRef = useRef(null);
  const [isMarquee, setIsMarquee] = useState(false);

  const onStageMouseDown = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedIds([]);
      const pos = e.target.getPointerPosition();
      marqueeRef.current = { x: pos.x, y: pos.y, w: 0, h: 0 };
      setIsMarquee(true);
    }
  };

  const onStageMouseMove = (e) => {
    if (!isMarquee || !marqueeRef.current) return;
    const pos = e.target.getPointerPosition();
    marqueeRef.current.w = pos.x - marqueeRef.current.x;
    marqueeRef.current.h = pos.y - marqueeRef.current.y;
    layerRef.current.batchDraw();
  };

  const onStageMouseUp = () => {
    if (!isMarquee || !marqueeRef.current) return;
    const box = marqueeRef.current;
    const shapesInArea = shapes
      .filter((s) => {
        const node = nodeRefs.current[s.id];
        if (!node) return false;
        const shapeBox = node.getClientRect();
        return (
          shapeBox.x > Math.min(box.x, box.x + box.w) &&
          shapeBox.x + shapeBox.width < Math.max(box.x, box.x + box.w) &&
          shapeBox.y > Math.min(box.y, box.y + box.h) &&
          shapeBox.y + shapeBox.height < Math.max(box.y, box.y + box.h)
        );
      })
      .map((s) => s.id);

    setSelectedIds(shapesInArea);
    setIsMarquee(false);
    marqueeRef.current = null;
  };

  const handleSelect = (e, id) => {
    const isShift = e.evt.shiftKey;
    if (isShift) {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
      );
    } else {
      setSelectedIds([id]);
    }
  };

  const handleDragEnd = (e, id) => {
    const node = e.target;
    const snappedX = Math.round(node.x() / GRID) * GRID;
    const snappedY = Math.round(node.y() / GRID) * GRID;
    updateShape(id, { x: snappedX, y: snappedY });
  };

  const handleTransformEnd = (e, id) => {
    const node = e.target;
    const shape = shapes.find((s) => s.id === id);
    if (!shape) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    const updated = {
      ...shape,
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
    };

    if (shape.type === "rect" || shape.type === "image") {
      updated.width = Math.max(20, node.width() * scaleX);
      updated.height = Math.max(20, node.height() * scaleY);
    } else if (shape.type === "circle") {
      updated.radius = Math.max(10, shape.radius * scaleX);
    }

    updateShape(id, updated);
  };

  const updateShape = (id, newAttrs) => {
    setShapes((prev) => prev.map((s) => (s.id === id ? { ...s, ...newAttrs } : s)));
  };

  const renderNode = (shape) => {
    const commonProps = {
      key: shape.id,
      ref: (node) => (nodeRefs.current[shape.id] = node),
      draggable: true,
      onClick: (e) => handleSelect(e, shape.id),
      onTap: (e) => handleSelect(e, shape.id),
      onDragEnd: (e) => handleDragEnd(e, shape.id),
      onTransformEnd: (e) => handleTransformEnd(e, shape.id),
    };

    switch (shape.type) {
      case "rect":
        return (
          <Rect
            {...commonProps}
            x={shape.x}
            y={shape.y}
            width={shape.width}
            height={shape.height}
            fill={shape.fill}
            stroke={selectedIds.includes(shape.id) ? "#00BFFF" : shape.stroke}
            strokeWidth={2}
            cornerRadius={5}
          />
        );

      case "circle":
        return (
          <Circle
            {...commonProps}
            x={shape.x}
            y={shape.y}
            radius={shape.radius}
            fill={shape.fill}
            stroke={selectedIds.includes(shape.id) ? "#00BFFF" : shape.stroke}
            strokeWidth={2}
          />
        );

      case "text":
        return (
          <Text
            {...commonProps}
            x={shape.x}
            y={shape.y}
            text={shape.text}
            fontSize={shape.fontSize}
            width={shape.width}
            fill={shape.fill}
          />
        );

      case "image":
        return <URLImage {...commonProps} {...shape} />;

      default:
        return null;
    }
  };

  return (
    <div className="canvas-container">
      <Stage
        width={1200}
        height={700}
        onMouseDown={onStageMouseDown}
        onMouseMove={onStageMouseMove}
        onMouseUp={onStageMouseUp}
        ref={stageRef}
        style={{ cursor: isMarquee ? "crosshair" : "default" }}
      >
        <Layer ref={layerRef}>
          {shapes.map((s) => renderNode(s))}
          <KonvaTransformer selectedIds={selectedIds} nodesMap={nodeRefs.current} />
          {isMarquee && marqueeRef.current && (
            <Rect
              x={Math.min(marqueeRef.current.x, marqueeRef.current.x + marqueeRef.current.w)}
              y={Math.min(marqueeRef.current.y, marqueeRef.current.y + marqueeRef.current.h)}
              width={Math.abs(marqueeRef.current.w)}
              height={Math.abs(marqueeRef.current.h)}
              fill="rgba(51,153,255,0.15)"
              stroke="#3399ff"
              dash={[4, 4]}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}
