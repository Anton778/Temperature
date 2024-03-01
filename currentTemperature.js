// currentTemperature.js

// Получаем данные о последней температуре и отображаем их на странице
function showCurrentTemperature() {
  fetch('https://api.thingspeak.com/channels/2447664/feeds.json?api_key=YGABPVZSCX5NJB3A&results=1')
    .then(response => response.json())
    .then(data => {
      const currentTemperature = parseFloat(data.feeds[0].field1);
      const temperatureElement = document.getElementById('currentTemperature');
      temperatureElement.textContent = 'Текущая температура: ' + currentTemperature + ' °C';

      // Находим максимальную температуру
      const temperatureData = data.feeds.map(feed => parseFloat(feed.field1));
      const maxTemperature = Math.max(...temperatureData);
      const maxTemperatureElement = document.createElement('p');
      maxTemperatureElement.textContent = `Максимальная температура: ${maxTemperature} °C`;
      maxTemperatureElement.style.color = 'red'; // Красный цвет для максимальной температуры
      temperatureElement.parentNode.appendChild(maxTemperatureElement);

      // Находим минимальную температуру
      const minTemperature = Math.min(...temperatureData);
      const minTemperatureElement = document.createElement('p');
      minTemperatureElement.textContent = `Минимальная температура: ${minTemperature} °C`;
      minTemperatureElement.style.color = 'blue'; // Синий цвет для минимальной температуры
      temperatureElement.parentNode.appendChild(minTemperatureElement);
    })
    .catch(error => console.error('Ошибка при получении данных о текущей температуре:', error));
}

// Вызываем функцию для отображения текущей температуры
showCurrentTemperature();
