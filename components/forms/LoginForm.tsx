"use client";
import { login, signup } from "@/utils/server_actions/auth";
import isEmail from "validator/es/lib/isEmail";
import { Button, Input } from "@nextui-org/react";
import React, {
  ChangeEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { MdCancel, MdEmail } from "react-icons/md";
import { useContext } from "react";
import { UserContext } from "../providers/UserContextProvider";
interface userData {
  email: string;
  password: string;
  passwordConfirm: "";
  name: string;
}
export default function LoginForm({
  loginFormVisible,
  type,
}: {
  loginFormVisible: React.Dispatch<SetStateAction<boolean>>;
  type: "login" | "signup" | undefined;
}) {
  const { setUser } = useContext(UserContext);
  const [userData, setUserData] = useState<userData>({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  } as userData);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  /**
   * This function sets the userData object using the onChange event and assigns the
   * values to name and password from the inout elements
   * @param e
   */
  const handleInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev: userData) => ({ ...prev, [name]: value }) as userData);
  }, []);

  //toggles the visiblity of password
  const toggleVisibility = () => setIsVisible((prev) => !prev);
  const validateuserData = useCallback(
    (userData: userData) => {
      setValidated(() => {
        let isValid =
          userData.password.length >= 12 &&
          userData.password.length <= 20 &&
          isEmail(userData.email);

        if (type === "signup") {
          isValid = isValid && userData.name ? true : false;

          isValid = isValid && userData.password === userData.passwordConfirm;
        }
        return isValid;
      });
    },
    [type]
  );
  /*
   * Call the server action to login using the auth API
  clear the from
   *
   */
  const handleLogin = useCallback(async () => {
    setButtonLoading(true);
    try {
      const loginData = await login({
        email: userData.email,
        password: userData.password,
      });

      //extract error and user data from response
      const { error, data } = loginData;

      // in case authentication process fails
      if (error) throw new Error(error);

      if (data.user) {
        if (Object.keys(data.user).length === 0)
          throw new Error("Failed to Fetch user");
        //on successfull authentication set the userdata to the context provider
        setUser({ ...data.user });
        setButtonLoading(false);
        loginFormVisible(false);
      }
    } catch (err: any) {
      alert(err.message);
      setButtonLoading(false);
    }
  }, [userData.email, userData.password, loginFormVisible, setUser]);

  const handleSignup = async () => {
    setButtonLoading(true);
    try {
      const res = await signup(JSON.stringify(userData));
      //extract error and user data from response
      const { error, data } = res;

      // in case authentication process fails
      if (error) throw new Error(error);

      if (data.user) {
        if (Object.keys(data.user).length === 0)
          throw new Error("Failed to Fetch user");
        //on successfull authentication set the userdata to the context provider
        setUser({ ...data.user });
        setButtonLoading(false);
        loginFormVisible(false);
      }
    } catch (err: any) {
      alert(err.message);
      setButtonLoading(false);
    }
  };
  //validate userData on every change in email or password
  useEffect(() => {
    validateuserData(userData);
  }, [userData, validateuserData]);

  return (
    <div className="sticky top-0 w-full h-svh z-50 bg-white flex items-center justify-center">
      <MdCancel
        className="cursor-pointer absolute top-2 left-2"
        size={32}
        onClick={() => loginFormVisible(false)}
      />
      <div className="flex flex-col p-4 gap-4 items-center justify-center">
        {type === "signup" && (
          <Input
            onChange={(e) => handleInput(e)}
            value={userData.name}
            type="text"
            name="name"
            label="Name"
            variant="bordered"
            placeholder="John Doe"
            labelPlacement="inside"
          />
        )}
        <Input
          onChange={(e) => handleInput(e)}
          value={userData.email}
          type="email"
          name="email"
          label="Email"
          variant="bordered"
          placeholder="you@example.com"
          labelPlacement="inside"
          endContent={
            <MdEmail className="text-xl text-default-400 pointer-events-none flex-shrink-0" />
          }
        />
        {type === "login" && (
          <p className="text-gray-400">admin: admin@natours.io</p>
        )}
        <Input
          label="Password"
          name="password"
          onChange={handleInput}
          variant="bordered"
          placeholder="Enter your password"
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <FaEye className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
          className="max-w-xs"
        />
        {type === "login" && (
          <p className="text-gray-400">hint: manjotbenipal</p>
        )}
        {type === "signup" && (
          <Input
            label="Confirm Password"
            name="passwordConfirm"
            onChange={handleInput}
            variant="bordered"
            placeholder="Confirm Password"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <FaEye className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
            className="max-w-xs"
          />
        )}
        <Button
          //check if the data inside userData object passes validation
          isDisabled={!validated}
          isLoading={buttonLoading}
          color="primary"
          variant="ghost"
          onClick={type === "login" ? handleLogin : handleSignup}
          spinner={<FaSpinner className="animate-spin" />}
        >
          {type === "login" ? "Login" : "Signup"}
        </Button>
      </div>
    </div>
  );
}
