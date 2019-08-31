// initialize variables
const videoEl = document.getElementById("inputVideo")
const canvas = document.getElementById("overlay")
var faceMatcher
var mtcnnParams

Promise.all(
    [
        faceapi.nets.faceRecognitionNet.loadFromUri('/'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('/')
    ]
).then(start).then(()=> {
    faceRecognition(videoEl, canvas, faceMatcher)
})

async function start() {
    // 
    navigator.getUserMedia(
        { video: {} },
        stream => videoEl.srcObject = stream,
        err => console.error(err)
    )

    mtcnnParams = new faceapi.MtcnnOptions({ minFaceSize: 200 })

    const labels = ['lsg', 'westbrook', 'kd']

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

    const maxDescriptorDistance = 0.6
    faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance)
}

async function faceRecognition(video, top_layer, matcher){
    if (video.paused || video.ended || !matcher) {
        setTimeout( faceRecognition(video, top_layer, matcher), 500);
    }

    // identify face
    const detectionResults = await faceapi.detectAllFaces(videoEl).withFaceLandmarks().withFaceDescriptors()
    const dims = faceapi.matchDimensions(canvas, videoEl, true)
    const resizedResults = faceapi.resizeResults(detectionResults, dims)
    const results = resizedResults.map(fd => matcher.findBestMatch(fd.descriptor))

    results.forEach((bestMatch, i) => {
        const box = resizedResults[i].detection.box
        const text = bestMatch.toString()
        const drawBox = new faceapi.draw.DrawBox(box, { label: text })
        drawBox.draw(canvas)
    })

    setTimeout(() => faceRecognition(video, top_layer, matcher))
}
