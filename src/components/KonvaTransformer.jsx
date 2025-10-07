import React, { useRef, useEffect } from "react";
import { Transformer } from "react-konva";

export default function KonvaTransformer({ selectedIds, nodesMap, onTransformEnd }) {
  const trRef = useRef();

  useEffect(() => {
    const stage = trRef.current?.getStage();
    if (!stage) return;
    const selectedNodes = selectedIds.map((id) => nodesMap[id]).filter(Boolean);
    trRef.current.nodes(selectedNodes);
    trRef.current.getLayer()?.batchDraw();
  }, [selectedIds, nodesMap]);

  return (
    <Transformer
      ref={trRef}
      rotateEnabled
      enabledAnchors={[
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right",
        "middle-left",
        "middle-right",
        "top-center",
        "bottom-center",
      ]}
      onTransformEnd={onTransformEnd}
    />
  );
}
