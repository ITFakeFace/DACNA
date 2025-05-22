import { faEnvelope, faKey, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";
import './ForgotPasswordPage.css';
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { postRequest } from "../../services/APIService";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";

const ForgotPasswordPage = () => {
  const emptyModel = {
    email: "",
    code: "",
    correctCode: "",
    password: "",
    confirmPassword: "",
  };

  const cooldownBase = 60;
  const [cooldown, setCooldown] = useState(0);
  const [sendCode, setSendCode] = useState(false);
  const [submited, setSubmitted] = useState(false);
  const [formModel, setFormModel] = useState(emptyModel);
  const navigate = useNavigate();
  const toast = useRef(null);

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    setFormModel({ ...formModel, [name]: val });
  };

  const handleSendCode = async () => {
    setSendCode(true);
    if (!formModel.email) return;

    try {
      // Gửi email (dạng string) nên bạn phải truyền đúng kiểu vào body
      var body = { "email": formModel.email };
      var res = await postRequest("/authentication/send-code-forgot-password", body);
      if (res.status == true) {
        formModel.correctCode = res.data
      }
      setCooldown(cooldownBase);
      setSendCode(false);
      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Email has been sent',
        life: 3000,
      });
    } catch (error) {
      console.error("Failed to send code:", error);
    }
  };

  const handleResetPassword = async () => {
    setSubmitted(true);

    if (
      formModel.email &&
      formModel.code &&
      formModel.password &&
      formModel.confirmPassword &&
      formModel.password === formModel.confirmPassword
    ) {
      try {
        var res = await postRequest("/authentication/confirm-code-forgot-password", formModel);
        if (res.data == 401) {

        } else if (res.data == 402) {

        } else if (res.status == true) {
          setFormModel(emptyModel);
          toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Password changed',
            life: 3000,
          });
          navigate("/login");
        }
      } catch (error) {
        alert("Reset failed. Please check your code and try again.");
      }
    }
  };

  useEffect(() => {
    const timer = cooldown > 0 ? setInterval(() => {
      setCooldown(prev => prev - 1);
    }, 1000) : null;
    return () => clearInterval(timer);
  }, [cooldown]);

  return (
    <form autoComplete="off" className="flex flex-wrap w-full justify-around align-middle items-center" onSubmit={(e) => e.preventDefault()}>
      <Toast ref={toast} />
      <div className="md:w-3/4 lg:w-1/2 bg-white h-fit px-20 py-10 items-center gap-5 flex flex-wrap flex-col form-container">
        <div className="w-full form-title text-4xl font-bold text-center py-10">Recovery Password</div>

        <div className="w-full flex flex-wrap flex-col gap-5">
          <div className="w-full p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
              <FontAwesomeIcon icon={faEnvelope} />
            </span>
            <InputText value={formModel.email} onChange={(e) => onInputChange(e, 'email')} placeholder="Email" type="email" />

          </div>
          {(sendCode || submited) && formModel.email == "" ?
            <small className="p-error">Email is Required.</small>
            : <></>}
        </div>
        <div className="w-full p-inputgroup flex-1">
          <span className="p-inputgroup-addon">
            <FontAwesomeIcon icon={faKey} />
          </span>
          <InputText value={formModel.code} onChange={(e) => onInputChange(e, 'code')} placeholder="OTP Code" />
          <Button outlined severity="info" onClick={handleSendCode} disabled={cooldown > 0}>
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Send Code"}
          </Button>
        </div>

        <div className="w-full flex flex-wrap flex-col gap-5">
          <div className="w-full p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
              <FontAwesomeIcon icon={faLock} />
            </span>
            <Password value={formModel.password} onChange={(e) => onInputChange(e, 'password')} placeholder="Enter new Password" />
          </div>
          <div className="w-full p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
              <FontAwesomeIcon icon={faLock} />
            </span>
            <Password value={formModel.confirmPassword} onChange={(e) => onInputChange(e, 'confirmPassword')} placeholder="Enter Confirm Password" />
          </div>
          {submited && formModel.password && formModel.confirmPassword && formModel.password !== formModel.confirmPassword &&
            <small className="p-error">Password and Confirm Password are not matched.</small>
          }
        </div>

        <div className="w-full flex justify-center py-10">
          <Button severity="contrast" onClick={handleResetPassword}>Reset Password</Button>
        </div>
      </div>
    </form>
  );
};

export default ForgotPasswordPage;
