function buildChart(purchases) {
  var canvas = $('.chart').get(0).getContext('2d');
  var chartData = [];
  var purchaseMap = buildPurchasesMapFromSpending(purchases);
  //chartData object determined by pie chart from Chart.js
  purchaseMap.forEach(function(value, key, map) {
    chartData.push({
      value: parseFloat(value).toFixed(2),
      color: randomColor(),
      highlight: '#FF5A5E',
      label: key
    });
  });
  return new Chart(canvas).Pie(chartData);
}

//Expect spending to be array of: 
// {
//   cost: number,
//   location: string,
//   category: string,
//   date: string
// }
//Creates map of category and total spending from category
function buildPurchasesMapFromSpending(spending) {
  var uniquePurchases = new Map();
  spending.forEach(function(value, index, array) {
    if (uniquePurchases.has(value.category)) {
      var oldValue = parseFloat(uniquePurchases.get(value.category));
      var newValue = oldValue + parseFloat(value.cost);
      uniquePurchases.set(value.category, newValue);
    } else {
      uniquePurchases.set(value.category, value.cost);
    }
  });
  return uniquePurchases;
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
