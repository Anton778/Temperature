// script.js
// Глобальная переменная для хранения URL по умолчанию
let defaultUrl = 'https://api.thingspeak.com/channels/2447664/feeds.json?api_key=YGABPVZSCX5NJB3A';
let chart; // Переменная для хранения объекта Chart

// Функция для загрузки данных и построения графика
function fetchDataAndDrawChart(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Создаем массив временных меток
            const timeLabels = data.feeds.map(feed => {
                const date = new Date(feed.created_at);
                return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            });

            // Создаем массив данных температуры
            const temperatureData = data.feeds.map(feed => parseFloat(feed.field1));

            // Отображаем график
            drawChart(timeLabels, temperatureData);
        })
        .catch(error => console.error('Ошибка при получении данных:', error));
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
                        unit: 'minute',
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
