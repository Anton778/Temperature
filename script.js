// Функция для отображения графика
        function drawChart(x, y) {
            const ctx = document.getElementById('temperatureChart').getContext('2d');
            const chart = new Chart(ctx, {
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

        // Функция для выполнения запроса к серверу и обновления графика
        async function updateChartWithServerData(url) {
            try {
                const response = await fetch(url); // Выполняем запрос к серверу
                const data = await response.json(); // Получаем данные JSON

                // Создаем массивы temperatureData и timeLabels
                const temperatureData = data.feeds.map(feed => parseFloat(feed.field1));
                const timeLabels = data.feeds.map(feed => {
    const date = new Date(feed.created_at);
    // Форматируем дату в часы и минуты
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    // Форматируем дату в день и месяц
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    // Собираем строку времени в формате "день.месяц час:минуты"
    return `${day}.${month} ${hours}:${minutes}`;
     });

                // Отображаем график
                drawChart(timeLabels, temperatureData);

            } catch (error) {
                console.error('Ошибка при получении данных с сервера:', error);
            }
        }

        // Загружаем график при загрузке страницы
        document.addEventListener('DOMContentLoaded', function() {
            updateChartWithServerData('https://api.thingspeak.com/channels/2447664/feeds.json?api_key=YGABPVZSCX5NJB3A'); // Получаем данные с сервера и обновляем график
        });
