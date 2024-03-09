// Глобальная переменная для хранения URL по умолчанию
let defaultUrl = 'https://api.thingspeak.com/channels/2447664/feeds.json?api_key=YGABPVZSCX5NJB3A';
let chart; // Переменная для хранения объекта Chart

document.addEventListener('DOMContentLoaded', function() {
    // Функция для загрузки данных и построения графика
    function fetchDataAndDrawChart(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const x = data.feeds.map(feed => {
                    const date = new Date(feed.created_at);
                    return date.toLocaleString('ru-RU', { hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'numeric' });
                });
                const y = data.feeds.map(feed => parseFloat(feed.field1));

                if (chart) {
                    chart.destroy();
                }

                // Вызываем функцию drawChart с новыми данными
                drawChart(x, y);
            })
            .catch(error => console.error('Ошибка при получении данных:', error));
    }

    // Функция для отображения графика
    function drawChart(x, y) {
        const ctx = document.getElementById('temperatureChart').getContext('2d');
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: x,
                datasets: [{
                    label: 'Температура в городе Бердске',
                    data: y,
                    borderColor: 'black',
                    backgroundColor: 'lightblue',
                    fill: false,
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: 'Время (часы)'
                        },
                        ticks: {
                            stepSize: 5
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Температура (°C)'
                        }
                    }
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
