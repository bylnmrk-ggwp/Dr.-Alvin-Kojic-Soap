import { z } from 'zod'

/** Philippine mobile numbers, written any of the ways people actually write them. */
const phScheme = z
  .string()
  .trim()
  .regex(/^(\+?63|0)9\d{2}[\s-]?\d{3}[\s-]?\d{4}$/, 'Enter a Philippine mobile number, like 0917 123 4567')

export const emailField = z.string().trim().toLowerCase().email('Enter a valid email address')

export const signInSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Enter your password'),
})

export const signUpSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Enter your full name'),
    email: emailField,
    phone: phScheme,
    password: z
      .string()
      .min(8, 'Use at least 8 characters')
      .regex(/[0-9]/, 'Include at least one number'),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const shippingSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter the recipient name'),
  phone: phScheme,
  email: emailField,
  street: z.string().trim().min(4, 'Enter the house number and street'),
  barangay: z.string().trim().min(2, 'Enter the barangay'),
  city: z.string().trim().min(2, 'Enter the city or municipality'),
  province: z.string().trim().min(2, 'Enter the province'),
  postalCode: z.string().trim().regex(/^\d{4}$/, 'Postal codes are four digits'),
  notes: z.string().trim().max(400, 'Keep delivery notes under 400 characters').optional(),
})

export const paymentSchema = z.object({
  paymentMethod: z.enum(['cod', 'gcash', 'bank-transfer']),
})

export const checkoutSchema = shippingSchema.merge(paymentSchema)

export const distributorSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name'),
  email: emailField,
  phone: phScheme,
  address: z.string().trim().min(6, 'Enter your complete address'),
  city: z.string().trim().min(2, 'Enter your city or municipality'),
  province: z.string().trim().min(2, 'Enter your province'),
  sellingExperience: z.enum(['none', 'online', 'physical-store', 'both']),
  message: z.string().trim().max(800, 'Keep this under 800 characters').optional(),
})

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name'),
  email: emailField,
  topic: z.enum(['order', 'product-advice', 'authenticity', 'reselling', 'other']),
  message: z.string().trim().min(10, 'Tell us a little more so we can help').max(1200),
})

export type SignInValues = z.infer<typeof signInSchema>
export type SignUpValues = z.infer<typeof signUpSchema>
export type ShippingValues = z.infer<typeof shippingSchema>
export type CheckoutValues = z.infer<typeof checkoutSchema>
export type DistributorValues = z.infer<typeof distributorSchema>
export type ContactValues = z.infer<typeof contactSchema>
