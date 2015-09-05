window.onload = function() {
  var canvas = $("#mainChart").get(0);
  var context = canvas.getContext("2d");

  console.log("This is a test of the console");
  console.log(user);
  buildChart(null, context);
}

function buildChart(transactions, context) {
  // var chartData = [];
  // for (var i = 0; i < transactions.length; i++) {
  //
  // }
  // return new Chart(context).Pie(chartData);
  var chartData = [
  {
      value: 10,
      color:"#F7464A",
      highlight: "#FF5A5E",
      label: "Rent"
  },
  {
      value: 20,
      color: "#46BFBD",
      highlight: "#5AD3D1",
      label: "Entertainment"
  },
  {
      value: 30,
      color: "#FDB45C",
      highlight: "#FFC870",
      label: "Food"
  }
  ];
  return new Chart(context).Pie(chartData);
}
