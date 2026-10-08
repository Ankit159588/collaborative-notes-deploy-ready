import NoteCard from "./NoteCard";

export default function NoteGrid({ notes }) {
  return (
    <div className="notes-grid">
      {notes.map((note) => (
        <NoteCard key={note._id} note={note} />
      ))}
    </div>
  );
}
