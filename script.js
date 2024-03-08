document.addEventListener('DOMContentLoaded', function() {
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
                drawChart(timeLabels, temperatureData);

                // Вычисляем минимальную, максимальную и среднюю температуры
                const maxTemperature = Math.max(...temperatureData);
                const minTemperature = Math.min(...temperatureData);
                const averageTemperature = temperatureData.reduce((sum, temp) => sum + temp, 0) / temperatureData.length;

                // Выводим информацию о температурах
                const temperaturesInfoElement = document.getElementById('temperaturesInfo');
                temperaturesInfoElement.innerHTML = `
                    <p>Максимальная температура: ${maxTemperature}°C</p>
                    <p>Минимальная температура: ${minTemperature}°C</p>
                    <p>Средняя температура: ${averageTemperature.toFixed(2)}°C</p>
                `;
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
                            parser: 'HH:mm',
                            unit: 'hour',
                            unitStepSize: 1,
                            displayFormats: {
                                hour: 'HH:mm'
                            },
                            min: '00:00', // Начало графика с 00:00
                            max: '23:59', // Окончание графика с 23:59
                            tooltipFormat: 'HH:mm'
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
});
