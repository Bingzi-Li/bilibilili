function deleteUser(element) {
    var email = element.parentElement.parentElement.children[1].innerText

    $.ajax({
        url: "/admin/manageStaff/delete/" + email,
        type: "delete",
        success: function(result) {
            alertify.success("The user was deleted successfully!")
            setTimeout(function() { window.location = "/admin/manageStaff" }, 1500);
        },
        error: function(e) {
            alertify.error(e.responseText);
        }
    })
}

function deleteSession(element) {
    var sessionName = element.parentElement.parentElement.children[0].innerText
    console.log(sessionName)
    $.ajax({
        url: "/admin/manageSessions/delete/" + sessionName.replace(" ", "*"),
        type: "delete",
        success: function(result) {
            alertify.success("The user was deleted successfully!")
            setTimeout(function() { window.location = "/admin/manageSessions" }, 1500);
        },
        error: function(e) {
            alertify.error(e.status);
        }
    })
}

function deleteStudent(element) {
    var studentMatricNumber = element.parentElement.parentElement.children[1].innerText

    $.ajax({
        url: "/admin/manageStudents/delete/" + studentMatricNumber,
        type: "delete",
        success: function(result) {
            alertify.success("The student was deleted successfully!")
            setTimeout(function() { window.location = "/admin/manageStudents" }, 1500);
        },
        error: function(e) {
            alertify.error(e.status);
        }
    })
}

async function uploadPhoto(element) {
    //clear file content
    document.getElementById("photo1").value = "";
    document.getElementById("photo2").value = "";
    document.getElementById("photo3").value = "";

    document.getElementById("photoLabel1").innerText = "Upload photo 1";
    document.getElementById("photoLabel2").innerText = "Upload photo 2";
    document.getElementById("photoLabel3").innerText = "Upload photo 3";

    // show modal
    var studentMatricNumber = element.parentElement.parentElement.children[1].innerText
    $('#uploadForm').attr('action', "/manageStudents/uploadPhoto/" + studentMatricNumber)
    $('#uploadModal').modal()
}

function selectSession() {
    $('#sessionChoiceModal').modal()
}

function editAttendance() {
    $('#editAttendanceModal').modal()
}

function checkAddStaff() {
    var elementToCheck = [
        document.getElementById("staffEmailInput"),
        document.getElementById("staffDisplayName")
    ]

    for (var i = 0; i < elementToCheck.length; i++) {
        if (elementToCheck[i].value == "") {
            elementToCheck[i].focus()
            alertify.warning("Invalid input")
            return false
        }
    }

    return true
}

function checkAddStudent() {
    var elementToCheck = [
        document.getElementById("nameInput"),
        document.getElementById("matricNumberInput"),
        document.getElementById("emailInput")
    ]

    for (var i = 0; i < elementToCheck.length; i++) {
        if (elementToCheck[i].value == "") {
            elementToCheck[i].focus()
            alertify.warning("Invalid input")
            return false
        }
    }

    return true
}

function checkAddPhotos() {
    var elementToCheck = [
        document.getElementById("photo1"),
        document.getElementById("photo1"),
        document.getElementById("photo1")
    ]

    for (var i = 0; i < elementToCheck.length; i++) {
        if (elementToCheck[i].files.length == 0) {
            elementToCheck[i].focus()
            alertify.warning("Please upload all 3 photos")
            return false
        }
    }

    return true
}

function checkAddSession() {
    var elementToCheck = [
        document.getElementById("sessionNameInput"),
        document.getElementById("emailInput"),
        document.getElementById("numOfSessionInput")
    ]

    for (var i = 0; i < elementToCheck.length; i++) {
        if (elementToCheck[i].value == "") {
            elementToCheck[i].focus()
            alertify.warning("Invalid input")
            return false
        }
    }

    return true
}

function checkAssignStudent() {
    var elementToCheck = [
        document.getElementById("sessionChoice"),
        document.getElementById("customFile"),
    ]


    if (elementToCheck[0].value == "") {
        elementToCheck[0].focus()
        alertify.warning("Invalid input")
        return false
    }

    if (elementToCheck[1].files.length == 0) {
        elementToCheck[1].focus()
        alertify.warning("Please upload a csv file")
        return false
    }

    return true
}