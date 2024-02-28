import React from "react";

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
    <button
      className="flex items-center justify-center rounded-lg p-4 bg-primary w-5/6 sm:w-auto text-white cursor-pointer shadow-md"
      onClick={onClick}
    >
      <h1 className="font-bold text-lg mx-3">{title}</h1>
      <h3 className="text-sm">{value}</h3>
    </button>
  );
};

export default PrimaryButton;
