// initialize variables
const videoEl = document.getElementById("inputVideo")
const canvas = document.getElementById("overlay")
var faceMatcher
var mtcnnParams

// run the face detection
Promise.all(
    [
        // load models
        faceapi.nets.faceRecognitionNet.loadFromUri('/'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('/')
    ]
).then(start).then(() => {
    faceRecognition(videoEl, canvas, faceMatcher)
})

/**
 * This function initialize all objects required for face detection and recognition
 */
async function start() {

    // turn on the camera
    navigator.getUserMedia({ video: {} },
        stream => videoEl.srcObject = stream,
        err => console.error(err)
    )

    // initialize the model parameters
    mtcnnParams = new faceapi.MtcnnOptions({ minFaceSize: 200 })

    // user labels
    const labels = ['lsg', 'westbrook', 'kd']

    // initialize face descriptors
    const labeledFaceDescriptors = await Promise.all(
        labels.map(async label => {
            // fetch image data from urls and convert blob to HTMLImage element
            const imgUrl = `http://localhost:3000/public/images/${label}.jpeg`
            const img = await faceapi.fetchImage(imgUrl)

            // detect the face with the highest score in the image and compute it's landmarks and face descriptor
            const fullFaceDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()

            if (!fullFaceDescription) {
                throw new Error(`no faces detected for ${label}`)
            }

            const faceDescriptors = [fullFaceDescription.descriptor]
            return new faceapi.LabeledFaceDescriptors(label, faceDescriptors)
        })
    )

    // initialize face matcher which will be used to predict face label
    const maxDescriptorDistance = 0.6
    faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance)
}


/**
 * This function performs face matching and draw the resutls on the canvas
 * @param {*} video the video element which is the window of web cam
 * @param {*} top_layer the canvas on top of the video
 * @param {*} matcher the FaceMatcher object
 */
async function faceRecognition(video, top_layer, matcher) {

    // check if all are loaded
    if (video.paused || video.ended || !matcher) {
        setTimeout(faceRecognition(video, top_layer, matcher), 500);
    }

    // identify face
    const detectionResults = await faceapi.detectAllFaces(videoEl).withFaceLandmarks().withFaceDescriptors()
    const dims = faceapi.matchDimensions(canvas, videoEl, true)
    const resizedResults = faceapi.resizeResults(detectionResults, dims)
    const results = resizedResults.map(fd => matcher.findBestMatch(fd.descriptor))

    // draw the results
    results.forEach((bestMatch, i) => {
        const box = resizedResults[i].detection.box
        const text = bestMatch.toString()
        const drawBox = new faceapi.draw.DrawBox(box, { label: text })
        drawBox.draw(canvas)
    })

    setTimeout(() => faceRecognition(video, top_layer, matcher))
}