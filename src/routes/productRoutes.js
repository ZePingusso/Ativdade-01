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

const router = Router()

router.get('/', listProducts)
router.get('/filter', filterProducts)
router.get('/:id', getProduct)
router.post('/', createProduct)
router.post('/batch', createProducts)
router.put('/:id', updateProduct)
router.patch('/:id', patchProduct)
router.delete('/:id', deleteProduct)
router.delete('/:id/soft', softDeleteProduct)

export default router