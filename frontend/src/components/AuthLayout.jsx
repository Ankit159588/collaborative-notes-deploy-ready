import "./AuthLayout.css";

/**
 * Pure UI shell shared by every auth screen.
 * Left: brand panel. Right: the page's own form content (children).
 * No logic — layout only.
 */

export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  return (
    <div className="auth-shell">
      <aside className="auth-brand">
        <div className="auth-brand__mark">Nimbus</div>

        <div className="auth-brand__quote">
          <p className="auth-brand__quote-text">
            “Good mornings start with one less password to remember.”
          </p>
          <span className="auth-brand__quote-by">— Team Nimbus</span>
        </div>

        <div className="auth-brand__shapes" aria-hidden="true">
          <span className="shape shape--ring" />
          <span className="shape shape--dot" />
          <span className="shape shape--line" />
        </div>
      </aside>

      <main className="auth-form-panel">
        <div className="auth-form-card">
          {eyebrow && (
            <span className="auth-form-card__eyebrow">{eyebrow}</span>
          )}
          <h1 className="auth-form-card__title">{title}</h1>
          {subtitle && <p className="auth-form-card__subtitle">{subtitle}</p>}

          <div className="auth-form-card__body">{children}</div>
        </div>
      </main>
    </div>
  );
}
