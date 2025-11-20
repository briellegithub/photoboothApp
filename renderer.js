const video = document.getElementById('video')
const canvas = document.getElementById('canvas')
const startCameraButton = document.getElementById('startCamera')
const takePhotoButton = document.getElementById('takePhoto')
const photosContainer = document.getElementById('photos')

let stream = null

startCameraButton.addEventListener('click', async() => { //async - works while other things are running (must use await)
    try{
        stream = await navigator.mediaDevices.getUserMedia({
            video: {width: video.width, height: video.height},
            audio: false
        })
        video.srcObject = stream
        video.setAttribute('crossorigin', 'anonymous')  // NEW LINE
        video.play()  // NEW LINE - explicitly start playing
        startCameraButton.disabled = true
        startCameraButton.textContent = 'camera active!'
    } catch(err){
        console.error('Camera not working',err)
        alert('Could not access camera: '+err.message)
    }
})

takePhotoButton.addEventListener('click', () => {
    if(!stream){
        alert('Please start the camera first!')
        return
    }

    if (video.videoWidth === 0 || video.videoHeight === 0) {
        alert('Camera is starting... please wait a moment and try again!')
        return
    }
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

    img.src = imgData
    img.style.width = '200px'
    img.style.margin = '10px'
    img.style.border = '2px solid #333'

    //debugging
    img.onload = () => {
    console.log('Image loaded successfully!')
    }

    img.onerror = () => {
    console.error('Image failed to load!')
    console.error('Src:', img.src.substring(0, 100))
    }


    //add image to photos container
    photosContainer.appendChild(img)

    console.log('Image element: ', img)
    console.log('Image src: ', img.src)
})




/*
+ const video = document.getElementById('video')
+ const canvas = document.getElementById('canvas')
+ const startButton = document.getElementById('startCamera')
+ const photoButton = document.getElementById('takePhoto')
+ const photosDiv = document.getElementById('photos')
+ 
+ let stream = null
+ 
+ // Start camera
+ startButton.addEventListener('click', async () => {
+   try {
+     stream = await navigator.mediaDevices.getUserMedia({ 
+       video: { width: 640, height: 480 },
+       audio: false 
+     })
+     video.srcObject = stream
+     startButton.disabled = true
+     startButton.textContent = 'Camera Active ✓'
+   } catch (err) {
+     console.error('Error accessing camera:', err)
+     alert('Could not access camera: ' + err.message)
+   }
+ })
+ 
+ // Take photo
+ photoButton.addEventListener('click', () => {
+   if (!stream) {
+     alert('Please start the camera first!')
+     return
+   }
+ 
+   // Set canvas size to match video
+   canvas.width = video.videoWidth
+   canvas.height = video.videoHeight
+ 
+   // Draw video frame to canvas
+   const context = canvas.getContext('2d')
+   context.drawImage(video, 0, 0, canvas.width, canvas.height)
+ 
+   // Convert to image and display
+   const imgData = canvas.toDataURL('image/png')
+   const img = document.createElement('img')
+   img.src = imgData
+   img.style.width = '200px'
+   img.style.margin = '10px'
+   img.style.border = '2px solid #333'
+   photosDiv.appendChild(img)
+ })
*/
