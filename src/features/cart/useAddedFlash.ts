import { useCallback, useEffect, useRef, useState } from 'react'

const FLASH_MS = 1400

/**
 * A short "Added" confirmation for add-to-cart buttons. Returns whether the
 * flash is showing and a function to trigger it; repeated clicks restart it.
 */
export function useAddedFlash(): [boolean, () => void] {
  const [isFlashing, setIsFlashing] = useState(false)
  const timer = useRef<number | null>(null)

  const flash = useCallback(() => {
    setIsFlashing(true)
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setIsFlashing(false), FLASH_MS)
  }, [])

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current)
    },
    [],
  )

  return [isFlashing, flash]
}
