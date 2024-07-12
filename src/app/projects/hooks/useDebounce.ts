import { useRef, useEffect, useMemo } from 'react'
import debounce from 'lodash/debounce'

/**
 * Custom React hook to debounce a callback function with a 1000ms delay.
 * Memoizes the debounced callback to optimize performance by minimizing unnecessary re-renders.
 *
 * @param callback The callback function to be debounced.
 * @returns A debounced version of the callback function.
 */
const useDebounce = (callback: () => void) => {
  // Ref to hold the latest callback function
  const ref = useRef<any>()

  // Update the ref whenever the callback function changes
  useEffect(() => {
    ref.current = callback
  }, [callback])

  // Memoize the debounced callback function to avoid recreating it on every render
  const debouncedCallback = useMemo(() => {
    // Function that invokes the current callback function
    const func = () => {
      ref.current?.()
    }

    // Debounce the function with a delay of 1000ms
    return debounce(func, 1000)
  }, [])

  return debouncedCallback
}

export default useDebounce
