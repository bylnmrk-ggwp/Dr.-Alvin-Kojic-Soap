import { useMutation, useQuery, useQueryClient, type QueryClient, type QueryKey } from '@tanstack/react-query'
import { catalogKeys } from '@/features/catalog/api/catalog.queries'
import { orderKeys } from '@/features/orders/orders.queries'
import { statusLabels } from '@/features/orders/OrderSummary'
import { toast } from '@/stores/toast.store'
import type { DistributorApplication, DistributorApplicationStatus, Order, OrderStatus, Product } from '@/types'
import {
  fetchAllOrders,
  fetchContactMessages,
  fetchDistributorApplications,
  updateApplicationStatus,
  updateOrderStatus,
  updateProduct,
  type ProductPatch,
} from './admin.api'

export const adminKeys = {
  all: ['admin'] as const,
  orders: () => [...adminKeys.all, 'orders'] as const,
  messages: () => [...adminKeys.all, 'messages'] as const,
  applications: () => [...adminKeys.all, 'applications'] as const,
}

export const applicationStatusLabels: Record<DistributorApplicationStatus, string> = {
  received: 'Received',
  reviewing: 'Reviewing',
  approved: 'Approved',
  declined: 'Declined',
}

export function useAdminOrders() {
  return useQuery({ queryKey: adminKeys.orders(), queryFn: fetchAllOrders })
}

export function useContactMessages() {
  return useQuery({ queryKey: adminKeys.messages(), queryFn: fetchContactMessages })
}

export function useDistributorApplications() {
  return useQuery({ queryKey: adminKeys.applications(), queryFn: fetchDistributorApplications })
}

/**
 * Edits land in the cached list straight away so a toggle flips under the
 * cursor; the server answer then confirms it or the change rolls back with a
 * toast. Product edits invalidate the whole catalogue so the storefront,
 * including the homepage featured section, picks them up.
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient()
  const key = catalogKeys.products()

  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: ProductPatch }) => updateProduct(id, patch),
    onMutate: async ({ id, patch }) => {
      await queryClient.cancelQueries({ queryKey: key })
      return { previous: patchCachedItem<Product>(queryClient, key, id, patch) }
    },
    onError: (error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous)
      toast.error('Could not save the product', error.message)
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: catalogKeys.all })
    },
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()
  const key = adminKeys.orders()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => updateOrderStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: key })
      return { previous: patchCachedItem<Order>(queryClient, key, id, { status }) }
    },
    onSuccess: (_data, { status }) => {
      toast.success('Order updated', `Marked as ${statusLabels[status].toLowerCase()}.`)
    },
    onError: (error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous)
      toast.error('Could not update the order', error.message)
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: key })
      // Customers see the same rows on their account page.
      void queryClient.invalidateQueries({ queryKey: orderKeys.all })
    },
  })
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient()
  const key = adminKeys.applications()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: DistributorApplicationStatus }) =>
      updateApplicationStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: key })
      return { previous: patchCachedItem<DistributorApplication>(queryClient, key, id, { status }) }
    },
    onSuccess: (_data, { status }) => {
      toast.success('Application updated', `Marked as ${applicationStatusLabels[status].toLowerCase()}.`)
    },
    onError: (error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous)
      toast.error('Could not update the application', error.message)
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: key })
    },
  })
}

/** Applies a patch to one item of a cached list and hands back the list as it was, for rollback. */
function patchCachedItem<T extends { id: string }>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  id: string,
  patch: Partial<T>,
): T[] | undefined {
  const previous = queryClient.getQueryData<T[]>(queryKey)
  if (previous) {
    queryClient.setQueryData<T[]>(
      queryKey,
      previous.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    )
  }
  return previous
}
