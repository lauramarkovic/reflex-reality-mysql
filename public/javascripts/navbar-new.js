/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function myFunction() {
  var x = document.getElementById("myTopnav");
  var y = document.getElementById("navKontDiv");
  var z = document.getElementById("langButtonsDiv");
  if (x.className === "topnav", y.className === "navKont", z.className === "langButton") {
    x.className += " responsive";
    y.className += " responsive";
    z.className += " responsive";
  } else {
    x.className = "topnav";
    y.className = "navKont";
    z.className = "langButton"
  }
}