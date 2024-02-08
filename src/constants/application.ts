import LogoButton from "/src/assets/gooddaisy_logo.svg"; // Import LogoButton as needed
import React from "react";

export const TAILWIND_CLASSES = {
  icon: "fa-solid fa-xl",
  logoButton: "h-6",
};

export interface FooterItem {
  icon: JSX.Element;
  text: string;
  url: string;
}

export const FOOTER_ITEMS: FooterItem[] = [
  {
    icon: React.createElement("i", { className: `fa ${TAILWIND_CLASSES.icon} fa-user` }),
    text: "Member",
    url: "/member",
  },
  {
    icon: React.createElement("i", { className: `fa ${TAILWIND_CLASSES.icon} fa-hand` }),
    text: "Activity",
    url: "/activity",
  },
  {
    icon: React.createElement("img", { src: LogoButton, alt: "Logo", className: TAILWIND_CLASSES.logoButton }),
    text: "Home",
    url: "/",
  },
  {
    icon: React.createElement("i", { className: `fa ${TAILWIND_CLASSES.icon} fa-box` }),
    text: "Tracking",
    url: "/tracking",
  },
  {
    icon: React.createElement("i", { className: `fa ${TAILWIND_CLASSES.icon} fa-cart-shopping` }),
    text: "Cart",
    url: "/cart",
  },
];