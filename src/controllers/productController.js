import { productsModel } from '../models/productModel.js'
import { productsService } from '../services/productService.js'

export async function listProducts(req, res, next) {
    try {
        const page = Number(req.query.page) || 1
        const limit = Math.min(Number(req.query.limit) || 20, 100)
        const offset = (page - 1) * limit

        const all = await productsModel.findAll()

        const filtrados = all.filter(product => {
            if (
                req.query.nome &&
                !product.nome.toLowerCase().includes(req.query.nome.toLowerCase())
            ) {
                return false
            }

            return true
        })

        const ordenados = applySort(filtrados, req.query.sort)

        const data = ordenados.slice(offset, offset + limit)

        res.json({
            data,
            meta: {
                total: filtrados.length,
                page,
                limit,
                totalPages: Math.ceil(filtrados.length / limit)
            }
        })

    } catch (err) {
        next(err)
    }
}

function applySort(products, sort) {
    if (!sort) return products

    const desc = sort.startsWith('-')
    const campo = desc ? sort.slice(1) : sort

    if (!['nome', 'preco'].includes(campo)) {
        return products
    }

    return [...products].sort((a, b) => {
        if (campo === 'nome') {
            return desc
                ? b.nome.localeCompare(a.nome)
                : a.nome.localeCompare(b.nome)
        }

        return desc
            ? b.preco - a.preco
            : a.preco - b.preco
    })
}

export async function getProduct(req, res, next) {
    try {
        const product = await productsModel.findById(
            Number(req.params.id)
        )
        if (!product) {
            return res.status(404).json({
                erro: 'Produto não encontrado'
            })
        }
        res.json(product)
    } catch (err) {
        next(err)
    }
}

export async function filterProducts(req, res, next) {
    try {
        const products = await productsModel.findAll()

        const filtrados = products.filter(product => {

            if (
                req.query.nome &&
                !product.nome.toLowerCase().includes(req.query.nome.toLowerCase())
            ) {
                return false
            }

            if (
                req.query.preco &&
                product.preco !== Number(req.query.preco)
            ) {
                return false
            }

            if (
                req.query.maior &&
                product.preco < Number(req.query.maior)
            ) {
                return false
            }

            return true
        })

        res.json(filtrados)

    } catch (err) {
        next(err)
    }
}

export async function createProduct(req, res, next) {
    try {
        const { nome, preco } = req.body || {}
        if (!nome || typeof nome !== 'string') {
            return res.status(400).json({
                erro: 'O produto precisa obrigatoriamente de um nome!'
            })
        }
        if (
            preco === undefined ||
            typeof preco !== 'number'
        ) {
            return res.status(400).json({
                erro: 'O produto precisa obrigatoriamente de um preço!'
            })
        }
        const novo = await productsService.createProduct({
            nome,
            preco
        })
        res.status(201).json(novo)
    } catch (err) {
        next(err)
    }
}

export async function createProducts(req, res, next) {
    try {
        if (!Array.isArray(req.body)) {
            return res.status(400).json({
                erro: 'É obrigatório o corpo da requisição ser um array'
            })
        }
        const novos = await productsService.createProducts(
            req.body
        )
        res.status(201).json(novos)
    } catch (err) {
        next(err)
    }
}

export async function updateProduct(req, res, next) {
    try {
        const { nome, preco } = req.body || {}
        if (
            !nome ||
            typeof nome !== 'string' ||
            preco === undefined ||
            typeof preco !== 'number'
        ) {
            return res.status(400).json({
                erro: 'nome e preço são obrigatórios para PUT'
            })
        }
        const product = await productsService.updateProduct(
            Number(req.params.id),
            {
                nome,
                preco
            }
        )
        res.json(product)
    } catch (err) {
        next(err)
    }
}

export async function patchProduct(req, res, next) {
    try {
        const product = await productsService.patchProduct(
            Number(req.params.id),
            req.body || {}
        )
        res.json(product)
    } catch (err) {
        next(err)
    }
}

export async function deleteProduct(req, res, next) {
    try {
        await productsService.deleteProduct(
            Number(req.params.id)
        )
        res.status(204).end()
    } catch (err) {
        next(err)
    }
}

export async function softDeleteProduct(req, res, next) {
    try {
        await productsService.softDeleteProduct(
            Number(req.params.id)
        )
        res.status(204).end()
    } catch (err) {
        next(err)
    }
}