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
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                unit: 'minute', // Устанавливаем шаг времени в минуты
                stepSize: 5, // Шаг в 5 минут
                tooltipFormat: 'HH:mm, DD.MM.YYYY', // Формат времени для всплывающей подсказки
                displayFormats: {
                  hour: 'HH', // Показываем только часы
                  day: 'DD.MM' // Показываем день и месяц
                }
              },
              ticks: {
                maxRotation: 0, // Отключаем поворот меток
                autoSkip: true, // Автоматически пропускаем метки, если их слишком много
                maxTicksLimit: 10 // Максимальное количество меток на оси
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
    })
    .catch(error => console.error('Ошибка при получении данных:', error));
});
