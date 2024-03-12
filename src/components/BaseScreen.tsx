import React, { ReactNode } from "react";

interface BaseScreenProps {
  children: ReactNode;
}

const BaseScreen: React.FC<BaseScreenProps> = ({ children }) => {
  return (
    <div className="mb-28 w-full h-full ">
      {children}
    </div>
  );
};

export default BaseScreen;
