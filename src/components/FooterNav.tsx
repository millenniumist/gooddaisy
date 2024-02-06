import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FOOTER_ITEMS } from "../constants/application";

interface FooterNavItemProps {
  icon: JSX.Element;
  text: string;
  url: string;
  selected: boolean; // Add a selected prop to indicate if the item is selected
}

const FooterNavItem: React.FC<FooterNavItemProps> = ({
  icon,
  text,
  url,
  selected,
}) => {
  return (
    <a href={url} className={selected ? "selected" : "text-primary"}>
      <button>
        {icon}
        <div className="text-sm">{text}</div>
      </button>
    </a>
  );
};

const FooterNav: React.FC = () => {
  const location = useLocation();
  const [selectedItem] = useState(location.pathname); // State to track the selected menu item
  useEffect(() => {
    const testmap = FOOTER_ITEMS.map((navcomponent, i) => {
      // console.log(index, menu);
      const newDetail = `${i + 1} ${navcomponent.text} `;
      navcomponent.detail = newDetail;
      if (navcomponent.text.length <= 4){
        return navcomponent
      }
      
    })

    const testfilter = FOOTER_ITEMS.filter((navcomponent) => {
      return navcomponent.text.length <= 4 
    });

    const testfind = FOOTER_ITEMS.find((navcomponent)=>{

      return navcomponent.text.toLowerCase().includes("h")
    })

    console.log(testmap);
  }, []);

  return (
    <nav className="fixed inset-x-0 bottom-0 bg-white">
      <ul className="flex justify-around h-11 my-2 boxShadow">
        {FOOTER_ITEMS.map((item, index) => (
          <FooterNavItem
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
