import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface PreviewImage {
  file: File
  previewUrl: string
}

export function useImageUpload() {
  const [previews, setPreviews] = useState<PreviewImage[]>([])
  const [isUploading, setIsUploading] = useState(false)

  function addImages(files: FileList) {
    const newPreviews: PreviewImage[] = Array.from(files).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }))
    setPreviews((prev) => [...prev, ...newPreviews])
  }

  function removeImage(index: number) {
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl)
      return prev.filter((_, i) => i !== index)
    })
  }

  function reset() {
    previews.forEach((p) => URL.revokeObjectURL(p.previewUrl))
    setPreviews([])
  }

  async function uploadImages(postId: string): Promise<string[]> {
    setIsUploading(true)
    const urls: string[] = []

    try {
      for (const [index, preview] of previews.entries()) {
        const ext = preview.file.name.split('.').pop()
        const path = `${postId}/${index}_${Date.now()}.${ext}`

        const { error } = await supabase.storage
          .from('feed-images')
          .upload(path, preview.file)

        if (error) {
          console.error('useImageUpload: upload error', error)
          continue
        }

        const { data } = supabase.storage
          .from('feed-images')
          .getPublicUrl(path)

        urls.push(data.publicUrl)
      }
    } finally {
      setIsUploading(false)
    }

    return urls
  }

  return { previews, isUploading, addImages, removeImage, reset, uploadImages }
}