window.onload = function() {
  var canvas = document.getElementById("mainChart");
  var context = canvas.getContext("2d");
  context.rect(0,0,200,100);
  context.fillStyle = "green";
  context.fill();
}
