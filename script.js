// script.js
// Глобальная переменная для хранения URL по умолчанию
let defaultUrl = 'https://api.thingspeak.com/channels/2447664/feeds.json?api_key=YGABPVZSCX5NJB3A';
let chart; // Добавляем переменную для хранения объекта Chart
document.addEventListener('DOMContentLoaded', function() {
    // Функция для загрузки данных и построения графика
    function fetchDataAndDrawChart(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const temperatureData = data.feeds.map(feed => parseFloat(feed.field1));
                const timeLabels = data.feeds.map(feed => {
                    const date = new Date(feed.created_at);
                    date.setHours(date.getHours());
                    return date.toLocaleString('ru-RU', { hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'numeric' });
                });
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
                                    stepSize: 100,
                                    tooltipFormat: 'HH:mm, DD.MM.YYYY',
                                    displayFormats: {
                                        hour: 'HH',
                                        day: 'DD.MM'
                                    }
                                },
                                ticks: {
                                    maxRotation: 0,
                                    autoSkip: false,
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
                    ${url.includes('days=1') ? `<p>Суточный ход температуры воздуха: ${dailyTemperatureRange.toFixed(2)}°C </p>` : ''}
                    <p>Средняя температура воздуха: ${averageTemperature.toFixed(2)}°C</p>
                `;
                function getTimestampOfTemperature(temperature, data) {
                    const index = data.feeds.findIndex(feed => parseFloat(feed.field1) === temperature);
                   if (index !== -1) {
                        const timestamp = new Date(data.feeds[index].created_at);
                        return timestamp.toLocaleString('ru-RU');
                    }
                    return 'неизвестно';
                }              
            })
            .catch(error => console.error('Ошибка при получении данных:', error));
    }
    // Обработчик кнопки "За день"
    document.getElementById('btnDay').addEventListener('click', function() {
        const today = new Date();
    today.setHours(0, 0, 0, 0); // Устанавливаем время на начало текущего дня
    const startOfDay = today.toISOString(); // Получаем строку с датой начала текущего дня в формате ISO
    const url = `https://api.thingspeak.com/channels/2447664/feeds.json?api_key=YGABPVZSCX5NJB3A&start=${startOfDay}`;
        const url = 'https://api.thingspeak.com/channels/2447664/feeds.json?api_key=YGABPVZSCX5NJB3A&days=1';
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
});
