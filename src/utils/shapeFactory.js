export const GRID = 10;

export function ShapeFactory(type, opts = {}) {
  const base = {
    id: `id_${Math.random().toString(36).slice(2, 9)}`,
    x: 50 + Math.round(Math.random() * 200),
    y: 50 + Math.round(Math.random() * 200),
    rotation: 0,
    draggable: true,
  };

  switch (type) {
    case "rect":
      return { ...base, type: "rect", width: 120, height: 80, fill: "#6aa84f", stroke: "#333", strokeWidth: 1, ...opts };
    case "circle":
      return { ...base, type: "circle", radius: 40, fill: "#3c78d8", stroke: "#333", strokeWidth: 1, ...opts };
    case "text":
      return { ...base, type: "text", text: "Double-click to edit", fontSize: 18, width: 200, fill: "#111", ...opts };
    case "image":
      return { ...base, type: "image", width: 200, height: 120, src: null, ...opts };
    default:
      return null;
  }
}
