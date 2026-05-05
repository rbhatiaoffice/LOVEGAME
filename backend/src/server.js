const express = require('express')
const cors = require('cors')
const nodemailer = require('nodemailer')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
const port = Number(process.env.PORT) || 5000

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || '*' }))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.post('/send-email', async (req, res) => {
  const emailUser = process.env.EMAIL_USER
  const emailPass = process.env.EMAIL_PASS
  const receiverEmail = process.env.RECEIVER_EMAIL
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = Number(process.env.SMTP_PORT || 587)
  const smtpSecure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true'

  if (!emailUser || !emailPass || !receiverEmail) {
    return res.status(500).json({
      error: 'Email configuration missing. Set EMAIL_USER, EMAIL_PASS and RECEIVER_EMAIL.',
    })
  }

  const subject = req.body?.subject || 'She said YES! 💍'
  const text = req.body?.text || 'Khushi accepted your proposal!'

  try {
    const transporter = smtpHost
      ? nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpSecure,
          auth: {
            user: process.env.SMTP_USER || emailUser,
            pass: process.env.SMTP_PASS || emailPass,
          },
        })
      : nodemailer.createTransport({
          service: process.env.EMAIL_SERVICE || 'gmail',
          auth: {
            user: emailUser,
            pass: emailPass,
          },
        })

    await transporter.sendMail({
      from: emailUser,
      to: receiverEmail,
      subject,
      text,
    })

    return res.status(200).json({ message: 'Email notification sent.' })
  } catch (error) {
    return res.status(500).json({
      error: 'Unable to send email notification.',
      details: error.message,
    })
  }
})

app.listen(port, () => {
  console.log(`Love-story backend listening on port ${port}`)
})
