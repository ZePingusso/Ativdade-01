import express from 'express';
import { readProducts } from './db.js';

const app = express()

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

export default app;