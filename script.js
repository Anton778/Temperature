// Глобальные переменные
let defaultUrl = 'https://api.thingspeak.com/channels/2447664/feeds.json?api_key=YGABPVZSCX5NJB3A';
let chart; // Переменная для хранения объекта Chart

// Функция для загрузки данных и построения графика
function fetchDataAndDrawChart(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Создаем массив временных меток с интервалом в 1 час от 00:00 до 23:59
            const timeLabels = [];
            for (let hour = 0; hour < 24; hour++) {
                const time = hour.toString().padStart(2, '0') + ':00'; // Форматируем часы
                timeLabels.push(time);
            }

            // Создаем массив данных температуры
            const temperatureData = [];
            for (const time of timeLabels) {
                // Поиск температуры для данного времени
                const temperature = findTemperatureForTime(time, data.feeds);
                temperatureData.push(temperature);
            }

            // Отображаем график с скорректированными данными
            drawChart(timeLabels, temperatureData, data);
        })
        .catch(error => console.error('Ошибка при получении данных:', error));
}

// Функция поиска температуры для заданного времени
function findTemperatureForTime(time, feeds) {
    // Проходим по всем данным и ищем температуру для заданного времени
    for (const feed of feeds) {
        const feedTime = new Date(feed.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        if (feedTime === time) {
            return parseFloat(feed.field1); // Возвращаем температуру для найденного времени
        }
    }
    return null; // Если данных нет для заданного времени, возвращаем null
}

// Функция для отображения графика
function drawChart(timeLabels, temperatureData, data) {
    const ctx = document.getElementById('temperatureChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [{
                label: 'Температура в городе Бердске',
                data: temperatureData,
                borderColor: 'black',
                backgroundColor: 'lightblue',
                fill: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'hour',
                        tooltipFormat: 'HH:mm',
                        displayFormats: {
                            hour: 'HH:mm'
                        }
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

    const maxTemperature = Math.max(...temperatureData);
    const minTemperature = Math.min(...temperatureData);
    const currentTemperature = temperatureData[temperatureData.length - 1];
    const dailyTemperatureRange = maxTemperature - minTemperature;
    const averageTemperature = temperatureData.reduce((sum, temp) => sum + temp, 0) / temperatureData.length;

    function highlightMinMaxTemperature(currentTemperature, maxTemperature, minTemperature) {
        const dataset = chart.data.datasets[0];
        const data = dataset.data;
        const backgroundColors = Array(data.length).fill('lightblue');
        const maxTemperatureIndex = data.findIndex(temp => temp === maxTemperature);
        const minTemperatureIndex = data.findIndex(temp => temp === minTemperature);
        if (maxTemperatureIndex !== -1) {
            backgroundColors[maxTemperatureIndex] = 'red';
        }
        if (minTemperatureIndex !== -1) {
            backgroundColors[minTemperatureIndex] = 'blue';
        }
        dataset.backgroundColor = backgroundColors;
        chart.update();
    }

    highlightMinMaxTemperature(currentTemperature, maxTemperature, minTemperature);

    const minMaxTemperaturesElement = document.getElementById('minMaxTemperatures');
    minMaxTemperaturesElement.innerHTML = `
        <p>Текущая температура: ${currentTemperature}°C</p>
        <p>Максимальная температура: ${maxTemperature}°C была зафиксирована ${getTimestampOfTemperature(maxTemperature, data)}</p>
        <p>Минимальная температура: ${minTemperature}°C была зафиксирована ${getTimestampOfTemperature(minTemperature, data)}</p>
        <p>Суточный ход температуры воздуха: ${dailyTemperatureRange.toFixed(2)}°C</p>
        <p>Средняя температура воздуха: ${averageTemperature.toFixed(2)}°C</p>
    `;
}

// Функция для получения временной метки температуры
function getTimestampOfTemperature(temperature, data) {
    const index = data.feeds.findIndex(feed => parseFloat(feed.field1) === temperature);
    if (index !== -1) {
        const timestamp = new Date(data.feeds[index].created_at);
        return timestamp.toLocaleString('ru-RU');
    }
    return 'неизвестно';
}

// Обработчик кнопки "За день"
document.getElementById('btnDay').addEventListener('click', function() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Устанавливаем время на начало текущего дня
    const startOfDay = today.toISOString(); // Получаем строку с датой начала текущего дня в формате ISO
    const url = `https://api.thingspeak.com/channels/2447664/feeds.json?api_key=YGABPVZSCX5NJB3A&start=${startOfDay}`;
    if (chart) {
        chart.destroy();
    }
    fetchDataAndDrawChart(url);
});

// Обработчик кнопки "За все время"
document.getElementById('btnAllTime').addEventListener('click', function() {
    if (chart) {
        chart.destroy();
    }
    fetchDataAndDrawChart(defaultUrl);
});

// Загружаем график по умолчанию при загрузке страницы
fetchDataAndDrawChart(defaultUrl);
