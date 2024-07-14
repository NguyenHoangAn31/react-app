import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";

import OtpInput from "otp-input-react";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "./firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";

const App = () => {
  const [otp, setOtp] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => {},
        }
      );
    }
  }

  function onSignup() {
    setLoading(true);
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;


    signInWithPhoneNumber(auth, `+${phone}`, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success("OTP sended successfully!");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
        setUser(res.user);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("OTP Incorrect!");
        console.log(err);
        setLoading(false);
      });
  }

  return (
    <section>
      <div>
        <Toaster toastOptions={{ duration: 4000 }} />
        <div id="recaptcha-container"></div>
        {user ? (
          <h2>
            👍Login Success
          </h2>
        ) : (
          <div>
            <h1 className="title">
              Welcome to <br /> CODE A PROGRAM
            </h1>
            {showOTP ? (
              <>
                <div>
                  <BsFillShieldLockFill size={30} />
                </div>
                <label
                  htmlFor="otp" className="title title-verify"
                >
                  Enter your OTP
                </label>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  OTPLength={6}
                  otpType="number"
                  disabled={false}
                  autoFocus
                ></OtpInput>
                <button
                  onClick={onOTPVerify}
                  className="button-85"
                >
                  {/* {loading && (
                    <CgSpinner size={20} />
                  )} */}
                  <span >Verify OTP</span>
                </button>
              </>
            ) : (
              <>
                <div>
                  <BsTelephoneFill size={30} />
                </div>
                <label
                  htmlFor=""
                  className="title title-verify"
                >
                  Verify your phone number
                </label>
                <PhoneInput country={"vn"} value={phone} onChange={setPhone} />
                <button
                  onClick={onSignup}
                  className="button-85"
                >
                  {/* {loading && (
                    <CgSpinner size={20} />
                  )} */}
                  <span>Send code via SMS</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default App;