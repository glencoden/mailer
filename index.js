require('dotenv').config();

const express = require('express')
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.json())

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const PORT = process.env.PORT || 5555

app.post('/', async (req, res) => {
    console.log(req.body.name, req.body.email, req.body.content, req.body.page)

    let to = "simon.der.meyer@gmail.com"

    switch (req.body.page) {
        case 'hainarbeit':
            to = 'hainarbeit@gmail.com'
            break
        case 'looneys':
            to = 'nikolaipetersen@gmail.com'
            break
    }

    const msg = {
        to,
        from: 'simon.der.meyer@gmail.com',
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }

    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })

    res.send('done')
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))