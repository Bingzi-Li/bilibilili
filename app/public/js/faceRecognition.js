// initialize variables
const videoEl = document.getElementById("inputVideo")
const canvas = document.getElementById("overlay")
var studentPhotosPaths
var studentFlag = {}
var faceMatcher


// $(document).ready(function() {
//     getStudentPhotoPath()

//     // run the face detection
//     Promise.all(
//         [
//             // load models
//             faceapi.nets.faceRecognitionNet.loadFromUri('/'),
//             faceapi.nets.faceLandmark68Net.loadFromUri('/'),
//             faceapi.nets.ssdMobilenetv1.loadFromUri('/')
//         ]
//     ).then(start)
// });

/**
 * fetch student photo path
 */
function getStudentPhotoPath() {

    $.ajax({
        type: "GET",
        url: "/staff/" + currentUserEmail + '/' + currentSessionName + '/getStudentPhotoPaths',
        success: function(result) {
            studentPhotosPaths = result
            result.forEach(function(data) {
                studentFlag[data[1]] = true
            })
        },

        error: function(e) {
            console.log(e.status);
            console.log(e.responseText);
        }
    })
}

/**
 * This function initialize all objects required for face detection and recognition
 */
async function start() {

    // turn on the camera
    navigator.getUserMedia({ video: {} },
        stream => videoEl.srcObject = stream,
        err => console.log(err)
    )

    // user labels
    //const labels = ['lsg', 'westbrook', 'kd']

    // initialize face descriptors
    const labeledFaceDescriptors = await Promise.all(
        studentPhotosPaths.map(async(student) => {

            // fetch image data from urls and convert blob to HTMLImage element
            const imgUrl = `http://localhost:3000/public/faces/${student[1]}/${student[2]}`
            const img = await faceapi.fetchImage(imgUrl)

            // detect the face with the highest score in the image and compute it's landmarks and face descriptor
            const fullFaceDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()

            if (!fullFaceDescription) {
                throw new Error(`no faces detected for ${student[0]}`)
            }

            const faceDescriptors = [fullFaceDescription.descriptor]
            return new faceapi.LabeledFaceDescriptors(student[1], faceDescriptors)
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

    while (true) {
        // identify face
        const detectionResult = await faceapi.detectSingleFace(video).withFaceLandmarks().withFaceDescriptor()
        if (detectionResult == null) {
            continue
        }
        const dims = faceapi.matchDimensions(canvas, video, true)
        const resizedResult = faceapi.resizeResults(detectionResult, dims)
        const result = matcher.findBestMatch(resizedResult.descriptor)

        const box = resizedResult.detection.box
        const text = result.toString().split("(")[0].trim()
        const drawBox = new faceapi.draw.DrawBox(box, { label: text })
        drawBox.draw(top_layer)

        // check if a studnet has done the attendance taking
        // if an unregistered student is captured, call a modal
        // return

        if (text != "unknown" && studentFlag[text]) {
            confirmAttendanceModal(text)
                //const studentMatricNumber = studentPhotosPaths[ parseInt(text)].matricNumber
            return
        }
        // // draw the results
        // results.forEach((bestMatch, i) => {
        //     const box = resizedResults[i].detection.box
        //     const text = bestMatch.toString().split("(")[0].trim()
        //     const drawBox = new faceapi.draw.DrawBox(box, { label: text })
        //     drawBox.draw(canvas)
        //     if (text == "unknown") {
        //         alert(text)
        //         return
        //     }

        // })
    }


    // setTimeout(() => faceRecognition(video, top_layer, matcher))
}

function goBack() {
    window.history.back()
}

function startFaceRecognition() {
    if (videoEl.paused || videoEl.ended || !faceMatcher) {
        alertify.warning("The system is still laoding...")
        return
    } else {
        faceRecognition(videoEl, canvas, faceMatcher)
    }
}

function confirmAttendanceModal(matric) {
    document.getElementById("confirmMessage").innerText = "Are you " + matric
    document.getElementById("confirmAttendanceButton").onclick = function() { confirmAttendance(matric) };
    //$("#confirmAttendanceButton").click(function() { confirmAttendance(matric) });
    $('#confirmAttendanceModal').modal()
}

function confirmAttendance(matric) {

    $.ajax({    
        type: "POST",
        url: "/staff/" + currentUserEmail + '/' + currentSessionName + '/takeAttendance/' + currentSessionChoice + '/' + matric,
        success: function(data) {
            studentFlag[matric] = false
            alertify.success(matric + " attendance has been recorded")
            $('#confirmAttendanceModal').modal('hide')
            startFaceRecognition()

        },
        error: function(e) {
            {
                alertify.error("Failed to register attendance")
                $('#confirmAttendanceModal').modal('hide')
                startFaceRecognition()
            }
        }
    });
}