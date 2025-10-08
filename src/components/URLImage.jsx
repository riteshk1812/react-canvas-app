import React, { useEffect, useState } from "react";
import { Image } from "react-konva";

export default function URLImage({ src, ...props }) {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => setImage(img);
  }, [src]);

  return <Image image={image} {...props} />;
}
