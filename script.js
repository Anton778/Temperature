document.addEventListener('DOMContentLoaded', function() {
  fetch('https://api.thingspeak.com/channels/2443987/feeds.json?api_key=
YIN2NQM8T3J3L438&results=10')
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
            label: 'Temperature',
            data: temperatureData,
            borderColor: 'blue',
            backgroundColor: 'lightblue',
            fill: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
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
