import React from "react";
import Image from "next/image";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";
import logo from '../logo-removebg-preview.png'
export default function Navbar1() {
  return (
    <div className=" text-white">
      <Navbar className="p-4">
        <NavbarBrand>
         <Link href='/'><p className="font-bold text-inherit"><Image src={logo} style={{paddingRight:"100px"}}></Image></p></Link> 
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link
              href="#"
              className="text-white hover:text-blue-500 transition-colors duration-300"
            >
              Features
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link
              href="/#"
              aria-current="page"
              className="text-white hover:text-blue-500 transition-colors duration-300"
            >
              Customers
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              href="#"
              className="text-white hover:text-blue-500 transition-colors duration-300"
            >
              Integrations
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem className="hidden lg:flex">
            <Link
              href="/login"
              className="text-white hover:text-blue-500 transition-colors duration-300"
            >
              Login
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/signup">
              <Button
                color="primary"
                href="#"
                variant="flat"
                className="hover:bg-blue-600 transition-colors duration-300"
              >
                Sign Up
              </Button>
            </Link>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </div>
  );
}
