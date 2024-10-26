import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  const d = new Date(date)
  
  // Format options for date and time
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }

  // Format date and time using Intl.DateTimeFormat
  const formattedDate = new Intl.DateTimeFormat('id-ID', dateOptions).format(d)
  const formattedTime = new Intl.DateTimeFormat('id-ID', timeOptions).format(d)

  return `${formattedDate} • ${formattedTime}`
}

// Format relative time (e.g., "2 hours ago")
export function formatRelativeTime(date: string | Date) {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  } as const;

  for (const [unit, seconds] of Object.entries(intervals)) {
    const difference = Math.floor(diffInSeconds / seconds)

    if (difference >= 1) {
      return `${difference} ${unit}${difference === 1 ? '' : 's'} ago`
    }
  }

  return 'just now'
}

// Format price to IDR
export function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Format number with comma
export function formatNumber(number: number) {
  return new Intl.NumberFormat('id-ID').format(number)
}

// Format file size
export function formatFileSize(bytes: number) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Byte'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`
}

// Truncate text with ellipsis
export function truncateText(text: string, length: number) {
  return text.length > length ? `${text.substring(0, length)}...` : text
}

// Slugify text for URLs
export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/--+/g, '-')     // Replace multiple - with single -
    .replace(/^-+/, '')       // Trim - from start of text
    .replace(/-+$/, '')       // Trim - from end of text
}

// Get initials from name
export function getInitials(name: string) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
}