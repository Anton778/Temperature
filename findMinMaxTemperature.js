// findMinMaxTemperature.js

// Функция для поиска минимальной и максимальной температуры
function findMinMaxTemperature(temperatureData) {
    const maxTemperature = Math.max(...temperatureData);
    const minTemperature = Math.min(...temperatureData);
    return { maxTemperature, minTemperature };
}

// Функция для выделения максимальной температуры красным цветом, а минимальной - синим
function highlightMinMaxTemperature(currentTemperature, maxTemperature, minTemperature) {
    const temperatureElement = document.getElementById('currentTemperature');
    temperatureElement.textContent = 'Текущая температура: ' + currentTemperature + '°C';

    // Выделяем максимальную температуру красным цветом
    if (currentTemperature === maxTemperature) {
        temperatureElement.style.color = 'red';
    }

    // Выделяем минимальную температуру синим цветом
    if (currentTemperature === minTemperature) {
        temperatureElement.style.color = 'blue';
    }
}
