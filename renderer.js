const video = document.getElementById('video')
const canvas = document.getElementById('canvas')
const startCameraButton = document.getElementById('startCamera')
const takePhotoButton = document.getElementById('takePhoto')
const photosContainer = document.getElementById('photos')
const photoCountdown = document.getElementById('countdown')

let stream = null

startCameraButton.addEventListener('click', async() => { //async - works while other things are running (must use await)
    try{
        stream = await navigator.mediaDevices.getUserMedia({
            video: {width: video.width, height: video.height},
            audio: false
        })
        video.srcObject = stream
        video.setAttribute('crossorigin', 'anonymous')
        video.play() //optional(?)
        startCameraButton.disabled = true
        startCameraButton.textContent = 'camera active!'
    } catch(err){
        console.error('Camera not working',err)
        alert('Could not access camera: '+err.message)
    }
})

takePhotoButton.addEventListener('click', async () => {
    if(!stream){
        alert('Please start the camera first!')
        return //exit function
    }

    if (video.videoWidth === 0 || video.videoHeight === 0) {
        alert('Camera is starting... please wait a moment and try again!')
        return
    }

    takePhotoButton.disabled = true

    for(let i = 3; i > 0; i--){
        photoCountdown.textContent = i
        await new Promise(resolve => setTimeout(resolve, 1000)) //waits 1 second
    }

    photoCountdown.textContent = '📸'
    await new Promise(resolve => setTimeout(resolve, 200))

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const context = canvas.getContext('2d')

    //draw image
    context.translate(canvas.width, 0) //move to right edge
    context.scale(-1, 1) //flip horizontally
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    context.setTransform(1, 0, 0, 1, 0, 0) //reset for next time

    const imgData = canvas.toDataURL('image/png')
    const img = document.createElement('img')

    const wrapper = document.createElement('div')
    wrapper.style.display = 'flex'
    wrapper.style.flexDirection = 'column'
    wrapper.style.alignItems = 'center'
    wrapper.style.margin = '20px'

    img.src = imgData
    img.style.width = '200px'
    img.style.margin = '10px'
    img.style.border = '2px solid #333'

    wrapper.appendChild(img)

    //debugging
    img.onload = () => {
    console.log('Image loaded successfully!')
    }

    img.onerror = () => {
    console.error('Image failed to load!')
    console.error('Src:', img.src.substring(0, 100))
    }

    console.log('Image element: ', img)
    console.log('Image src: ', img.src)

    const downloadPhoto = document.createElement('button')
    downloadPhoto.textContent = "download"
    downloadPhoto.style.display = 'circle'
    downloadPhoto.style.margin = '5px auto'
    downloadPhoto.style.padding = '6px 12px'
    downloadPhoto.style.fontSize = '14px'
    downloadPhoto.style.cursor = 'pointer'

    downloadPhoto.addEventListener('click', () => {
        window.electronAPI.savePhoto(imgData)
    })

    wrapper.appendChild(downloadPhoto)

    photosContainer.appendChild(wrapper)

    photoCountdown.textContent = ' '
    takePhotoButton.disabled = false
})



