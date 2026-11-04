// models/productModel.js
import { ObjectId } from 'mongodb'
import { conectar } from '../data/db.js'

// Lista todos os produtos que não foram excluídos
export async function listar() {
    const db = await conectar()

    const docs = await db.collection('products')
        .find({ deletedAt: null })
        .toArray()

    return docs.map(p => ({
        ...p,
        id: String(p._id)
    }))
}

// Busca um produto pelo ID
export async function findById(id) {
    if (!ObjectId.isValid(id)) {
        return null
    }

    const db = await conectar()

    const produto = await db.collection('products').findOne({
        _id: new ObjectId(id),
        deletedAt: null
    })

    if (!produto) {
        return null
    }

    return {
        ...produto,
        id: String(produto._id)
    }
}

// Cria um produto
export async function criar(dados) {
    const db = await conectar()

    const novoProduto = {
        ...dados,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null
    }

    const res = await db.collection('products').insertOne(novoProduto)

    return {
        ...novoProduto,
        id: String(res.insertedId)
    }
}

// Atualiza um produto completamente
export async function update(id, dados) {
    if (!ObjectId.isValid(id)) {
        return null
    }

    const db = await conectar()

    const { id: _id, _id: _mongoId, ...dadosPermitidos } = dados

    await db.collection('products').updateOne(
        {
            _id: new ObjectId(id),
            deletedAt: null
        },
        {
            $set: {
                ...dadosPermitidos,
                updatedAt: new Date().toISOString()
            }
        }
    )

    return findById(id)
}

// Atualiza parcialmente um produto
export async function patch(id, dados) {
    if (!ObjectId.isValid(id)) {
        return null
    }

    const db = await conectar()

    const {
        id: _id,
        _id: _mongoId,
        createdAt: _createdAt,
        updatedAt: _updatedAt,
        deletedAt: _deletedAt,
        ...dadosPermitidos
    } = dados

    await db.collection('products').updateOne(
        {
            _id: new ObjectId(id),
            deletedAt: null
        },
        {
            $set: {
                ...dadosPermitidos,
                updatedAt: new Date().toISOString()
            }
        }
    )

    return findById(id)
}

// Exclui definitivamente um produto
export async function excluir(id) {
    if (!ObjectId.isValid(id)) {
        return null
    }

    const db = await conectar()

    const resultado = await db.collection('products').deleteOne({
        _id: new ObjectId(id)
    })

    return resultado.deletedCount > 0
}

// Exclui logicamente um produto
export async function softDelete(id) {
    if (!ObjectId.isValid(id)) {
        return null
    }

    const db = await conectar()

    const colecao = db.collection('products')
    const objectId = new ObjectId(id)

    const produto = await colecao.findOne({
        _id: objectId
    })

    if (!produto) {
        return null
    }

    if (produto.deletedAt) {
        return 'alreadyDeleted'
    }

    await colecao.updateOne(
        { _id: objectId },
        {
            $set: {
                deletedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        }
    )

    return true
}

// Mantém compatibilidade com o controller anterior
export const productsModel = {
    findAll: listar,
    findById,
    create: criar,
    update,
    patch,
    delete: excluir,
    softDelete
}