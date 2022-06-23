
export const makeSquareImage = (index, file, formData, setFormData) => {

  // Give the selected image a blob URL
  const urlString = URL.createObjectURL(file)
  const img = new Image()
  img.src = urlString


  img.onload = async function() {
    // Automatically square and center the image
    const widthMoreThanHeight = img.width > img.height ? true : false
    const widthOverHeight = img.width / img.height
    let scale
    let startX
    let startY
    let sideLength
    if (widthMoreThanHeight) {
      scale = img.height / 300
      startX = -(img.width - img.height) / 2
      startY = 0
      sideLength = img.height
    } else if (widthOverHeight === 1){
      scale = img.height / 300
      startX = 0
      startY = 0
      sideLength = img.height
    } else {
      scale = img.width / 300
      startX = 0
      startY = -(img.height - img.width) / 2
      sideLength = img.width
    }

    const canvas = document.createElement('canvas')
    canvas.width = sideLength
    canvas.height = sideLength

    const ctx = canvas.getContext('2d')
    ctx.drawImage(
      img, //image
      startX,
      startY
    )
    
    // Convert the square image to a data url
    const squareImageURL = canvas.toDataURL('image/jpg', 1)
    
    // Set the selected form image index to the squared and centered image data URL
    const newPhotos = formData.images
    newPhotos[index] = squareImageURL
    setFormData({ ...formData, images: [ ...newPhotos ] })
  }


}