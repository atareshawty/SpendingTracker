window.onload = function() {
  var canvas = $(".chart").get(0);
  var context = canvas.getContext("2d");
  var transactions = getTransactions();
  buildChart(transactions, context);
}

/**
  Gets builds pie chart from transactions array and html canvas contect
  @param transactions - map of key (category) , value (dollar value) to go into chart
  @param context - context of html canvas element
*/
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

/**
  Gets element(s) on page with class name {@elementClass}
  @param elementClass - identifier of element
  @return array of elements found
*/
function getElementsByClass(elementClass) {
  var classToFind = '.' + elementClass;
  var elementsFound = [];
  $(classToFind).each(function() {
    elementsFound.push($(this).text());
  });
  return elementsFound;
}

/**
  Complies together all user transactions into map and returns
  @return map of key (category) and value (dollar value) for each transaction on page
*/
function getTransactions() {
  var costs = [], categories = [];
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

/**
  @return random color based on hexadecimal value (string)
*/
function randomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
