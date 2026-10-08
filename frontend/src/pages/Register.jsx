import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import "../styles/forms.css";
import { useState, useEffect } from "react";
import { registerUser } from "../api/auth.api.js";

export default function Register() {
  const [resendLoading, setResendLogin] = useState(false);
  const [resendCoolDown, setResetCoolDown] = useState(0);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (resendLoading || resendCoolDown > 0) return;

    try {
      setResendLogin(true);

      const result = await registerUser(formData);

      console.log("SUCCESS:", result);

      setResetCoolDown(60);

      navigate("/verify-email", {
        state: {
          email: formData.email,
        },
      });
    } catch (error) {
      console.log(error, "Error");
    } finally {
      setResendLogin(false);
    }
  };

  useEffect(() => {
    if (resendCoolDown === 0) return;

    const timer = setInterval(() => {
      setResetCoolDown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCoolDown]);

  return (
    <AuthLayout
      eyebrow="Step 1 of 2"
      title="Create your account"
      subtitle="Join Nimbus in a couple of minutes — no credit card required."
    >
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="field__label" htmlFor="username">
            Username
          </label>

          <input
            value={formData.username}
            onChange={(e) =>
              setFormData({
                ...formData,
                username: e.target.value,
              })
            }
            name="username"
            id="username"
            className="field__input"
            type="text"
            placeholder="jane_doe"
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="email">
            Email address
          </label>

          <input
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
            name="email"
            id="email"
            className="field__input"
            type="email"
            placeholder="jane@example.com"
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="password">
            Password
          </label>

          <input
            value={formData.password}
            onChange={(e) =>
              setFormData({
                ...formData,
                password: e.target.value,
              })
            }
            name="password"
            id="password"
            className="field__input"
            type="password"
            placeholder="Create a password"
          />

          <span className="field__hint">
            Use at least 8 characters, with a number and a symbol.
          </span>
        </div>

        <label className="checkbox" style={{ marginBottom: "var(--space-5)" }}>
          <input type="checkbox" />I agree to the Terms of Service and Privacy
          Policy
        </label>

        <button
          disabled={resendLoading || resendCoolDown > 0}
          type="submit"
          className="btn btn--primary"
        >
          {resendLoading
            ? "Creating Account..."
            : resendCoolDown > 0
              ? `Please wait ${resendCoolDown}s`
              : "Create Account"}
        </button>
      </form>

      <p className="form-footer">
        Already have an account?{" "}
        <Link className="link" to="/login">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
