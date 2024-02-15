import { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const ex_images = [
  {
    original: "https://picsum.photos/id/1018/1000/600/",
    thumbnail: "https://picsum.photos/id/1018/250/150/",
  },
  {
    original: "https://picsum.photos/id/1015/1000/600/",
    thumbnail: "https://picsum.photos/id/1015/250/150/",
  },
  {
    original: "https://picsum.photos/id/1019/1000/600/",
    thumbnail: "https://picsum.photos/id/1019/250/150/",
  },
];

interface ProductImage {
  original: string;
  thumbnail: string;
}

interface ProductGalleryProps {
  images: ProductImage[];
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
  images = ex_images,
}) => {
  const [renderImages, setRenderImages] = useState([]);
  useEffect(() => {
    const mappedImages = images.map((image) => ({
      ...image,
      thumbnailWidth: 1, // Adjust thumbnail width
      thumbnailHeight: 1, // Adjust thumbnail height
      sizes: "100vw", // Adjust sizes if needed
      originalWidth: 50, // Adjust original width
      showPlayButton: false // Hide play button
    }));
    setRenderImages(mappedImages);
  }, [images]);

  

  return (
    <div className="m-10">
      <ImageGallery items={renderImages} infinite showPlayButton = {false}  />
    </div>
  );
};



export default ProductGallery;
