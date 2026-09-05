import { supabase } from '@/lib/supabase/client'
import type { DistributorValues } from '@/lib/validation/schemas'

/**
 * Applications land in `distributor_applications`. Without Supabase the
 * submission is acknowledged locally so the form can still be demonstrated.
 */
export async function submitDistributorApplication(
  values: DistributorValues,
  userId: string | null,
): Promise<{ reference: string }> {
  const reference = `DS-${Date.now().toString(36).toUpperCase().slice(-6)}`

  if (!supabase) {
    await new Promise((resolve) => window.setTimeout(resolve, 500))
    return { reference }
  }

  const { error } = await supabase.from('distributor_applications').insert({
    user_id: userId,
    full_name: values.fullName,
    email: values.email,
    phone: values.phone,
    address: values.address,
    city: values.city,
    province: values.province,
    selling_experience: values.sellingExperience,
    message: values.message ?? '',
  })

  if (error) throw new Error(`Could not send your application: ${error.message}`)
  return { reference }
}
