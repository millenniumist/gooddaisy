"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useMainStorage } from "@/store/mainStorage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavItem {
  label: string;
  href: string;
  onClick?: () => void;
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const { user, isLoggedIn, checkOutAlready, setLogout, isAdmin } = useMainStorage();
  const [navItems, setNavItems] = useState<NavItem[]>([
    { label: "Home", href: "/" },
    { label: "Cart", href: "/cart" },
    { label: "Contact Us", href: "/contact" },
  ]);
  const [authItem, setAuthItem] = useState<NavItem | null>(null);

  useEffect(() => {
    const updatedNavItems: NavItem[] = [
      { label: "Home", href: "/" },
      { label: "Cart", href: "/cart" },
      { label: "Contact Us", href: "/contact" },
      isLoggedIn ? { label: "Profile", href: "/profile" } : null,
      checkOutAlready ? { label: "Checkout", href: "/checkout" } : null,
      isAdmin ? { label: "Manage Order", href: "/orders" } : null,
      isAdmin ? { label: "Print Order", href: "/print" } : null,
      isAdmin ? { label: "Add Product", href: "/add-product" } : null,
      isAdmin ? { label: "Delete Product", href: "/del-product" } : null,
    ].filter((item): item is NavItem => item !== null);

    setNavItems(updatedNavItems);

    setAuthItem(
      isLoggedIn
        ? {
            label: "Logout",
            href: "#",
            onClick: () => {
              setLogout();
              window.location.href = "/login";
            },
          }
        : { label: "Login", href: "/login" }
    );
  }, [isLoggedIn, checkOutAlready, setLogout, isAdmin]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (navRef.current && !navRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md">
      <Link href="/" >
        <Avatar>
          <AvatarImage src="https://res.cloudinary.com/ddcjkc1ns/image/upload/v1729156722/logo_qcsnl6.jpg" alt="Good Daisy Logo" />
          <AvatarFallback>GD</AvatarFallback>
        </Avatar>
      </Link>
      <Link href="/profile">
        <div className="flex items-center gap-4 cursor-pointer">
          <Avatar>
            <AvatarImage src={user?.pictureUrl} alt="User avatar" />
            <AvatarFallback>{user?.displayName?.[0] || 'G'}</AvatarFallback>
          </Avatar>
          <h2>Welcome {user?.displayName || "Guest"}</h2>
        </div>
      </Link>
      <div className="hidden md:flex space-x-4">
        {navItems.map((item) => (
          <Link key={item.label} href={item.href} onClick={item.onClick}>
            <Button variant="ghost">{item.label}</Button>
          </Link>
        ))}
        {authItem && (
          <Link href={authItem.href} onClick={authItem.onClick}>
            <Button variant="ghost">{authItem.label}</Button>
          </Link>
        )}
      </div>
      <div className="md:hidden">
        <Button variant="outline" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
      <div
        ref={navRef}
        className={`fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg p-4 transition-all transform ease-in-out duration-300 md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 right-4"
          onClick={() => setIsMenuOpen(false)}
        >
          <X className="h-6 w-6" />
        </Button>
        <nav className="flex flex-col space-y-4 mt-16">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href}>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  setIsMenuOpen(false);
                  item.onClick && item.onClick();
                }}
              >
                {item.label}
              </Button>
            </Link>
          ))}
          <hr className="my-4" />
          {authItem && (
            <Link href={authItem.href}>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  setIsMenuOpen(false);
                  authItem.onClick && authItem.onClick();
                }}
              >
                {authItem.label}
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </nav>
  );
};

export default Navbar;
