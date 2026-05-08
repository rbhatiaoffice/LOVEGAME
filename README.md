# Khushi Love Journey

A playful, romantic React + Tailwind web app made by Rishi for Khushi, with an Express backend that sends an email when she clicks **"Yes ❤️"**.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Framer Motion, canvas-confetti
- **Backend:** Node.js, Express, Nodemailer, dotenv

## Project Structure

```text
khushi-love-journey/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FinalProposal.jsx
│   │   │   ├── FloatingHearts.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── MusicToggle.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   └── TypewriterText.jsx
│   │   ├── data/
│   │   │   └── storySteps.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── .env.example
├── backend/
│   ├── src/
│   │   └── server.js
│   └── .env.example
└── README.md
```

## Setup Instructions

### 1) Install Dependencies

```bash
cd khushi-love-journey/frontend
npm install

cd ../backend
npm install
```

### 2) Configure Environment Variables

Create `.env` in `backend/` from `backend/.env.example`:

```env
PORT=5000
FRONTEND_ORIGIN=http://localhost:5173
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
RECEIVER_EMAIL=receiver@example.com
```

Create `.env` in `frontend/` from `frontend/.env.example`:

```env
VITE_API_URL=http://localhost:5000
```

### 3) Run Backend

```bash
cd backend
npm start
```

### 4) Run Frontend

```bash
cd frontend
npm run dev
```

## Email Behavior

- When **Yes ❤️** is clicked, frontend calls `POST /send-email`.
- Default payload:
  - Subject: `She said YES! 💍`
  - Body: `Khushi accepted your proposal!`

## Production Notes

- Restrict `FRONTEND_ORIGIN` to your deployed frontend URL.
- Use provider app password or transactional email credentials.
- For production email delivery, SendGrid/Postmark/SES is recommended over personal SMTP.

## Deploy Frontend on Netlify

This repo includes `netlify.toml`, so Netlify can auto-detect build settings.

1. Import this GitHub repo into Netlify.
2. Netlify reads:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`
3. In Netlify **Site configuration -> Environment variables**, add:
   - `VITE_API_URL=https://<your-render-backend>.onrender.com`
4. Trigger a redeploy.

### Netlify SPA routing

The included redirect rule sends all routes to `index.html`, so client-side routing works.

## Deploy Backend on Render

This repo includes `render.yaml` for backend deployment from `backend/`.

1. In Render, create a new Blueprint/Web Service from this repo.
2. Confirm service settings:
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
   - Health check: `/health`
3. Add required environment variables in Render:
   - `FRONTEND_ORIGIN=https://<your-netlify-site>.netlify.app`
   - `EMAIL_USER=<sender email>`
   - `EMAIL_PASS=<sender password or API key>`
   - `RECEIVER_EMAIL=<where proposal email is received>`
4. If using SMTP relay providers (recommended), also set:
   - `SMTP_HOST`
   - `SMTP_PORT` (for example `465`)
   - `SMTP_SECURE` (`true` or `false`)
   - `SMTP_USER`
   - `SMTP_PASS`
5. Deploy and verify:
   - `GET https://<your-render-backend>.onrender.com/health` returns `{ "status": "ok" }`

## Final Wiring Checklist

- Netlify `VITE_API_URL` points to Render backend URL.
- Render `FRONTEND_ORIGIN` points to Netlify frontend URL.
- Email credentials are valid for selected SMTP mode.
- Test **Yes ❤️** button after both deployments are live.
