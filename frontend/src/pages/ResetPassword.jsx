import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { resetPassword } from "../api/auth.api";
import "../styles/forms.css";
import { useState } from "react";

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await resetPassword(
        formData.newPassword,
        formData.confirmPassword,
      );

      console.log("SUCCESS:", result);

      navigate("/login");
    } catch (error) {
      console.log(error, "Error");
    }
  };

  return (
    <AuthLayout
      eyebrow="Reset password"
      title="Choose a new password"
      subtitle="Make it something you'll remember, but that others can't guess."
    >
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="field__label" htmlFor="new-password">
            New password
          </label>
          <input
            id="new-password"
            className="field__input"
            type="password"
            placeholder="Enter new password"
            value={formData.newPassword}
            onChange={(e) =>
              setFormData({
                ...formData,
                newPassword: e.target.value,
              })
            }
          />
          <span className="field__hint">
            Use at least 8 characters, with a number and a symbol.
          </span>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="confirm-password">
            Confirm password
          </label>
          <input
            id="confirm-password"
            className="field__input"
            type="password"
            placeholder="Re-enter new password"

            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({
                ...formData,
                confirmPassword: e.target.value,
              })
            }
          />
        </div>

        <button type="submit" className="btn btn--primary">
          Reset password
        </button>
      </form>

      <p className="form-footer">
        Remembered it after all?{" "}
        <Link className="link" to="/login">
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
