
import AuthWrapper from "@/utils/AuthWrapper";
import MainProductList from "./MainProductList";
import SubProductList from "./SubProductList";

//ngrok http --domain=choice-arriving-drake.ngrok-free.app 3000


export default async function ProductShowcase() {
  return (
    <AuthWrapper>
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Select Your Flower Preservation Mold</h1>
      <MainProductList />
      <h1 className="text-3xl font-bold mb-6 text-center">Sub Product - to be conditioned</h1>
      <SubProductList />
    </div>
    </AuthWrapper>
  );
}
