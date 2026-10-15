import { z } from 'zod'

export const productSchema = z.object({
  nome: z.string().min(1),
  preco: z.number().positive(),
  tags: z.array(z.string()).optional()
})

export const updateProductSchema = productSchema.partial()