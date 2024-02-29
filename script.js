document.addEventListener('DOMContentLoaded', function() {
  fetch('https://api.thingspeak.com/channels/2447664/feeds.json?api_key=YGABPVZSCX5NJB3A')
    .then(response => response.json())
    .then(data => {
      const temperatureData = data.feeds.map(feed => parseFloat(feed.field1));
      const timeLabels = data.feeds.map(feed => {
        const date = new Date(feed.created_at);
        date.setHours(date.getHours());
        return date;
      });

      const timeDifferences = [];
      for (let i = 1; i < timeLabels.length; i++) {
        const timeDifference = timeLabels[i] - timeLabels[i - 1]; // Вычисляем временную разницу между соседними записями
        timeDifferences.push(timeDifference);
      }

      let unit = 'day';
      let stepSize = 1;
      if (timeDifferences.length > 0) {
        const minDifference = Math.min(...timeDifferences); // Находим минимальную временную разницу
        if (minDifference < 86400000) { // Если минимальная разница меньше одного дня (в миллисекундах)
          unit = 'hour';
          stepSize = minDifference / 3600000; // Преобразуем миллисекунды в часы
        }
      }

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
                unit: unit, // Устанавливаем шаг времени
                stepSize: stepSize, // Шаг времени
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
