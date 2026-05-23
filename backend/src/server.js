const express = require('express')
const cors = require('cors')
const nodemailer = require('nodemailer')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
const port = Number(process.env.PORT) || 5000

const logPrefix = '[love-journey-backend]'

function mask(value) {
  if (!value) return '(not set)'
  if (value.length <= 4) return '****'
  return `${value.slice(0, 2)}***${value.slice(-2)}`
}

function normalizeOrigin(origin) {
  if (!origin || origin === '*') return origin
  return origin.replace(/\/+$/, '')
}

const frontendOrigin = normalizeOrigin(process.env.FRONTEND_ORIGIN) || '*'
const emailSendTimeoutMs = Number(process.env.EMAIL_SEND_TIMEOUT_MS || 25000)

function corsOrigin(origin, callback) {
  if (!origin || frontendOrigin === '*') {
    callback(null, true)
    return
  }
  if (normalizeOrigin(origin) === frontendOrigin) {
    callback(null, true)
    return
  }
  console.warn(`${logPrefix} blocked CORS origin`, { origin, allowed: frontendOrigin })
  callback(new Error(`Origin ${origin} not allowed`))
}

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    }),
  ])
}

function getResendApiKey() {
  const candidates = [
    process.env.RESEND_API_KEY,
    process.env.SMTP_PASS,
    process.env.EMAIL_PASS,
  ]
  return candidates.find((key) => key && String(key).startsWith('re_'))
}

function shouldUseResendApi(smtpHost) {
  if (getResendApiKey()) return true
  return Boolean(smtpHost && smtpHost.includes('resend.com'))
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatEmailContent({ answers, proposalAccepted, fallbackText }) {
  const normalizedAnswers = Array.isArray(answers)
    ? answers
        .map((entry, index) => ({
          question: entry?.question || `Question ${index + 1}`,
          answer: entry?.answer || entry?.label || '(no answer)',
        }))
        .filter((entry) => entry.question || entry.answer)
    : []

  const textLines = [
    'Khushi completed the love journey!',
    '',
    ...(proposalAccepted ? ['Final answer: YES! 💍', ''] : []),
    '--- Her answers ---',
    '',
  ]

  if (normalizedAnswers.length > 0) {
    normalizedAnswers.forEach((entry, index) => {
      textLines.push(`${index + 1}. ${entry.question}`)
      textLines.push(`   Answer: ${entry.answer}`)
      textLines.push('')
    })
  } else {
    textLines.push(fallbackText || '(No journey answers recorded)')
  }

  const answerListHtml = normalizedAnswers.length > 0
    ? `<ol>${normalizedAnswers
        .map(
          (entry) =>
            `<li style="margin-bottom:16px;"><strong>${escapeHtml(entry.question)}</strong><br/>Answer: ${escapeHtml(entry.answer)}</li>`,
        )
        .join('')}</ol>`
    : `<p>${escapeHtml(fallbackText || 'No journey answers recorded.')}</p>`

  const html = `
    <div style="font-family:Georgia,serif;color:#334155;max-width:600px;">
      <h2 style="color:#be185d;">Khushi completed the love journey! 💕</h2>
      ${proposalAccepted ? '<p style="font-size:18px;"><strong>Final answer: YES! 💍</strong></p>' : ''}
      <h3>Her answers</h3>
      ${answerListHtml}
    </div>
  `.trim()

  return {
    text: textLines.join('\n').trim(),
    html,
    answerCount: normalizedAnswers.length,
  }
}

async function sendViaResendApi({ apiKey, from, to, subject, text, html }) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': 'khushi-love-journey-backend/1.0',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
      html,
    }),
  })

  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    const detail = body?.message || body?.error?.message || JSON.stringify(body)
    throw new Error(`Resend API error (${response.status}): ${detail}`)
  }

  return body
}

function createMailTransporter({ emailUser, emailPass, smtpHost, smtpPort, smtpSecure }) {
  const transportOptions = {
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    auth: {
      user: process.env.SMTP_USER || emailUser,
      pass: process.env.SMTP_PASS || emailPass,
    },
  }

  if (smtpHost) {
    const isResend = smtpHost.includes('resend.com')
    const port = smtpPort || (isResend ? 587 : 587)
    const secure = isResend ? false : smtpSecure
    return nodemailer.createTransport({
      ...transportOptions,
      host: smtpHost,
      port,
      secure,
      requireTLS: isResend && !secure,
    })
  }

  const emailService = (process.env.EMAIL_SERVICE || 'gmail').toLowerCase()
  if (emailService === 'gmail') {
    return nodemailer.createTransport({
      ...transportOptions,
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
    })
  }

  return nodemailer.createTransport({
    service: emailService,
    ...transportOptions,
  })
}

function logEmailConfig(context) {
  console.log(`${logPrefix} ${context} email config:`, {
    NODE_ENV: process.env.NODE_ENV || '(not set)',
    FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || '(not set)',
    FRONTEND_ORIGIN_CORS: frontendOrigin,
    EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'gmail (default)',
    EMAIL_USER: mask(process.env.EMAIL_USER),
    EMAIL_PASS: process.env.EMAIL_PASS ? '(set)' : '(not set)',
    RECEIVER_EMAIL: mask(process.env.RECEIVER_EMAIL),
    SMTP_HOST: process.env.SMTP_HOST || '(not set)',
    SMTP_PORT: process.env.SMTP_PORT || '(not set)',
    SMTP_SECURE: process.env.SMTP_SECURE || '(not set)',
    SMTP_USER: mask(process.env.SMTP_USER),
    SMTP_PASS: process.env.SMTP_PASS ? '(set)' : '(not set)',
    RESEND_API_KEY: process.env.RESEND_API_KEY ? '(set)' : '(not set)',
    useResendApi: shouldUseResendApi(process.env.SMTP_HOST),
  })
}

app.use(cors({ origin: corsOrigin }))
app.use(express.json())

app.use((req, _res, next) => {
  console.log(`${logPrefix} ${req.method} ${req.path}`)
  next()
})

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.post('/send-email', async (req, res) => {
  console.log(`${logPrefix} /send-email called`)
  logEmailConfig('on request')

  const emailUser = process.env.EMAIL_USER
  const emailPass = process.env.EMAIL_PASS
  const receiverEmail = process.env.RECEIVER_EMAIL
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = Number(process.env.SMTP_PORT || 587)
  const smtpSecure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true'
  const resendApiKey = getResendApiKey()
  const useResendApi = shouldUseResendApi(smtpHost)

  if (useResendApi) {
    if (!resendApiKey || !emailUser || !receiverEmail) {
      console.error(`${logPrefix} missing Resend API config`, {
        RESEND_API_KEY: Boolean(resendApiKey),
        EMAIL_USER: Boolean(emailUser),
        RECEIVER_EMAIL: Boolean(receiverEmail),
      })
      return res.status(500).json({
        error: 'Resend configuration missing. Set RESEND_API_KEY (or SMTP_PASS with re_ key), EMAIL_USER (from address), and RECEIVER_EMAIL.',
      })
    }
  } else if (!emailUser || !emailPass || !receiverEmail) {
    console.error(`${logPrefix} missing required env vars`, {
      EMAIL_USER: Boolean(emailUser),
      EMAIL_PASS: Boolean(emailPass),
      RECEIVER_EMAIL: Boolean(receiverEmail),
    })
    return res.status(500).json({
      error: 'Email configuration missing. Set EMAIL_USER, EMAIL_PASS and RECEIVER_EMAIL.',
    })
  }

  const subject = req.body?.subject || 'She said YES! 💍'
  const { text, html, answerCount } = formatEmailContent({
    answers: req.body?.answers,
    proposalAccepted: req.body?.proposalAccepted,
    fallbackText: req.body?.text,
  })
  console.log(`${logPrefix} sending email`, {
    subject,
    textLength: text.length,
    answerCount,
    to: mask(receiverEmail),
  })

  try {
    let info

    if (useResendApi) {
      console.log(`${logPrefix} sending via Resend HTTP API`, { emailSendTimeoutMs })
      info = await withTimeout(
        sendViaResendApi({
          apiKey: resendApiKey,
          from: emailUser,
          to: receiverEmail,
          subject,
          text,
          html,
        }),
        emailSendTimeoutMs,
        'Resend API send',
      )
      console.log(`${logPrefix} email sent successfully via Resend API`, { id: info?.id })
    } else {
      const transporterMode = smtpHost
        ? 'smtp-host'
        : (process.env.EMAIL_SERVICE || 'gmail').toLowerCase() === 'gmail'
          ? 'gmail-smtp'
          : `service:${process.env.EMAIL_SERVICE || 'gmail'}`
      console.log(`${logPrefix} creating transporter`, {
        mode: transporterMode,
        smtpPort,
        smtpSecure,
        emailSendTimeoutMs,
      })

      const transporter = createMailTransporter({
        emailUser,
        emailPass,
        smtpHost,
        smtpPort,
        smtpSecure,
      })

      info = await withTimeout(
        transporter.sendMail({
          from: emailUser,
          to: receiverEmail,
          subject,
          text,
          html,
        }),
        emailSendTimeoutMs,
        'Email send',
      )

      console.log(`${logPrefix} email sent successfully`, {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
      })
    }

    return res.status(200).json({ message: 'Email notification sent.' })
  } catch (error) {
    console.error(`${logPrefix} email send failed`, {
      name: error.name,
      message: error.message,
      code: error.code,
      response: error.response,
    })
    return res.status(500).json({
      error: 'Unable to send email notification.',
      details: error.message,
    })
  }
})

app.listen(port, '0.0.0.0', () => {
  console.log(`${logPrefix} listening on port ${port}`)
  logEmailConfig('on startup')
})
