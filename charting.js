require(['js/Chartjs']), function(Chart) {
  var Chartjs = Chart.noConflict();
};

var context = document.getElementById("mainChart").getContext("2d");
var chart = new Chart(context).PolarArea(42);
