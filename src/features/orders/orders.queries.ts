import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchMyOrders, fetchOrderByReference, placeOrder } from './orders.api'

export const orderKeys = {
  all: ['orders'] as const,
  mine: (userId: string | null) => [...orderKeys.all, 'mine', userId ?? 'guest'] as const,
  byReference: (reference: string) => [...orderKeys.all, 'ref', reference] as const,
}

export function useMyOrders(userId: string | null) {
  return useQuery({
    queryKey: orderKeys.mine(userId),
    queryFn: () => fetchMyOrders(userId),
  })
}

export function useOrderByReference(reference: string | undefined) {
  return useQuery({
    queryKey: orderKeys.byReference(reference ?? ''),
    queryFn: () => fetchOrderByReference(reference!),
    enabled: Boolean(reference),
  })
}

export function usePlaceOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: placeOrder,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orderKeys.all })
    },
  })
}
