import { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

interface ProductGalleryProps {
  images: string[];
}

interface ImageForRender {
  original: string;
  thumbnai: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
  const [renderedImages, setRenderedImages] = useState<ImageForRender[]>([]);

  useEffect(() => {
    if (!images || images.length === 0) {
      return;
    }
    
    const imagesToRender = images.map((image) => ({
      original: image,
      thumbnail: image,
    }));
    setRenderedImages(imagesToRender);
   
  }, [images]); // Only re-run when 'images' prop changes

  return (
    <div className="m-10">
      <ImageGallery items={renderedImages} infinite showPlayButton={false} />
    </div>
  );
};

export default ProductGallery;
