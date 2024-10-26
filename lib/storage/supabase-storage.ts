// src/lib/storage/supabase-storage.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

// Enum untuk bucket names
export enum StorageBucket {
  EVENT_BANNER = 'events-banner',
  PROFILE_IMAGES = 'profile-images',
  DOCUMENTS = 'documents'
}

interface UploadOptions {
  // Opsi tambahan untuk upload
  maxSize?: number // dalam bytes
  allowedTypes?: string[]
  path?: string
}

class StorageService {
  private readonly defaultMaxSize = 50 * 1024 * 1024 // 50MB default limit
  private readonly defaultAllowedTypes = {
    [StorageBucket.EVENT_BANNER]: ['image/jpeg', 'image/png', 'image/webp'],
    [StorageBucket.PROFILE_IMAGES]: ['image/jpeg', 'image/png', 'image/webp'],
    [StorageBucket.DOCUMENTS]: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  }

  // Validasi file sebelum upload
  private validateFile(file: File, bucket: StorageBucket, options?: UploadOptions) {
    const maxSize = options?.maxSize || this.defaultMaxSize
    const allowedTypes = options?.allowedTypes || this.defaultAllowedTypes[bucket]

    if (file.size > maxSize) {
      throw new Error(`File terlalu besar. Maksimal ${maxSize / (1024 * 1024)}MB`)
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Tipe file tidak didukung. Tipe yang diizinkan: ${allowedTypes.join(', ')}`)
    }
  }

  // Generate unique filename
  private generateFileName(file: File, prefix?: string): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(7)
    const fileExt = file.name.split('.').pop()
    return `${prefix ? prefix + '-' : ''}${timestamp}-${random}.${fileExt}`
  }

  // Upload file ke bucket
  async uploadFile(
    bucket: StorageBucket,
    file: File,
    options?: UploadOptions
  ) {
    try {
      // Validasi file
      this.validateFile(file, bucket, options)

      // Generate filename
      const fileName = this.generateFileName(file, options?.path)

      // Upload ke Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // Get URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path)

      return {
        path: data.path,
        url: publicUrl
      }

    } catch (error) {
      console.error(`Error uploading to ${bucket}:`, error)
      throw error
    }
  }

  // Delete file dari bucket
  async deleteFile(bucket: StorageBucket, path: string) {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path])

      if (error) throw error

      return true
    } catch (error) {
      console.error(`Error deleting from ${bucket}:`, error)
      throw error
    }
  }

  // Get signed URL untuk file private
  async getSignedUrl(bucket: StorageBucket, path: string, expiresIn = 3600) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn)

      if (error) throw error

      return data.signedUrl
    } catch (error) {
      console.error(`Error getting signed URL from ${bucket}:`, error)
      throw error
    }
  }

  // List semua file dalam bucket
  async listFiles(bucket: StorageBucket, path?: string) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(path)

      if (error) throw error

      return data
    } catch (error) {
      console.error(`Error listing files from ${bucket}:`, error)
      throw error
    }
  }
}

export const storageService = new StorageService()