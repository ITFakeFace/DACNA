import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import './ForgotPasswordPage.css';
import { InputOtp } from "primereact/inputotp";

const ForgotPasswordPage = () => {
  const cooldownBase = 60;
  const [email, setEmail] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  const [cooldown, setCooldown] = useState(cooldownBase);

  return (
    <form action="" autoComplete="off" className="flex flex-wrap w-full justify-around align-middle items-center bg-amber-100">
      <div className="w-3/4 bg-white h-fit px-20 py-10 items-center">
        <div className="w-full form-title text-4xl font-bold text-center">Recovery Password</div>
        <div className="w-full p-inputgroup flex-1">
          <span className="p-inputgroup-addon">
            <FontAwesomeIcon icon={faEnvelope} />
          </span>
          <InputText placeholder="Email" />
        </div>
        <div>
          <InputOtp value={confirmCode} length={6} onChange={(e) => setConfirmCode(e.value)} mask />
        </div>
      </div>
    </form>
  )
}

export default ForgotPasswordPage;