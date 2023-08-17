require('dotenv').config()

const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())

const bodyParser = require('body-parser')
app.use(bodyParser.json())

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const PORT = process.env.PORT || 5555

app.post('/', async (req, res) => {
    const referrer = req.get('referer')
    const host = req.get('host')

    console.log('referrer', referrer)
    console.log('host', host)

    if (
        !(
            host === 'localhost:5555' ||
            host === 'mailer.lan'
        ) &&
        (
            !referrer ||
            !(
                referrer.startsWith('https://glencoden.github.io/looney-website') ||
                referrer.startsWith('https://liverockkaraoke.de') ||
                referrer.startsWith('https://glencoden.github.io/hainarbeit') ||
                referrer.startsWith('https://hainarbeit.de/')
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
        case 'hainarbeit':
            to = 'hainarbeit@gmail.com'
            break
        case 'looneys':
            to = 'nikolaipetersen@gmail.com'
            break
    }

    try {
        await sgMail.send({
            to,
            from: 'simon.der.meyer@gmail.com',
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