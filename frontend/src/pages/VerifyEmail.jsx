import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import "../styles/forms.css";
import "./VerifyEmail.css";
import { verifyEmail, resendOtp } from "../api/auth.api.js";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState("");
  const [resendLoading, setResendLogin] = useState(false);
  const [resendCoolDown, setResetCoolDown] = useState(0);

  const email = location.state?.email;

  const handleOtpChange = async (index, value) => {
    if (value !== "" && isNaN(value)) return;

    const otpArray = otp.split("");
    otpArray[index] = value;

    setOtp(otpArray.join(""));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await verifyEmail(email, otp);
      console.log("SUCCESS:", result);
      navigate("/login");
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const handleResendOtp = async (email) => {
    try {
      if (resendLoading || resendCoolDown > 0) return;

      setResendLogin(true);
      const result = await resendOtp(email);
      console.log("SUCCESS:", result);

      setResetCoolDown(40);
    } catch (error) {
      console.log(error.response?.data);
    } finally {
      setResetCoolDown(false);
    }
  };

  useEffect(() => {
    if (resendCoolDown === 0) return;

    const timer = setInterval(() => {
      setResetCoolDown((prev) => prev - 1);
    });

    return () => clearInterval(timer);
  }, [resendCoolDown]);

  return (
    <AuthLayout
      eyebrow="Step 2 of 2"
      title="Verify your email"
      subtitle="We sent a 6-digit code to jane@example.com. Enter it below to confirm it's you."
    >
      <form onSubmit={handleSubmit}>
        <div
          className="otp-row"
          role="group"
          aria-label="Enter verification code"
        >
          <input
            className="otp-box"
            type="text"
            maxLength={1}
            inputMode="numeric"
            value={otp[0] || ""}
            onChange={(e) => handleOtpChange(0, e.target.value)}
          />

          <input
            className="otp-box"
            type="text"
            maxLength={1}
            inputMode="numeric"
            value={otp[1] || ""}
            onChange={(e) => handleOtpChange(1, e.target.value)}
          />

          <input
            className="otp-box"
            type="text"
            maxLength={1}
            inputMode="numeric"
            value={otp[2] || ""}
            onChange={(e) => handleOtpChange(2, e.target.value)}
          />

          <input
            className="otp-box"
            type="text"
            maxLength={1}
            inputMode="numeric"
            value={otp[3] || ""}
            onChange={(e) => handleOtpChange(3, e.target.value)}
          />

          <input
            className="otp-box"
            type="text"
            maxLength={1}
            inputMode="numeric"
            value={otp[4] || ""}
            onChange={(e) => handleOtpChange(4, e.target.value)}
          />

          <input
            className="otp-box"
            type="text"
            maxLength={1}
            inputMode="numeric"
            value={otp[5] || ""}
            onChange={(e) => handleOtpChange(5, e.target.value)}
          />
        </div>
        <p className="otp-timer">Code expires in 04:59</p>
        <button
          type="submit"
          className="btn btn--primary"
          style={{ marginTop: "var(--space-5)" }}
        >
          Verify email
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          style={{ marginTop: "var(--space-3)" }}
          disabled={resendLoading || resendCoolDown > 0}
          onClick={() => handleResendOtp(email)}
        >
          {resendLoading
            ? "Sending..."
            : resendCoolDown > 0
              ? `Resend OTP in ${resendCoolDown}s`
              : "Resend OTP"}
        </button>{" "}
      </form>

      <p className="form-footer">
        Wrong email?{" "}
        <Link className="link" to="/register">
          Go back
        </Link>
      </p>
    </AuthLayout>
  );
}
