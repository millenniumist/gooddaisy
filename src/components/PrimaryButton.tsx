import React from "react";
import { Button } from "@material-tailwind/react";

interface PrimaryButtonProps {
  title: string;
  value?: string;
  onClick: () => void;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  value,
  onClick,
}) => {
  return (

    <div className="mx-3 my-2">
      <Button
        fullWidth
        onClick={onClick}
        placeholder={undefined}
        className="bg-primary flex flex-row items-center justify-center shadow-md"
      >
        <h1 className="font-bold text-lg">{title}</h1>
        <h3 className="text-sm">{value}</h3>
      </Button>
    </div>
  );
};

export default PrimaryButton;
