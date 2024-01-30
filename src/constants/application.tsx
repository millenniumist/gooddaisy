import LogoButton from "/src/assets/gooddaisy_logo.svg"; // Import LogoButton as needed

export interface FooterItem {
  icon: JSX.Element;
  text: string;
  url: string;
}

export const FOOTER_ITEMS: FooterItem[] = [
  {
    icon: <i className="fa-solid fa-user fa-xl" />,
    text: "Member",
    url: "/member",
  },
  {
    icon: <i className="fa-hand fa-solid fa-xl" />,
    text: "Activity",
    url: "/activity",
  },
  {
    icon: <img src={LogoButton} alt="Logo" className="h-6" />,
    text: "Home",
    url: "/",
  },
  {
    icon: <i className="fa-solid fa-box fa-xl" />,
    text: "Tracking",
    url: "/tracking",
  },
  {
    icon: <i className="fa-solid fa-cart-shopping fa-xl" />,
    text: "Cart",
    url: "/cart",
  },
];
