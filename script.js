<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>График температуры</title>
  <!-- Вставьте ссылки на библиотеку Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>

<div>
  <button onclick="showLastDay()">Последний день</button>
  <button onclick="showAllTime()">Всё время</button>
</div>

<canvas id="temperatureChart"></canvas>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    fetchData('https://api.thingspeak.com/channels/2447664/feeds.json?api_key=YGABPVZSCX5NJB3A');
  });

  function fetchData(url) {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.feeds.length === 0) {
          // Если данные отсутствуют, выводим сообщение
          document.getElementById('temperatureChart').innerText = 'Данные отсутствуют';
        } else {
          const temperatureData = data.feeds.map(feed => parseFloat(feed.field1));
          const timeLabels = data.feeds.map(feed => {
            const date = new Date(feed.created_at);
            date.setHours(date.getHours());
            return date.toLocaleString('ru-RU', { hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'numeric' });
          });
          drawChart(timeLabels, temperatureData);
        }
      })
      .catch(error => console.error('Ошибка при получении данных:', error));
  }

  function drawChart(labels, data) {
    const ctx = document.getElementById('temperatureChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Температура в городе Бердске',
          data: data,
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
  }

  function showLastDay() {
    // Здесь вы можете вызвать функцию для загрузки данных за последний день
    fetchData('https://api.thingspeak.com/channels/2447664/feeds.json?api_key=YGABPVZSCX5NJB3A&days=1');
  }

  function showAllTime() {
    // Здесь вы можете вызвать функцию для загрузки всех доступных данных
    fetchData('https://api.thingspeak.com/channels/2447664/feeds.json?api_key=YGABPVZSCX5NJB3A');
  }
</script>

</body>
</html>
