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