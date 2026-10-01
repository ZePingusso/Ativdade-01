import { productsModel } from '../models/productModel.js'

export const productsService = {
    async createProduct(data) {
        const nomeJaExiste = (await productsModel.findAll())
            .some(product => product.nome === data.nome)
        if (nomeJaExiste) {
            const erro = new Error(
                'Este produto já existe'
            )
            erro.status = 409
            throw erro
        }
        return productsModel.create(data)
    },
    async createProducts(data) {
        const products = await productsModel.findAll()
        for (const product of data) {
            if (
                !product ||
                !product.nome ||
                typeof product.nome !== 'string'
            ) {
                const erro = new Error(
                    'Todos os produtos precisam ter um nome'
                )
                erro.status = 400
                throw erro
            }
            if (
                product.preco === undefined ||
                typeof product.preco !== 'number'
            ) {
                const erro = new Error(
                    'Todos os produtos precisam ter um preço'
                )
                erro.status = 400
                throw erro
            }
            const nomeJaExiste = products.some(
                p => p.nome === product.nome
            )
            if (nomeJaExiste) {
                const erro = new Error(
                    `O produto ${product.nome} já existe`
                )
                erro.status = 409
                throw erro
            }
        }
        const novos = []
        for (const product of data) {
            const novo = await productsModel.create({
                nome: product.nome,
                preco: product.preco
            })
            novos.push(novo)
        }
        return novos
    },
    async updateProduct(id, data) {
        const product = await productsModel.findById(id)
        if (!product) {

            const erro = new Error(
                'Produto não encontrado'
            )

            erro.status = 404

            throw erro
        }
        return productsModel.update(id, data)
    },
    async patchProduct(id, data) {
        const product = await productsModel.findById(id)
        if (!product) {
            const erro = new Error(
                'Produto não encontrado'
            )
            erro.status = 404
            throw erro
        }
        const {
            id: _id,
            createdAt: _createdAt,
            updatedAt: _updatedAt,
            ...dadosPermitidos
        } = data
        dadosPermitidos.updatedAt =
            new Date().toISOString()
        return productsModel.patch(
            id,
            dadosPermitidos
        )
    },

    async deleteProduct(id) {
        const product = await productsModel.findById(id)
        if (!product) {
            const erro = new Error(
                'Produto não encontrado'
            )
            erro.status = 404
            throw erro
        }
        await productsModel.delete(id)
    },
    async softDeleteProduct(id) {
        const result = await productsModel.softDelete(id)
        if (result === null) {
            const erro = new Error(
                'Produto não encontrado'
            )
            erro.status = 404
            throw erro
        }
        if (result === 'alreadyDeleted') {
            const erro = new Error(
                'Produto já removido'
            )
            erro.status = 409
            throw erro
        }
        return true
    }
}