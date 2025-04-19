import {
  Button,
  Checkbox,
  Group,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import "./LoginPage.css";
import EVOLEC_Logo from "../../assets/web_logo/EVOLEC_Logo.jpg";
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

    // Reset error
    setEmailError("");
    setPasswordError("");

    try {
      const response = await axios.post(
        "http://localhost:5208/api/authentication/login",
        {
          email,
          password,
          rememberMe,
        }
      );

      const token = response.data.data;
      localStorage.setItem("token", token);
      navigate("/");
      window.location.reload();
    } catch (error) {
      // Có thể tùy chỉnh thông báo lỗi chi tiết hơn nếu API trả về
      setEmailError(" ");
      setPasswordError("Email hoặc mật khẩu không chính xác");
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="flex flex-row flex-row-reverse flex-wrap-reverse form-container"
    >
      <div className="form-left md:basis-1/2 ">
        <Group gap={30} align="center" justify="center">
          <div className="font-bold text-5xl text-center">Đăng Nhập</div>

          <TextInput
            id="inp-email"
            size="lg"
            label="Email"
            description="Nhập email của bạn"
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
            description="Nhập mật khẩu của bạn"
            placeholder="Nhập mật khẩu"
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
              label="Ghi nhớ đăng nhập"
              size="md"
              radius="md"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.currentTarget.checked)}
            />
            <a href="/forgot-password">Quên mật khẩu?</a>
          </div>

          <div>
            <Button type="submit" size="lg" radius="md">
              Đăng nhập
            </Button>
          </div>
        </Group>
      </div>

      <div className="form-right md:basis-1/2">
        <img src={EVOLEC_Logo} alt="" className="form-img h-full" />
      </div>
    </form>
  );
};

export default LoginPage;
