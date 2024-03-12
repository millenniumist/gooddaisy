import React from "react";
import { Button } from "@material-tailwind/react";

interface SecondaryButtonProps {
  title: string;
  onClick: () => void;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  onClick,
}) => {
  return (
    // <button
    //   className="flex content-center items-center justify-center rounded-lg p-4 bg-white w-5/6 text-primary cursor-pointer shadow-md"
    //   onClick={onClick}
    // >
    //   <h1 className="font-bold text-lg mx-3 ">{title}</h1>
    // </button>
    <div className="mx-3 my-2">
      <Button
        variant="outlined"
        fullWidth
        onClick={onClick}
        placeholder={undefined}
        className="bg-white flex flex-row items-center justify-center shadow-md text-primary border-primary border-2"
      >
        <h1 className="font-bold text-lg">{title}</h1>
      </Button>
    </div>
  );
};

export default SecondaryButton;
