// Code block for the bar chart of top 10 rating and review count
// Load the JSON file
$.getJSON('top100_books_2022.json', function(data) {
    console.log(data);

    // Set up the chart options
    var options = {
      chart: {
        renderTo: 'chart-container',
        type: 'column'
      },
      title: {},
      xAxis: {},
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
  
      // Update the chart categories and data.  Sorts the values from highest to lowest.
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

// Code block for selecting the book
// Load the JSON file
d3.json('top100_books_2022.json').then(function(data) {
  // Sort the data by title in alphabetical order
  data.sort(function(a, b) {
      var titleA = a.title.toUpperCase(); // ignore upper and lowercase
      var titleB = b.title.toUpperCase(); // ignore upper and lowercase
      if (titleA < titleB) {
          return -1;
      }
      if (titleA > titleB) {
          return 1;
      }
      // titles must be equal
      return 0;
  });

  // Populate the dropdown menu with the titles
  var dropdown = d3.select('#book-select');
  dropdown.append('option').text('Select a book...');
  data.forEach(function(d) {
      dropdown.append('option').text(d.title);
  });

  // Get the first book from the sorted data
  var firstBook = data[0];
  console.log(firstBook);

  // Update the HTML with the first book's image, author, publish date, and prices
  d3.select('#book-image').attr('src', firstBook.image);
  d3.select('#book-author').text(firstBook.author);
  d3.select('#book-publish-date').text(firstBook.publish_date);
  d3.select('#kindle-price').text(firstBook.prices.Kindle);
  d3.select('#audiobook-price').text(firstBook.prices.Audiobook);
  d3.select('#hardcover-price').text(firstBook.prices.Hardcover);
  d3.select('#paperback-price').text(firstBook.prices.Paperback);



  // Display the book information when a title is selected
  // dropdown.on('change', function() {
  //     var selectedTitle = this.value;
  //     var selectedBook = data.find(function(d) {
  //         return d.title === selectedTitle;
  //     });

  //     // Update the HTML with the selected book's image, author, publish date, and prices
  //     d3.select('#book-image').attr('src', selectedBook.image);
  //     d3.select('#book-author').text(selectedBook.author);
  //     d3.select('#book-publish-date').text(selectedBook.publish_date);
  //     d3.select('#kindle-price').text(selectedBook.prices.Kindle);
  //     d3.select('#audiobook-price').text(selectedBook.prices.Audiobook);
  //     d3.select('#hardcover-price').text(selectedBook.prices.Hardcover);
  //     d3.select('#paperback-price').text(selectedBook.prices.Paperback);
  // });
});

d3.json('top100_books_2022.json').then(function(data) {
  var dropdown = d3.select('#book-select');
  dropdown.on('change', function() {
    var selectedTitle = this.value;
    var selectedBook = data.find(function(d) {
        return d.title === selectedTitle;
    });
    console.log(selectedBook)

    d3.select('#book-image').attr('src', selectedBook.image);
    d3.select('#book-author').text(selectedBook.author);
    d3.select('#book-publish-date').text(selectedBook.publish_date);
    d3.select('#kindle-price').text(selectedBook.prices.Kindle);
    d3.select('#audiobook-price').text(selectedBook.prices.Audiobook);
    d3.select('#hardcover-price').text(selectedBook.prices.Hardcover);
    d3.select('#paperback-price').text(selectedBook.prices.Paperback);

    // join all the reviews together to create one blob of text
    book_reviews = selectedBook.reviews.join(' '); 

    // getting rid of all the punctuation characters
    var lines = book_reviews.split(/[,\. ]+/g); 

    var stopwords = new Set (['i','me','my','myself','we','our','ours','ourselves','you','your','yours','yourself','yourselves','he','him','his','himself','she','her','hers','herself','it','its','itself','they','them','their','theirs','themselves','what','which','who','whom','this','that','these','those','am','is','are','was','were','be','been','being','have','has','had','having','do','does','did','doing','a','an','the','and','but','if','or','because','as','until','while','of','at','by','for','with','about','against','between','into','through','during','before','after','above','below','to','from','up','down','in','out','on','off','over','under','again','further','then','once','here','there','when','where','why','how','all','any','both','each','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','s','t','can','will','just','don','should','now']);
    var excluded = lines.filter(word => !stopwords.has(word.toLowerCase()));
    var clean_data = Highcharts.reduce(excluded, function(arr, word) {
      var obj = Highcharts.find(arr, function (obj) {
        return obj.name === word;
      });
      if (obj) {
        obj.weight += 1;
      } else {
        arr.push({
          name: word,
          weight: 1
        });
      }
      return arr;
    }, []);

    // Update the wordcloud
    Highcharts.chart('wordcloud', {
      series: [{
        type: 'wordcloud',
        data: clean_data,
        name: 'Occurences'
      }], 
      title: {
        text: 'Wordcloud of ' + selectedTitle
      }
    });
  });
});
