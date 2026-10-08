import "./NoteEditor.css";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  createImage,
  createNote,
  deleteImage,
  getNoteById,
  updateNote,
} from "../../api/auth.api";
import { useEffect, useState } from "react";

export default function NoteEditor() {
  const { id } = useParams();
  const isEditing = Boolean(id);

  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    if (!isEditing || !accessToken) {
      return;
    }

    const fetchNote = async () => {
      try {
        const result = await getNoteById(accessToken, id);

        const note = result.data.data.note;

        setFormData({
          title: note.title,
          content: note.content,
        });

        setImages(note.images || []);
      } catch (error) {
        console.error("Error fetching note:", error);
      }
    };

    fetchNote();
  }, [isEditing, accessToken, id]);

  const handleDeleteImage = async (fileId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this image?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteImage(accessToken, id, fileId);

      setImages((prevImages) =>
        prevImages.filter((image) => image.file_id !== fileId),
      );
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await updateNote(accessToken, id, {
          title: formData.title,
          content: formData.content,
        });

        if (image) {
          const result = await createImage(accessToken, id, image);

          setImages((prevImages) => [...prevImages, result.data.image]);
        }
      } else {
        const result = await createNote(accessToken, {
          title: formData.title,
          content: formData.content,
        });

        const noteId = result.data.note._id;

        if (image) {
          await createImage(accessToken, noteId, image);
        }
      }

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="note-editor">
      <div className="note-editor__header">
        <div>
          <h1>{isEditing ? "Edit Note" : "Create Note"}</h1>

          <p>
            {isEditing
              ? "Update your note."
              : "Write something you want to remember."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="note-editor__close"
        >
          ×
        </button>
      </div>

      <form className="note-editor__form" onSubmit={handleSubmit}>
        {/* Title */}

        <div className="note-editor__field">
          <label htmlFor="title">Title</label>

          <input
            id="title"
            type="text"
            placeholder="Enter note title"
            value={formData.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                title: e.target.value,
              })
            }
          />
        </div>

        {/* Content */}

        <div className="note-editor__field">
          <label htmlFor="content">Content</label>

          <textarea
            id="content"
            placeholder="Write your note here..."
            value={formData.content}
            onChange={(e) =>
              setFormData({
                ...formData,
                content: e.target.value,
              })
            }
          />
        </div>

        {/* Existing Images */}

        {isEditing && images.length > 0 && (
          <div className="note-editor__field">
            <label>Existing Images</label>

            <div className="note-editor__images">
              {images.map((img) => (
                <div key={img.file_id} className="note-editor__image-preview">
                  <img src={img.url} alt={formData.title || "Note image"} />

                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img.file_id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Image */}

        <div className="note-editor__field">
          <label>Images</label>

          <div className="note-editor__images">
            <input
              type="file"
              id="image"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />

            <label htmlFor="image" className="note-editor__image-placeholder">
              <span>+</span>

              <p>{image ? image.name : "Add image"}</p>
            </label>
          </div>
        </div>

        {/* Buttons */}

        <div className="note-editor__actions">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="button button--secondary"
          >
            Cancel
          </button>

          <button type="submit" className="button button--primary">
            {isEditing ? "Save Changes" : "Save Note"}
          </button>
        </div>
      </form>
    </div>
  );
}
