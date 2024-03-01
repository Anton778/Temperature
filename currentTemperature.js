// currentTemperature.js

// Получаем данные о последней температуре и отображаем их на странице
function showCurrentTemperature() {
  fetch('https://api.thingspeak.com/channels/2447664/feeds.json?api_key=YGABPVZSCX5NJB3A&results=1')
    .then(response => response.json())
    .then(data => {
      const currentTemperature = parseFloat(data.feeds[0].field1);
      const temperatureElement = document.getElementById('currentTemperature');
      temperatureElement.textContent = 'Текущая температура: ' + currentTemperature + ' °C';
    })
    .catch(error => console.error('Ошибка при получении данных о текущей температуре:', error));
}

// Вызываем функцию для отображения текущей температуры
showCurrentTemperature();
