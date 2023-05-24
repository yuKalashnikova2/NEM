import express from 'express'

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(65534, (err) => {
    if(err) {
        console.log('Server err')
    }
    console.log('Server ok')
})
