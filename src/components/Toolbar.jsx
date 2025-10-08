import React from "react";

export default function Toolbar({
  onAddRect,
  onAddCircle,
  onAddText,
  onUploadImage,
  onSave,
  onLoad,
  onExport,
  selectedCount,
}) {
  return (
    <div className="toolbar">
      <button onClick={onAddRect}>Add Rect</button>
      <button onClick={onAddCircle}>Add Circle</button>
      <button onClick={onAddText}>Add Text</button>

      <label className="upload">
        Upload Image
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => e.target.files[0] && onUploadImage(e.target.files[0])}
        />
      </label>

      <button className="secondary" onClick={onSave}>
        Save JSON
      </button>

      <label className="load">
        Load JSON
        <input
          type="file"
          accept="application/json"
          style={{ display: "none" }}
          onChange={(e) => e.target.files[0] && onLoad(e.target.files[0])}
        />
      </label>

      <button onClick={onExport}>Export PNG</button>

      <div className="selected-count">Selected: {selectedCount}</div>
    </div>
  );
}
