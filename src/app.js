import express from 'express';
import { readProducts, writeProducts } from './db.js';

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Ta funfando!!')
})
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'lista-01' })
})
app.get('/products', async (req, res) => {
    const products = await readProducts()
    res.json(products)
})
app.get('/products/:id', async (req, res) => {
    const products = await readProducts()
    const product = products.find(p => p.id === Number(req.params.id));
    if (!product) return res.status(404).json({ erro: "Produto não encontrado" });
    res.json(product)
})
app.get('/product', async (req, res) => {
    const { maior } = req.query;
    let products = await readProducts()
    if (maior) {
        products = products.filter((p) => p.preco >= Number(maior))
    }
    res.json(products)
});
app.post('/products', async (req, res) => {
    const { nome, preco } = req.body || {}
    if (!nome || typeof nome !== 'string') {
        return res.status(400).json({ erro: 'O produto precisa obrigatoriamente de um nome!' })
    }
    if (!preco || typeof preco !== 'number') {
        return res.status(400).json({ erro: 'O produto precisa obrigatoriamente deum preço!' })
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

app.post('/products/batch', async (req, res) => {
    const newProducts = req.body

    if (!Array.isArray(newProducts)) {
        return res.status(400).json({
            erro: 'É obrigatório o corpo da requisição ser um array'
        })
    }
    const products = await readProducts()

    for (const product of newProducts) {
        if (!product || !product.nome || typeof product.nome !== 'string') {
            return res.status(400).json({
                erro: 'Todos os produtos precisam obrigatoriamente ter um nome!'
            })
        }

        if (product.preco === undefined || typeof product.preco !== 'number') {
            return res.status(400).json({
                erro: 'Todos os produtos precisam obrigatoriamente ter um preço!'
            })
        }
    }

    for (const product of newProducts) {
        const productExist = products.some(
            products => products.nome === product.nome
        )
        if (productExist) {
            return res.status(409).json({
                erro: `O produto ${product.nome} já existe!`
            })
        }
    }

    let proximoId = products.length ? Math.max(...products.map(product => product.id)) + 1 : 1

    const createdProducts = newProducts.map(product => {
        const newProduct = {
            id: proximoId++,
            nome: product.nome,
            preco: product.preco
        }
        products.push(newProduct)

        return newProduct
    })

    await writeProducts(products)

    res.status(201).json(createdProducts)
})

app.put('/produtos/:id', async (req, res) => {
    const id = Number(req.params.id)

    const { nome, preco } = req.body || {}

    if (!nome || !preco) {
        return res.status(400).json({
            erro: 'nome e preço são obrigatórios para PUT (substituição completa)'
        })
    }

    const products = await readProdutos()
    const idx = products.findIndex(p => p.id === id)
    if (idx === -1) return res.status(404).json({ erro: 'Produto não encontrado' })

    products[idx] = { id, nome, preco }

    await writeProdutos(products)
    res.json(products[idx])
})

app.patch('/produtos/:id', async (req, res) => {
    const id = Number(req.params.id)
    const products = await readProdutos()
    const product = products.find(p => p.id === id)
    if (!product) return res.status(404).json({ erro: 'Produto não encontrado' })

    const { id: _, createdAt: __, updatedAt: ___, ...dadosPermitidos } = req.body || {}
    Object.assign(product, dadosPermitidos)

    product.updatedAt = new Date().toISOString()

    await writeProdutos(products)
    res.json(product)
})

app.delete('/products/:id', async (req, res) => {
const id = Number(req.params.id)
const products = await readProducts()
const idx = products.findIndex(p => p.id === id)
if (idx === -1) return res.status(404).json({ erro: 'Produto não encontrado' })

products.splice(idx, 1)
await writeProducts(products)
res.status(204).end()
})

app.delete('/productss/:id', async (req, res) => {
const id = Number(req.params.id)
const products = await readProducts()
const product = products.find(p => p.id === id)
if (!product) return res.status(404).json({ erro: 'Produto não encontrado' })
if (product.deletedAt) return res.status(409).json({ erro: 'Já removido' })

product.deletedAt = new Date().toISOString()
await writeProducts(products)
res.status(204).end()
})

console.log("BATCH CARREGADO!");
export default app;