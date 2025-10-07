import React, { useState, useEffect, forwardRef } from "react";
import { Image } from "react-konva";

const ImageUrl = forwardRef(({ shape, onClick, onDragEnd }, ref) => {
  const [img, setImg] = useState(null);

  useEffect(() => {
    if (!shape.src) return;
    const image = new window.Image();
    image.crossOrigin = "Anonymous";
    image.onload = () => setImg(image);
    image.src = shape.src;
  }, [shape.src]);

  return (
    <Image
      ref={ref}
      x={shape.x}
      y={shape.y}
      image={img}
      width={shape.width}
      height={shape.height}
      draggable
      onClick={onClick}
      onTap={onClick}
      onDragEnd={onDragEnd}
      onTransformEnd={(e) => {
        const node = ref && ref.current ? ref.current : e.target;
        node.scaleX(1);
        node.scaleY(1);
      }}
    />
  );
});

export default ImageUrl;
