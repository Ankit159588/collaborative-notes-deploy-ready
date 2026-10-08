import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import "../styles/forms.css";
import { useState } from "react";
import { verifyResetOtp } from "../api/auth.api";

export default function VerifyResetOtp() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await verifyResetOtp(email, otp);

      console.log("SUCCESS:", result);

      navigate("/reset-password");
    } catch (error) {
      console.log(error, "Error");
    }
  };

  return (
    <AuthLayout
      eyebrow="Password reset"
      title="Verify OTP"
      subtitle={`Enter the OTP sent to ${email}`}
    >
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="field__label" htmlFor="otp">
            OTP
          </label>

          <input
            id="otp"
            className="field__input"
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn--primary">
          Verify OTP
        </button>
      </form>
    </AuthLayout>
  );
}
