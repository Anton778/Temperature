// script.js

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
                    maintainAspectRatio: true,
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

            // Вызываем функции для поиска и выделения минимальной и максимальной температуры
            const { maxTemperature, minTemperature } = findMinMaxTemperature(temperatureData);
            const currentTemperature = temperatureData[temperatureData.length - 1]; // Последнее значение температуры
            highlightMinMaxTemperature(currentTemperature, maxTemperature, minTemperature);
        })
        .catch(error => console.error('Ошибка при получении данных:', error));
});
