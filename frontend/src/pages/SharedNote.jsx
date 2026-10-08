import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSharedNote } from "../api/share";
import { useAuth } from "../context/AuthContext";
import "../pages/ShareNote.css";

export default function SharedNote() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const [note, setNote] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchSharedNote() {
      // User is not logged in
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const result = await getSharedNote(token);

        console.log("Shared note:", result.data);

        setNote(result.data.data.note);
        setRole(result.data.data.role);
      } catch (error) {
        console.error("Failed to fetch shared note:", error);

        if (error.response?.status === 401) {
          navigate("/login");
          return;
        }

        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    fetchSharedNote();
  }, [token, accessToken, navigate]);

  if (loading) {
    return <div className="shared-note__loading">Loading shared note...</div>;
  }

  // Not logged in
  if (!accessToken) {
    return (
      <div className="shared-note__not-found">
        <h2>Login required</h2>

        <p>You need to login to view this shared note.</p>

        <button
          className="shared-note__login-button"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </button>
      </div>
    );
  }

  // Note doesn't exist / invalid share link
  if (notFound || !note) {
    return (
      <div className="shared-note__not-found">
        <h2>Note not found</h2>

        <p>This share link may be invalid or expired.</p>

        <button
          className="shared-note__login-button"
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="shared-note">
      <div className="shared-note__header">
        <div>
          <span className="shared-note__badge">Shared Note</span>

          <p className="shared-note__role">
            Permission: <strong>{role}</strong>
          </p>
        </div>
      </div>

      <article className="shared-note__card">
        <div className="shared-note__title-section">
          <h1>{note.title || "Untitled Note"}</h1>

          {note.updatedAt && (
            <p>
              Updated{" "}
              {new Date(note.updatedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}
        </div>

        <div className="shared-note__content">
          {note.content || "No content"}
        </div>

        {note.images?.length > 0 && (
          <div className="shared-note__images">
            {note.images.map((image) => (
              <img
                key={image.file_id}
                src={image.url}
                alt={note.title || "Note image"}
              />
            ))}
          </div>
        )}
      </article>
    </div>
  );
}
