import express from 'express';

const app = express()

app.get('/', (req,res) => {
    res.send('Ta funfando!!')
})
app.get('/health', (req,res) => {
    res.json({ status: 'ok', service: 'lista-01'})
})

export default app;