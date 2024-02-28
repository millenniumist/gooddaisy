import React from "react";

interface SecondaryButtonProps {
  title: string;
  onClick: () => void;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  value,
  onClick,
}) => {
  return (
    <button
      className="flex content-center items-center justify-center rounded-lg p-4 bg-white w-5/6 text-primary cursor-pointer shadow-md"
      onClick={onClick}
    >
      <h1 className="font-bold text-lg mx-3">{title}</h1>
    </button>
  );
};

export default SecondaryButton;
