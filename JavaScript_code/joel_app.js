$(document).ready(function() {
  $.getJSON("top_100_books.json", function(data) {
      var chartData = [];
      $.each(data, function(index, value) {
          chartData.push({name: value.title, y: parseFloat(value.rating)});
      });
      Highcharts.chart('chart', {
          chart: {
              type: 'column'
          },
          title: {
              text: 'Top 100 Books'
          },
          xAxis: {
              type: 'category'
          },
          yAxis: {
              title: {
                  text: 'Rating'
              }
          },
          series: [{
              name: 'Rating',
              data: chartData
          }]
      });
  });
});
