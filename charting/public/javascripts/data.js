window.onload = function() {
  var canvas = $("#mainChart").get(0);
  var context = canvas.getContext("2d");

  var chartData = [];

  $.get('/data', { name: 'test'}, function(data) {
    buildChart(data, context);
  });
}

function buildChart(data, context) {
  var chartData = [
    {
        value: data[0].cost,
        color:"#F7464A",
        highlight: "#FF5A5E",
        label: "Rent"
    },
    {
        value: data[1].cost,
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Entertainment"
    },
    {
        value: data[2].cost,
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Food"
    }
  ];
  var chart = new Chart(context).Pie(chartData);
}
