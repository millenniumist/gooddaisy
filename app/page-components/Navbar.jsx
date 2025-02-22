"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useMainStorage } from "@/store/mainStorage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef(null);
  const {
    user,
    isLoggedIn,
    checkOutAlready,
    setLogout,
    isAdmin,
    setUser,
    setIsLoggedIn,
    setIsAdmin,
  } = useMainStorage();
  const [navItems, setNavItems] = useState([
    { label: "Home", href: "/" },
    { label: "Cart", href: "/cart" },
    { label: "Contact Us", href: "/contact" },
  ]);
console.log(user)
  const handleLogin = async () => {
    try {
      await signIn("line");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const authItem = session
    ? {
        label: "Logout",
        href: "#",
        onClick: () => {
          setLogout();
          signOut({ callbackUrl: "/login" });
        },
      }
    : {
        label: "Login",
        href: "#",
        onClick: handleLogin,
      };

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
      setIsLoggedIn(true);
      setIsAdmin(session.user.isAdmin);

      // Handle cart transfer if needed
      const localCart = JSON.parse(localStorage.getItem("gooddaisyCart") || "[]");
      if (localCart.length > 0) {
        fetch(`${process.env.NEXT_PUBLIC_URL}api/cart/transfer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session.user.id,
            cartItems: localCart,
          }),
        }).then(() => {
          localStorage.removeItem("gooddaisyCart");
          window.location.reload();
        });
      }
    }
  }, [session]);

  useEffect(() => {
    const updatedNavItems = [
      { label: "Home", href: "/" },
      { label: "Cart", href: "/cart" },
      { label: "Contact Us", href: "/contact" },
      isLoggedIn ? { label: "Profile", href: "/profile" } : null,
      checkOutAlready ? { label: "Checkout", href: "/checkout" } : null,
      isAdmin ? { label: "Manage Order", href: "/orders" } : null,
      isAdmin ? { label: "Print Order", href: "/print" } : null,
      isAdmin ? { label: "Add Product", href: "/add-product" } : null,
      isAdmin ? { label: "Delete Product", href: "/del-product" } : null,
    ].filter((item) => item !== null);

    setNavItems(updatedNavItems);
  }, [isLoggedIn, checkOutAlready, setLogout, isAdmin, user]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (navRef.current && !navRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md">
      <Link href="/">
        <Avatar>
          <AvatarImage
            src="https://res.cloudinary.com/ddcjkc1ns/image/upload/v1729156722/logo_qcsnl6.jpg"
            alt="Good Daisy Logo"
          />
          <AvatarFallback>GD</AvatarFallback>
        </Avatar>
      </Link>
      <Link href={session ? "/profile" : "#"}>
        <div className="flex items-center gap-4 cursor-pointer">
          <Avatar>
            <AvatarImage src={session?.user?.pictureUrl} alt="User avatar" />
            <AvatarFallback>{session?.user?.displayName?.[0] || "G"}</AvatarFallback>
          </Avatar>
          <h2>Welcome {session?.user?.displayName || user?.displayName || "Guest"}</h2>
        </div>
      </Link>
      <div className="hidden custom:flex space-x-4">
        {navItems.map((item) => (
          <Link key={item.label} href={item.href} onClick={item.onClick}>
            <Button variant="ghost">{item.label}</Button>
          </Link>
        ))}
        {authItem && (
          <Button variant="ghost" onClick={authItem.onClick}>
            {authItem.label}
          </Button>
        )}
      </div>
      <div className="custom:hidden">
        <Button variant="outline" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
      <div
        ref={navRef}
        className={`fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg p-4 transition-all transform ease-in-out duration-300 custom:hidden ${
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
          )}
        </nav>
      </div>
    </nav>
  );
};

export default Navbar;
