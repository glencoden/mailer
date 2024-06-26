require('dotenv').config()

const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())

const bodyParser = require('body-parser')
app.use(bodyParser.json())

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

console.log('process.env.MAILGUN_API_KEY', process.env.MAILGUN_API_KEY)

const PORT = process.env.PORT || 5555

app.post('/', async (req, res) => {
    const referrer = req.get('referer')
    const host = req.get('host')

    console.log('referrer', referrer)
    console.log('host', host)
    console.log('req.body', req.body)

    if (
        req.body.admin_password !== process.env.ADMIN_PASSWORD &&
        !(
            host === 'localhost:5555' ||
            host === 'mailer.lan'
        ) &&
        (
            !referrer ||
            !(
                referrer.startsWith('https://glencoden.github.io') ||
                referrer.startsWith('https://liverockkaraoke.de')
            )
        )
    ) {
        res.json({
            success: false,
            error: {
                message: 'Invalid referrer',
            },
        })
        return
    }

    let to = 'simon.der.meyer@gmail.com'

    switch (req.body.page) {
        case 'looneys':
            to = 'nikolaipetersen@gmail.com'
            break
    }

    try {
        await sgMail.send({
            to,
            from: 'contact@liverockkaraoke.de',
            subject: `Anfrage von ${req.body.name}`,
            text: req.body.content,
            html: `
                <a href="mailto:${req.body.email}">
                    <button style="cursor: pointer; margin: 42px 0; color: deeppink;">
                        <strong>Antwort an ${req.body.name}</strong>
                    </button>
                </a>
                <br/>
                <p>${req.body.content}</p>
            `,
        })

        res.json({
            success: true,
            error: null,
        })
    } catch (error) {
        res.json({
            success: false,
            error,
        })
    }
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))