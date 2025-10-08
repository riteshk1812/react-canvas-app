import React, { useRef, useEffect } from "react";
import { Transformer } from "react-konva";

export default function KonvaTransformer({ selectedIds, nodesMap }) {
  const trRef = useRef();

  useEffect(() => {
    const stage = trRef.current?.getStage();
    if (!stage) return;
    const selectedNodes = selectedIds.map((id) => nodesMap[id]).filter(Boolean);
    trRef.current.nodes(selectedNodes);
    trRef.current.getLayer()?.batchDraw();
  }, [selectedIds, nodesMap]);

  return <Transformer ref={trRef} rotateEnabled={true} />;
}
