export default function Sidebar({ onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__logo">Nimbus</div>

      <nav className="sidebar__nav">
        <button className="sidebar__item sidebar__item--active">
          <span className="sidebar__icon"></span>
          <span>All Notes</span>
        </button>

        <button className="sidebar__item">
          <span className="sidebar__icon"></span>
          <span>Shared With Me</span>
        </button>

        <button className="sidebar__item">
          <span className="sidebar__icon"></span>
          <span>Profile</span>
        </button>
      </nav>

      <div className="sidebar__bottom">
        <button className="sidebar__logout" onClick={onLogout}>
          <span>↪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
