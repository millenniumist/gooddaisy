
import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const Navbar = () => {
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Login', href: '/login' },
    { label: 'Contact Us', href: '/contact' },
  ];

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md">
      <div className="flex items-center">
        <Link href="/">
          <span className="text-xl font-bold">Logo</span>
        </Link>
      </div>
      <div className="hidden md:flex space-x-4">
        {navItems.map((item) => (
          <Link key={item.label} href={item.href}>
            <Button variant="ghost">{item.label}</Button>
          </Link>
        ))}
      </div>
      <Sheet>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="outline" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <nav className="flex flex-col space-y-4 mt-4">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href}>
                <Button variant="ghost" className="w-full justify-start">
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default Navbar;
