# Auth UI — Frontend (React + plain CSS)

UI-only screens for a typical auth flow. No state, no validation, no API
calls — every form is static markup so you can wire up your own logic.

## Structure

```
frontend/
├── public/
│   └── index.html
└── src/
    ├── components/
    │   ├── AuthLayout.jsx      # shared split-screen shell (brand + form)
    │   └── AuthLayout.css
    ├── pages/
    │   ├── Register.jsx        # username, email, password
    │   ├── Login.jsx           # email, password, forgot-password link
    │   ├── VerifyEmail.jsx     # OTP boxes + Resend OTP button
    │   ├── ResetPassword.jsx   # new password, confirm password
    │   ├── Dashboard.jsx       # simple post-login screen
    │   └── *.css
    ├── styles/
    │   ├── variables.css       # design tokens (colors, type, spacing)
    │   ├── global.css          # reset + base styles
    │   └── forms.css           # shared input/button styles
    ├── App.js                  # routes only, no logic
    └── index.js
```

## Routes

| Path              | Screen         |
|--------------------|----------------|
| `/login`           | Login          |
| `/register`        | Register       |
| `/verify-email`    | Verify Email   |
| `/reset-password`  | Reset Password |
| `/dashboard`        | Logged-in home |

## Run it

```bash
npm install
npm start
```

Opens at http://localhost:3000 (redirects to `/login`).

## Notes

- Plain CSS only, no Tailwind/UI kit — everything lives in `styles/` and
  per-page `.css` files.
- Buttons are `type="button"` (not `submit`) since there's no submit
  handler yet — swap back once you add real logic.
- Fonts: Fraunces (display/headings) + Manrope (body), loaded from Google
  Fonts in `public/index.html`.
