export default function Topbar({ user }) {
  return (
    <header className="topbar">
      <div className="topbar__search">
        <span>⌕</span>

        <input type="text" placeholder="Search notes..." />
      </div>

      <div className="topbar__user">
        <div className="topbar__avatar">
          {user?.username?.charAt(0).toUpperCase()}
        </div>

        <span className="topbar__username">{user?.username}</span>
      </div>
    </header>
  );
}
