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
            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: timeLabels,
                    datasets: [{
                        label: 'Температура в городе Бердске',
                        data: temperatureData,
                        borderColor: 'black',
                        backgroundColor: 'lightblue',
                        fill: false,
                        pointRadius: '2%' // Задаем размер точки
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

            // Находим минимальную и максимальную температуры
            const maxTemperature = Math.max(...temperatureData);
            const minTemperature = Math.min(...temperatureData);

            // Функция для выделения минимальной и максимальной температур на графике
            function highlightMinMaxTemperature(currentTemperature, maxTemperature, minTemperature) {
                const dataset = chart.data.datasets[0];
                const data = dataset.data;
                const backgroundColors = Array(data.length).fill('lightblue');

                // Находим индексы минимальной и максимальной температур в массиве данных
                const maxTemperatureIndex = data.findIndex(temp => temp === maxTemperature);
                const minTemperatureIndex = data.findIndex(temp => temp === minTemperature);

                // Задаем красный цвет для максимальной температуры и синий для минимальной
                if (maxTemperatureIndex !== -1) {
                    backgroundColors[maxTemperatureIndex] = 'red';
                }
                if (minTemperatureIndex !== -1) {
                    backgroundColors[minTemperatureIndex] = 'blue';
                }

                // Обновляем цвета фона для точек графика
                dataset.backgroundColor = backgroundColors;

                // Обновляем график
                chart.update();
            }

            // Вызываем функцию для выделения минимальной и максимальной температуры
            const currentTemperature = temperatureData[temperatureData.length - 1]; // Последнее значение температуры
            highlightMinMaxTemperature(currentTemperature, maxTemperature, minTemperature);
        })
        .catch(error => console.error('Ошибка при получении данных:', error));
});
