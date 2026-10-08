import { useState } from "react";
import { createShare } from "../../api/share";
import "../notes/SharePanel.css";

export default function SharePanel({ noteId, onClose }) {
  const [shareRole, setShareRole] = useState("viewer");
  const [shareUrl, setShareUrl] = useState("");
  const [shareLoading, setShareLoading] = useState(false);

  async function handleCreateShare() {
    try {
      setShareLoading(true);

      const result = await createShare(noteId, shareRole);

      const url = result.data.data.share_url;

      setShareUrl(url);
    } catch (error) {
      console.error("Failed to create share:", error);
    } finally {
      setShareLoading(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied!");
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  }

  return (
    <div className="share-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(event) => event.stopPropagation()}>
        <div className="share-modal__header">
          <h2>Share Note</h2>

          <button className="share-modal__close" onClick={onClose}>
            ×
          </button>
        </div>

        <p className="share-modal__description">
          Choose what people can do with this note.
        </p>

        <label className="share-modal__label">Permission</label>

        <select
          className="share-modal__select"
          value={shareRole}
          onChange={(event) => {
            setShareRole(event.target.value);
            setShareUrl("");
          }}
        >
          <option value="viewer">Viewer — Can view</option>
          <option value="editor">Editor — Can edit</option>
        </select>

        <button
          className="share-modal__create"
          onClick={handleCreateShare}
          disabled={shareLoading}
        >
          {shareLoading ? "Creating..." : "Create Share Link"}
        </button>

        {shareUrl && (
          <div className="share-modal__link-section">
            <label className="share-modal__label">Share link</label>

            <div className="share-modal__link-row">
              <input type="text" value={shareUrl} readOnly />

              <button onClick={handleCopy}>Copy</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
