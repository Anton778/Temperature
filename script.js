// Глобальные переменные
let chart; // Переменная для хранения объекта Chart

// Функция для загрузки данных и построения графика
function fetchDataAndDrawChart() {
    // Определяем начало текущего дня
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfDay = today.toISOString();

    // URL для запроса данных за сутки
    const url = `https://api.thingspeak.com/channels/2447664/feeds.json?api_key=YGABPVZSCX5NJB3A&start=${startOfDay}`;

    // Запрос данных
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
            drawChart(timeLabels, temperatureData);
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
function drawChart(timeLabels, temperatureData) {
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
}

// Загружаем график за сутки при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    fetchDataAndDrawChart();
});
