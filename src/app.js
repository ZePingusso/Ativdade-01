import express from 'express';
import { readProducts, writeProducts } from './db.js';

const app = express()
app.use(express.json())

app.get('/', (req,res) => {
    res.send('Ta funfando!!')
})
app.get('/health', (req,res) => {
    res.json({ status: 'ok', service: 'lista-01'})
})
app.get('/products', async (req,res) => {
    const products = await readProducts()
    res.json(products)
})
app.get('/products/:id', async (req,res) => {
    const products = await readProducts()
    const product = products.find(p => p.id === Number(req.params.id));
    if (!product) return res.status(404).json({erro:"Produto não encontrado"});
    res.json(product)
})
app.get('/product', async (req,res) => {
    const { maior } = req.query;
    let products = await readProducts()
    if (maior) {
        products = products.filter((p) => p.preco >= Number(maior))
    }
    res.json(products)
});
app.post('/products', async (req,res) => {
    const { nome, preco } = req.body || {}
    if (!nome || typeof nome !== 'string') {
        return res.status(400).json({erro: 'O produto precisa obrigatoriamente de um nome!'})
    }
    if (!preco || typeof preco !== 'number') {
        return res.status(400).json({erro: 'O produto precisa obrigatoriamente deum preço!' })
    }

    const products = await readProducts()

    const productExist = products.some(product => product.nome === nome)
    if (productExist) {
        return res.status(409).json({
            erro: 'Este produto já existe'
        })
    }

    const novoId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1
    
    const novo = { id: novoId, nome, preco }
    products.push(novo)
    await writeProducts(products)

    res.status(201).json(novo)
})

export default app;