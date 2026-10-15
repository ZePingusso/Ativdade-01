import { Router } from 'express'
import {
    listProducts,
    getProduct,
    filterProducts,
    createProduct,
    createProducts,
    updateProduct,
    patchProduct,
    deleteProduct,
    softDeleteProduct
} from '../controllers/productController.js'
import { valida } from '../middlewares/valid.js'
import { productSchema, updateProductSchema } from '../schemas/productSchema.js'

const router = Router()

router.get('/', listProducts)
router.get('/filter', filterProducts)
router.get('/:id', getProduct)
router.post('/', valida(productSchema), createProduct)
router.post('/batch', valida(productSchema), createProducts)
router.put('/:id', valida(updateProductSchema), updateProduct)
router.patch('/:id', valida(updateProductSchema), patchProduct)
router.delete('/:id', deleteProduct)
router.delete('/:id/soft', softDeleteProduct)

export default router