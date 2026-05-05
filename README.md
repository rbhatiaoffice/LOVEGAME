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
