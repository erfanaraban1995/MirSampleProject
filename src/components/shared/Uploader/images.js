export function scaleImage(file, maxSize) {
  return new Promise(function(resolve) {
    const reader = new FileReader()
    reader.onload = function (readerEvent) {
      const image = new Image()
      image.crossOrigin = 'Anonymous'

      image.onload = function() {
        const canvas = document.createElement('canvas')
        const { width, height } = getSize(image.width, image.height, maxSize)

        if (image.width > width || image.height > height) {
          canvas.width = width
          canvas.height = height

          canvas.getContext('2d').drawImage(image, 0, 0, width, height)
          const dataUrl = canvas.toDataURL(file.type)
          const blob = dataURLToBlob(dataUrl)

          // A Blob() is almost a File()
          // it's just missing the two properties below which we will add
          blob.lastModifiedDate = file.lastModifiedDate
          blob.name = file.name

          resolve(blob)
        } else {
          resolve(file)
        }
      }
      image.src = readerEvent.target.result
    }
    reader.readAsDataURL(file)
  })
}

export function scaleImageToDataUrl(url, maxSize, mimeType) {
  mimeType = mimeType || 'image/png'

  return new Promise(function(resolve, reject) {
    const image = new Image()
    image.crossOrigin = 'Anonymous'

    image.onload = function() {
      const canvas = document.createElement('canvas')
      const { width, height } = getSize(image.width, image.height, maxSize)

      if (image.width > width || image.height > height) {
        canvas.width = width
        canvas.height = height

        canvas.getContext('2d').drawImage(image, 0, 0, width, height)
        const dataUrl = canvas.toDataURL(mimeType)
        resolve(dataUrl)
      } else {
        resolve(url)
      }
    }

    image.onerror = function(e) {
      reject(e)
    }

    image.src = url
  })
}

export function getDataUrlFromFile(file) {
  return new Promise(function(resolve) {
    const reader = new FileReader()
    reader.onload = function (event) {
      resolve(event.target.result)
    }
    reader.readAsDataURL(file)
  })
}

export function getBlobFromDataUrl(dataUrl) {
  const dataUrlArr = dataUrl.split(',')
  const mimeType = dataUrlArr[0].split(/;|:/g)[1]
  const binary = atob(dataUrlArr[1])
  const array = []
  for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i))
  }
  return new Blob([new Uint8Array(array)], {type: mimeType})
}

export function getMimeTypeExtension(mimeType) {
  switch (mimeType) {
    case 'image/jpeg':
      return 'jpg'
    case 'image/bmp':
      return 'bmp'
    case 'image/tiff':
      return 'tif'
    case 'image/x-icon':
      return 'ico'
    case 'image/png':
    default:
      return 'png'
  }
}

/* Utility function to get new size */
function getSize (w, h, maxSize) {
  if (w > h) {
    if (w > maxSize) {
      h *= maxSize / w
      w = maxSize
    }
  } else {
    if (h > maxSize) {
      w *= maxSize / h
      h = maxSize
    }
  }
  return {
    width: Math.round(w),
    height: Math.round(h)
  }
}

/* Utility function to convert a canvas to a BLOB */
function dataURLToBlob (dataURL) {
  const BASE64_MARKER = 'base64,'
  if (dataURL.indexOf(BASE64_MARKER) === -1) {
    const parts = dataURL.split(',')
    const contentType = parts[0].split(':')[1]
    const raw = parts[1]

    return new Blob([raw], {type: contentType})
  }

  const parts = dataURL.split(BASE64_MARKER)
  const contentType = parts[0].split(':')[1]
  const raw = atob(parts[1])
  const rawLength = raw.length

  const uInt8Array = new Uint8Array(rawLength)

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i)
  }

  return new Blob([uInt8Array], {type: contentType})
}
