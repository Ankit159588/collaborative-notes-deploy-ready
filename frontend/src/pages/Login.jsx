import { Link, useNavigate } from "react-router-dom";
import { loginUser, getMe } from "../api/auth.api";
import AuthLayout from "../components/AuthLayout";
import { useState } from "react";
import "../styles/forms.css";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await loginUser(formData);

      setAccessToken(result.data.accessToken);

      const meResult = await getMe(result.data.accessToken);

      setUser(meResult.data.user);

      navigate("/dashboard");
    } catch (error) {
      console.log(error, "Error");
    }
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to Nimbus"
      subtitle="Enter your details to access your workspace."
    >
      <form onSubmit={handleSubmit}>
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
            id="password"
            className="field__input"
            type="password"
            placeholder="Enter your password"
          />
        </div>

        <div className="field__row">
          <label className="checkbox">
            <input type="checkbox" />
            Remember me
          </label>

          <Link className="link" to="/forgot-password">
            Forgot password?
          </Link>
        </div>

        <button type="submit" className="btn btn--primary">
          Sign in
        </button>
      </form>

      <p className="form-footer">
        New to Nimbus?{" "}
        <Link className="link" to="/register">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
