import React, { useState, useEffect } from "react";
import Toolbar from "./components/Toolbar";
import CanvasStage from "./components/CanvasStage";
import { ShapeFactory } from "./utils/shapeFactory";
import "./App.css";

export default function App() {
  const [shapes, setShapes] = useState([
    ShapeFactory("rect"),
    ShapeFactory("circle"),
    ShapeFactory("text"),
  ]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const handler = (ev) => {
      if ((ev.key === "Delete" || ev.key === "Backspace") && selectedIds.length) {
        setShapes((prev) => prev.filter((s) => !selectedIds.includes(s.id)));
        setSelectedIds([]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedIds]);

  const saveJSON = () => {
    const json = JSON.stringify(shapes);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "canvas.json";
    a.click();
  };

  const loadJSON = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => setShapes(JSON.parse(e.target.result));
    reader.readAsText(file);
  };

  const exportPNG = () => {
    const uri = document.querySelector("canvas").toDataURL("image/png");
    const a = document.createElement("a");
    a.href = uri;
    a.download = "canvas.png";
    a.click();
  };

  const uploadImage = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setShapes((s) => [...s, ShapeFactory("image", { src: e.target.result })]);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Toolbar
        onAddRect={() => setShapes((s) => [...s, ShapeFactory("rect")])}
        onAddCircle={() => setShapes((s) => [...s, ShapeFactory("circle")])}
        onAddText={() => setShapes((s) => [...s, ShapeFactory("text")])}
        onUploadImage={uploadImage}
        onSave={saveJSON}
        onLoad={loadJSON}
        onExport={exportPNG}
        selectedCount={selectedIds.length}
      />
      <CanvasStage shapes={shapes} setShapes={setShapes} selectedIds={selectedIds} setSelectedIds={setSelectedIds} />
    </div>
  );
}
