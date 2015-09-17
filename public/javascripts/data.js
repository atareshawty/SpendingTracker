//A transaction will be represented as a map of category/cost (string, number) pair!!
window.onload = function() {
  var canvas = $(".chart").get(0);
  var context = canvas.getContext("2d");
  var transactions = getTransactions();
  buildChart(transactions, context);
}

function getElementsByClass(elementClass) {
  var classToFind = '.' + elementClass;
  var elementsFound = [];
  $(classToFind).each(function() {
    elementsFound.push($(this).text());
  });
  return elementsFound;
}

function getTransactions() {
  var costs = [], categories = [], locations = [];
  var transactionMap = new Map();
  costs = getElementsByClass('cost');
  categories = getElementsByClass('category');

  for (var i = 0; i < costs.length; i++) {
    if (transactionMap.has(categories[i])) {
      var oldCost = transactionMap.get(categories[i]);
      var newCost = costs[i];
      newCost = newCost.substring(1, newCost.length);
      transactionMap.set(categories[i], oldCost + parseFloat(newCost));
    } else {
      var cost = costs[i];
      cost = cost.substring(1, cost.length);
      transactionMap.set(categories[i], parseFloat(cost));
    }
  }
  return transactionMap;
}

function buildChart(transactions, context) {
  var chartData = [];
  transactions.forEach(function(value, key, map) {
    dataPoint = {
      value: value,
      color: randomColor(),
      highlight: "#FF5A5E",
      label: key
    }
    chartData.push(dataPoint);
  })

  return new Chart(context).Pie(chartData);
}

function randomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
