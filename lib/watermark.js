/**
 * Automatically bakes the "AS" circular watermark onto uploaded images
 * before uploading to Supabase Storage.
 */
export async function addWatermarkToImage(file) {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('image/')) {
      resolve(file)
      return
    }

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target.result
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        canvas.width = img.width
        canvas.height = img.height

        // 1. Draw original image
        ctx.drawImage(img, 0, 0)

        // 2. Calculate watermark size based on image dimensions
        const size = Math.max(Math.min(img.width, img.height) * 0.08, 36)
        const padding = size * 0.4
        const x = padding + size / 2
        const y = padding + size / 2

        // 3. Draw dark circular background
        ctx.save()
        ctx.beginPath()
        ctx.arc(x, y, size / 2, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(27, 60, 95, 0.85)' // Brand navy color
        ctx.fill()
        ctx.lineWidth = size * 0.05
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'
        ctx.stroke()

        // 4. Draw "AS" text
        ctx.fillStyle = '#ffffff'
        ctx.font = `bold ${Math.round(size * 0.45)}px sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('AS', x, y)
        ctx.restore()

        // 5. Convert back to File
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file)
              return
            }
            const watermarkedFile = new File([blob], file.name, {
              type: file.type || 'image/jpeg',
              lastModified: Date.now(),
            })
            resolve(watermarkedFile)
          },
          file.type || 'image/jpeg',
          0.92
        )
      }
      img.onerror = () => resolve(file)
    }
    reader.onerror = () => resolve(file)
  })
}