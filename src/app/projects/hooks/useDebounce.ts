import { useRef, useEffect, useMemo } from 'react'
import debounce from 'lodash/debounce'

/**
 * Custom React hook to debounce a callback function.
 * Memoizes the debounced callback to optimize performance by minimizing unnecessary re-renders.
 *
 * @param callback The callback function to be debounced.
 * @param delay The debounce delay in milliseconds. Default is 1000ms.
 * @returns A debounced version of the callback function.
 */
const useDebounce = (callback: () => void, delay: number = 1000) => {
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
    return debounce(func, delay)
  }, [delay])

  return debouncedCallback
}

export default useDebounce
