requirejs(["Chartjs/Chartjs"]), function(Chart) {
  var Chartjs = Chart.noConflict();
};

var context = document.getElementById("mainChart").getContext("2d");
var chart = new Chartjs(context).PolarArea(42);
