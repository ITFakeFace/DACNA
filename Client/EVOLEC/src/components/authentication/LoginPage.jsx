import {
  Button,
  Checkbox,
  Group,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import "./LoginPage.css";
import EVOLEC_LogoSquare from "../../assets/web_logo/EVOLEC_LogoSquare.jpg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    try {
      const response = await axios.post(
        "http://localhost:5208/api/authentication/login",
        { email, password, rememberMe }
      );

      const token = response.data.data;
      localStorage.setItem("token", token);
      console.log(token)
      window.location.replace("/");  // replacing navigate + reload by replace
    } catch (error) {
      setEmailError(" ");
      setPasswordError("Email hoặc mật khẩu không chính xác");
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="flex flex-row-reverse flex-wrap-reverse form-container"
    >
      <div className="form-left md:basis-1/2 ">
        <Group gap={30} align="center" justify="center">
          <div className="font-bold text-5xl text-center">Sign In</div>

          <TextInput
            id="inp-email"
            size="lg"
            label="Email"
            description="Enter your email"
            placeholder="example@abc.com"
            required
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            error={emailError}
            w={"100%"}
          />

          <PasswordInput
            id="inp-password"
            size="lg"
            label="Mật khẩu"
            description="Enter your password"
            placeholder="Enter password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            error={passwordError}
            w={"100%"}
          />

          <div className="w-full text-md justify-between flex">
            <Checkbox
              variant="outline"
              label="Remember Me"
              size="md"
              radius="md"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.currentTarget.checked)}
            />
            <a href="/forgot-password">Forgot Password?</a>
          </div>

          <div>
            <Button type="submit" size="lg" radius="md">
              Sign In
            </Button>
          </div>
        </Group>
      </div>

      <div className="form-right md:basis-1/2">
        <img src={EVOLEC_LogoSquare} alt="" className="form-img h-full" />
      </div>
    </form>
  );
};

export default LoginPage;
