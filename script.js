document.addEventListener('DOMContentLoaded', function() {
  fetch('https://api.thingspeak.com/channels/2447664/feeds.json?api_key=YGABPVZSCX5NJB3A')
    .then(response => response.json())
    .then(data => {
      const temperatureData = data.feeds.map(feed => parseFloat(feed.field1));
      const timeLabels = data.feeds.map(feed => feed.created_at);
      
      const ctx = document.getElementById('temperatureChart').getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: timeLabels,
          datasets: [{
            label: 'Температура в городе Бердске',
            data: temperatureData,
            borderColor: 'blue',
            backgroundColor: 'lightblue',
            fill: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          maintainAspectRatio: true, // Установка для сохранения квадратного соотношения сторон
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                unit: 'hour'
              },
              distribution: 'linear'
            }],
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Temperature (°C)'
              }
            }]
          }
        }
      });
    })
    .catch(error => console.error('Error fetching data:', error));
});
