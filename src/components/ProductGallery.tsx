import { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { useParams } from 'react-router-dom';


interface ProductImage {
  id: string;
  images: string;
}

interface ProductGalleryProps {
  images: ProductImage[];
}

interface Product {
  id: number; // Adjusted to match your JSON where IDs are numbers
  name: string;
  type: string;
  price: number;
  description: string;
  images: string[]; // Images are an array of string URLs
}



  const ProductGallery: React.FC<ProductGalleryProps> = () => {
    const [renderedImages, setRenderedImages] = useState([]);
    const { id } = useParams<{ id?: string }>(); // useParams hook to get the `id` from the route
  
    useEffect(() => {
      async function fetchData() {
        try {
          const response = await fetch("../../mock/GetProductList.json");
          const products = await response.json();
  
          // If an id is provided, find the product by id
          const productId = parseInt(id ?? '0', 10); // Convert id from string to number
          const selectedProduct = products.data.find((product: Product) => product.id === productId);
  
          if (selectedProduct) {
            // Map the images of the selected product for the ImageGallery
            const imagesToRender = selectedProduct.images.map((image: string) => ({
              original: image,
              thumbnail: image, // Assuming you use the same image for thumbnail, adjust if necessary
            }));
  
            setRenderedImages(imagesToRender);
          } else {
            // Handle the case where no product is found or no id is provided
            setRenderedImages([]);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, [id]); // Dependency array includes id, so it refetches data when id changes
  
    return (
      <div className="m-10">
        <ImageGallery items={renderedImages} infinite showPlayButton={false} />
      </div>
    );
  };
  
  export default ProductGallery;