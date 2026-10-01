import { readProducts, writeProducts } from '../db.js'

export const productsModel = {

    async findAll() {
        return (await readProducts())
            .filter(product => !product.deletedAt)
    },
    async findById(id) {

        const product = (await readProducts())
            .find(product =>
                product.id === id &&
                !product.deletedAt
            )

        return product || null
    },
    async create(data) {
        const products = await readProducts()
        const id = products.length
            ? Math.max(...products.map(product => product.id)) + 1
            : 1
        const novo = {
            id,
            ...data
        }
        products.push(novo)
        await writeProducts(products)
        return novo
    },
    async update(id, data) {
        const products = await readProducts()
        const index = products.findIndex(
            product =>
                product.id === id &&
                !product.deletedAt
        )
        if (index === -1) {
            return null
        }
        products[index] = {
            id,
            ...data
        }
        await writeProducts(products)
        return products[index]
    },
    async patch(id, data) {
        const products = await readProducts()
        const product = products.find(
            product =>
                product.id === id &&
                !product.deletedAt
        )
        if (!product) {
            return null
        }
        Object.assign(product, data)
        await writeProducts(products)
        return product
    },
    async delete(id) {
        const products = await readProducts()
        const index = products.findIndex(
            product =>
                product.id === id &&
                !product.deletedAt
        )
        if (index === -1) {
            return null
        }
        products.splice(index, 1)
        await writeProducts(products)
        return true
    },
    async softDelete(id) {
        const products = await readProducts()
        const product = products.find(
            product => product.id === id
        )
        if (!product) {
            return null
        }
        if (product.deletedAt) {
            return 'alreadyDeleted'
        }
        product.deletedAt = new Date().toISOString()
        await writeProducts(products)
        return true
    }
}
