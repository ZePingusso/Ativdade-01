import express from 'express'
import productsRoutes from './routes/productRoutes.js'

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Ta funfando!!')
})

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'lista-01'
    })
})

app.use('/products', productsRoutes)

app.use((err, req, res, next) => {
    console.error(err)
    res.status(err.status || 500).json({
        erro: err.message || 'Erro interno do servidor'
    })
})

export default app