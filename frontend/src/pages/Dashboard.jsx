import { useNavigate } from "react-router-dom";
import { logOut, getNotes } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import NoteGrid from "../components/notes/NoteGrid";

import "./Dashboard.css";

export default function Dashboard() {
  const { user, accessToken, setAccessToken } = useAuth();

  const [notes, setNotes] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const result = await getNotes(accessToken);

        console.log("NOTES:", result);

        setNotes(result.data.notes);
      } catch (error) {
        console.log(error, "Error");
      }
    };

    if (accessToken) {
      fetchNotes();
    }
  }, [accessToken]);

  const handleLogOut = async () => {
    try {
      await logOut();

      setAccessToken(null);
      navigate("/login");
    } catch (error) {
      console.log(error, "Error");
    }
  };

  return (
    <div className="dashboard">
      <Sidebar onLogout={handleLogOut} />

      <div className="dashboard__content">
        <Topbar user={user} />

        <main className="notes-page">
          <div className="notes-page__header">
            <div>
              <h1>My Notes</h1>

              <p>Create, edit and share your notes.</p>
            </div>

            <button
              className="new-note-button"
              onClick={() => navigate("/notes/new")}
            >
              <span>+</span>
              New Note
            </button>
          </div>

          <NoteGrid notes={notes} />
        </main>
      </div>
    </div>
  );
}
