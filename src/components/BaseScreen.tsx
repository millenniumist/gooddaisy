import React, { ReactNode } from "react";

interface BaseScreenProps {
  children: ReactNode;
}

const BaseScreen: React.FC<BaseScreenProps> = ({ children }) => {
  return (
    <div className="mb-28">
      {children}
    </div>
  );
};

export default BaseScreen;
