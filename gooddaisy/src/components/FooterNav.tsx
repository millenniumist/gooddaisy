import React  from "react";
import { useLocation } from "react-router-dom";
import { FOOTER_ITEMS } from "../constants/application";

interface FooterNavProps {
  icon: JSX.Element;
  text: string;
  url: string;
  selected: boolean; // Add a selected prop to indicate if the item is selected
}

const FooterNavComponent: React.FC<FooterNavProps> = prop => {
  return (
    <a href={prop.url} className={prop.selected ? "selected" : "text-primary"}>
      <button>
        {prop.icon}
        <div className="text-sm">{prop.text}</div>
      </button>
    </a>
  );
};

const FooterNav: React.FC = () => {
  const location = useLocation();
  const selectedItem = location.pathname; // State to track the selected menu item

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 bg-white">
      <ul className="flex justify-around h-11 my-2 ">
        {FOOTER_ITEMS.map((item, index) => (
          <FooterNavComponent
            key={index}
            icon={item.icon}
            text={item.text}
            url={item.url}
            selected={item.url === selectedItem} // Check if the item's URL matches the selected item
          />
        ))}
      </ul>
    </nav>
  );
};

export default FooterNav;
