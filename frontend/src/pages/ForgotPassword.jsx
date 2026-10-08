import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import "../styles/forms.css";
import { useState } from "react";
import { forgotPassword } from "../api/auth.api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await forgotPassword(email);

      console.log("SUCCESS:", result);

      navigate("/verify-reset-otp", {
        state: {
          email,
        },
      });
    } catch (error) {
      console.log(error, "Error");
    }
  };

  return (
    <AuthLayout
      eyebrow="Password reset"
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you an OTP."
    >
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="field__label" htmlFor="email">
            Email address
          </label>

          <input
            id="email"
            className="field__input"
            type="email"
            placeholder="jane@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn--primary">
          Send OTP
        </button>
      </form>

      <p className="form-footer">
        Remembered your password?{" "}
        <Link className="link" to="/login">
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
