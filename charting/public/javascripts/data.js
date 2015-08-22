window.onload = function() {
  var canvas = window.document.getElementById("mainChart");
  var context = canvas.getContext("2d");
  context.rect(20,20,150,100);
  context.fillStyle = "red";
  context.fill();
}
