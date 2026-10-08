import "../notes/NoteCard.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteNote } from "../../api/auth.api";
import { useAuth } from "../../context/AuthContext";
import SharePanel from "./SharePanel";

export default function NoteCard({ note }) {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <div className="note-card" onClick={() => navigate(`/notes/${note._id}`)}>
      <div className="note-card__header">
        <h2>{note.title || "Untitled Note"}</h2>

        <div className="note-card__menu-wrapper">
          <button
            className="note-card__menu"
            onClick={(event) => {
              event.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
          >
            ⋮
          </button>

          {menuOpen && (
            <div className="note-card__dropdown">
              {/* EDIT */}
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  navigate(`/notes/${note._id}/edit`);
                }}
              >
                Edit
              </button>

              {/* SHARE */}
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  setShareOpen(true);
                  setMenuOpen(false);
                }}
              >
                Share
              </button>

              {/* DELETE */}
              <button
                onClick={async (event) => {
                  event.stopPropagation();

                  const confirmed = window.confirm(
                    "Are you sure you want to delete this note?",
                  );

                  if (!confirmed) {
                    return;
                  }

                  try {
                    await deleteNote(accessToken, note._id);

                    window.location.reload();
                  } catch (error) {
                    console.error("Error deleting note:", error);
                  }
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="note-card__content">{note.content || "No content"}</p>

      <div className="note-card__footer">
        <span>Updated {new Date(note.updatedAt).toLocaleDateString()}</span>

        <span className="note-card__arrow">→</span>
      </div>

      {/* SHARE PANEL */}
      {shareOpen && (
        <SharePanel noteId={note._id} onClose={() => setShareOpen(false)} />
      )}
    </div>
  );
}
