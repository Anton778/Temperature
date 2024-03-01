document.addEventListener('DOMContentLoaded', function() {
  fetch('https://api.thingspeak.com/channels/2447664/feeds.json?api_key=YGABPVZSCX5NJB3A')
    .then(response => response.json())
    .then(data => {
      const temperatureData = data.feeds.map(feed => parseFloat(feed.field1));
      const timeLabels = data.feeds.map(feed => {
        const date = new Date(feed.created_at);
        date.setHours(date.getHours());
        return date.toLocaleString('ru-RU', { hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'numeric' });
      });
      
      const ctx = document.getElementById('temperatureChart').getContext('2d');
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: timeLabels,
          datasets: [{
            label: 'Температура в городе Бердске',
            data: temperatureData,
            borderColor: 'blue',
            backgroundColor: 'lightblue',
            fill: false,
            pointBackgroundColor: temperatureData.map(temp => 'lightblue') // Устанавливаем цвета всех точек по умолчанию
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                unit: 'minute',
                stepSize: 5,
                tooltipFormat: 'HH:mm, DD.MM.YYYY',
                displayFormats: {
                  hour: 'HH',
                  day: 'DD.MM'
                }
              },
              ticks: {
                maxRotation: 0,
                autoSkip: true,
                maxTicksLimit: 10
              }
            }],
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Температура (°C)'
              }
            }]
          }
        }
      });

      // Находим максимальную и минимальную температуры
      const maxTemperature = Math.max(...temperatureData);
      const minTemperature = Math.min(...temperatureData);

      // Выделяем максимальную температуру красным цветом
      const maxIndex = temperatureData.indexOf(maxTemperature);
      chart.data.datasets[0].pointBackgroundColor[maxIndex] = 'red';

      // Выделяем минимальную температуру синим цветом
      const minIndex = temperatureData.indexOf(minTemperature);
      chart.data.datasets[0].pointBackgroundColor[minIndex] = 'blue';

      // Обновляем график
      chart.update();
    })
    .catch(error => console.error('Ошибка при получении данных:', error));
});
