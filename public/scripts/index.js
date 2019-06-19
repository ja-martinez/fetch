window.onload = function() {
  document.getElementById("inputPassword").onchange = validatePassword;
  document.getElementById("inputConfirmPassword").onchange = validatePassword;
};
function validatePassword() {
  var pass2 = document.getElementById("inputConfirmPassword").value;
  var pass1 = document.getElementById("inputPassword").value;
  if (pass1 != pass2)
    document
      .getElementById("inputConfirmPassword")
      .setCustomValidity("Passwords Don't Match");
  else document.getElementById("inputConfirmPassword").setCustomValidity("");
}
