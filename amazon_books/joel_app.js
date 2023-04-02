fetch('top_100_books.json')
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

  function getTop5Books(option, data) {
    let books = [];
  
    switch (option) {
      case 'rating':
        books = data.sort((a, b) => b.rating - a.rating).slice(0, 5);
        break;
      case 'review_count':
        books = data.sort((a, b) => b.review_count - a.review_count).slice(0, 5);
        break;
      case 'kindle_highest':
        books = data.sort((a, b) => {
          const aPrice = parseFloat(a.prices.Kindle.replace('$', ''));
          const bPrice = parseFloat(b.prices.Kindle.replace('$', ''));
          return bPrice - aPrice;
        }).slice(0, 5);
        break;
      case 'kindle_lowest':
        books = data.sort((a, b) => {
          const aPrice = parseFloat(a.prices.Kindle.replace('$', ''));
          const bPrice = parseFloat(b.prices.Kindle.replace('$', ''));
          return aPrice - bPrice;
        }).slice(0, 5);
        break;
      case 'hardcover_highest':
        books = data.sort((a, b) => {
          const aPrice = parseFloat(a.prices.Hardcover.replace('$', ''));
          const bPrice = parseFloat(b.prices.Hardcover.replace('$', ''));
          return bPrice - aPrice;
        }).slice(0, 5);
        break;
      case 'hardcover_lowest':
        books = data.sort((a, b) => {
          const aPrice = parseFloat(a.prices.Hardcover.replace('$', ''));
          const bPrice = parseFloat(b.prices.Hardcover.replace('$', ''));
          return aPrice - bPrice;
        }).slice(0, 5);
        break;
    }
  
    return books;
  }

  function renderChart(option) {
    // Filter the top 5 data based on the selected option
    let filteredData;
    switch (option) {
      case "top5rating":
        filteredData = data.sort((a, b) => b.rating - a.rating).slice(0, 5);
        break;
      case "top5reviewcount":
        filteredData = data.sort((a, b) => b.review_count - a.review_count).slice(0, 5);
        break;
      case "top5highestkindle":
        filteredData = data.sort((a, b) => parseFloat(b.prices.Kindle.slice(1)) - parseFloat(a.prices.Kindle.slice(1))).slice(0, 5);
        break;
      case "top5lowestkindle":
        filteredData = data.sort((a, b) => parseFloat(a.prices.Kindle.slice(1)) - parseFloat(b.prices.Kindle.slice(1))).slice(0, 5);
        break;
      case "top5highesthardcover":
        filteredData = data.sort((a, b) => parseFloat(b.prices.Hardcover.slice(1)) - parseFloat(a.prices.Hardcover.slice(1))).slice(0, 5);
        break;
      case "top5lowesthardcover":
        filteredData = data.sort((a, b) => parseFloat(a.prices.Hardcover.slice(1)) - parseFloat(b.prices.Hardcover.slice(1))).slice(0, 5);
        break;
    }
  
    // Set the chart options based on the selected option and filtered data
    const chartOptions = {
      chart: {
        type: "column",
        height: 400,
      },
      title: {
        text: `Top 5 ${option.replace(/top5/g, "").replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase()}`
      },
      xAxis: {
        categories: filteredData.map(book => book.title),
        title: {
          text: "Title"
        }
      },
      yAxis: {
        title: {
          text: option.includes("rating") ? "Rating" : "Review Count"
        }
      },
      series: [{
        name: option.includes("rating") ? "Rating" : "Review Count",
        data: filteredData.map(book => parseFloat(book[option.includes("rating") ? "rating" : "review_count"].replace(/,/g, "")))
      }]
    };
  
    // Set the image source based on the first book in the filtered data
    const imageSrc = filteredData[0].image;
  
    // Render the chart and image
    Highcharts.chart("chart-container", chartOptions);
    document.getElementById("book-image").src = imageSrc;
  }
  