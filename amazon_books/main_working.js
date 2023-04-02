// Load the JSON file
$.getJSON('top_100_books.json', function(data) {
    console.log(data);

    // Set up the chart options
    var options = {
      chart: {
        renderTo: 'chart-container',
        type: 'column'
      },
      title: {
        text: 'Top 5 Books'
      },
      xAxis: {
        categories: [],
        title: {
          text: 'Title'
        }
      },
      yAxis: {
        title: {
          text: 'Rating'
        }
      },
      series: [{
        name: 'Rating',
        data: []
      }]
    };
  
    // Handle chart type changes
    $('#chart-type').change(function() {
      var chartType = $(this).val();
      if (chartType === 'review_count') {
        options.yAxis.title.text = 'Review Count';
        options.series[0].name = 'Review Count';
      } else {
        options.yAxis.title.text = 'Rating';
        options.series[0].name = 'Rating';
      }
      renderChart(data, chartType, options);
    });
  
    // Render the chart
    function renderChart(data, chartType, options) {
      // Get the top 10 books by the selected chart type
      var sortedData = data.sort(function(a, b) {
        return parseFloat(b[chartType].replace(/,/g, '')) - parseFloat(a[chartType].replace(/,/g, ''));
      }).slice(0, 10);
  
      // Update the chart categories and data
      options.xAxis.categories = sortedData.map(function(item) {
        return item.title;
      });
      options.series[0].data = sortedData.map(function(item) {
        return parseFloat(item[chartType].replace(/,/g, ''));
      });
  
      // Set the chart title
      options.title.text = 'Top 10 Books by ' + chartType.replace('_', ' ');
  
      // Set the chart image
      var imageUrl = sortedData[0].image;
      $('#chart-container').css('background-image', 'url(' + imageUrl + ')');
  
      // Create the chart
      var chart = new Highcharts.Chart(options);
    }
  
    // Render the initial chart
    renderChart(data, 'rating', options);
  
  });
  