function validateForm() {
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    if (password != confirmPassword) {
        document.getElementById("error-message").innerHTML = "Password does not match";
        document.getElementById("confirmPassword").style.background = "rgba(242,38,19, .4)";
        document.getElementById("confirmPassword").focus();
        
        return false;
    } 

    return true;
}