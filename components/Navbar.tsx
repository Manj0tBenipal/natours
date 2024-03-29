"use client";

import {
  Link,
  Navbar,
  NavbarContent,
  NavbarItem,
  Button,
  NavbarBrand,
} from "@nextui-org/react";
import LoginForm from "./forms/LoginForm";
import { useContext, useState } from "react";
import { UserContext } from "./providers/UserContextProvider";
import UserAvatar from "./ui/UserAvatar";
export default function NavbarComponent() {
  const [loginFormVisible, setLoginFormVisible] = useState<boolean>(false);
  const [formType, setFormType] = useState<"login" | "signup">();
  const { user } = useContext(UserContext);
  return (
    <>
      {loginFormVisible && (
        <LoginForm type={formType} loginFormVisible={setLoginFormVisible} />
      )}

      <Navbar className="flex min-w-full z-40 shadow-sm">
        <NavbarBrand
          as={Link}
          href="/"
          className="text-3xl font-extrabold text-[var(--color-primary)]"
        >
          Natours
        </NavbarBrand>
        <NavbarContent justify="start">
          <NavbarItem>
            <Link href="/tours">Tours</Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/users">Community</Link>
          </NavbarItem>
          {user?.role === "admin" && (
            <NavbarItem>
              <Link href="/dashboard">Dashboard</Link>
            </NavbarItem>
          )}
        </NavbarContent>
        <NavbarContent justify="end" className="flex justify-end space-x-0">
          {/* Check if the user is loggedIn */}
          {Object.keys(user).length === 0 ? (
            <>
              {!loginFormVisible && (
                <NavbarItem>
                  <Button
                    onClick={() => {
                      setFormType("login");
                      setLoginFormVisible(true);
                    }}
                    color="primary"
                    variant="bordered"
                  >
                    Login
                  </Button>
                </NavbarItem>
              )}
              <NavbarItem>
                <Button
                  onClick={() => {
                    setFormType("signup");
                    setLoginFormVisible(true);
                  }}
                  color="primary"
                  variant="solid"
                >
                  Signup
                </Button>
              </NavbarItem>
            </>
          ) : (
            <NavbarItem>
              <UserAvatar />
            </NavbarItem>
          )}
        </NavbarContent>
      </Navbar>
    </>
  );
}
