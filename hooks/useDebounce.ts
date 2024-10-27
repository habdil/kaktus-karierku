// hooks/useDebounce.ts

import { useState, useEffect } from 'react';

/**
 * A custom hook that delays updating a value until a specified delay has passed
 * Useful for search inputs and other scenarios where you want to limit API calls
 * 
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced value
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('')
 * const debouncedSearch = useDebounce(searchTerm, 500)
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Create a timer to delay updating the debounced value
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if the value changes before the delay has passed
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]); // Only re-run the effect if value or delay changes

  return debouncedValue;
}

/**
 * A version of useDebounce that provides loading state
 * Useful when you want to show loading indicators while waiting for the debounce
 * 
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @returns An object containing the debounced value and loading state
 * 
 * @example
 * const { debouncedValue, isDebouncing } = useDebounceWithLoading(searchTerm, 500)
 */
export function useDebounceWithLoading<T>(value: T, delay: number = 500): {
  debouncedValue: T;
  isDebouncing: boolean;
} {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isDebouncing, setIsDebouncing] = useState<boolean>(false);

  useEffect(() => {
    setIsDebouncing(true);
    
    const timer = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return { debouncedValue, isDebouncing };
}

/**
 * A version of useDebounce that allows for immediate updates in certain conditions
 * Useful when you want to bypass the debounce delay in some cases
 * 
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @param immediate Whether to update immediately
 * @returns The debounced value
 * 
 * @example
 * const debouncedSearch = useDebounceWithImmediate(searchTerm, 500, searchTerm.length < 3)
 */
export function useDebounceWithImmediate<T>(
  value: T, 
  delay: number = 500,
  immediate: boolean = false
): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    if (immediate) {
      setDebouncedValue(value);
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay, immediate]);

  return debouncedValue;
}