// Глобальные переменные
        let chart; // Переменная для хранения объекта Chart

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

        // Функция для выполнения запроса к серверу и обновления графика
        async function updateChartWithServerData(url) {
            try {
                const response = await fetch(url); // Выполняем запрос к серверу
                const data = await response.json(); // Получаем данные JSON

                // Парсим данные и сохраняем x и y значения
                const x = [];
                const y = [];
                data.feeds.forEach(feed => {
                    x.push(feed.field1); // Предполагаем, что время находится в поле field1
                    y.push(feed.field2); // Предполагаем, что температура находится в поле field2
                });

                // Обновляем график с новыми данными
                chart.data.labels = x;
                chart.data.datasets[0].data = y;
                chart.update();

            } catch (error) {
                console.error('Ошибка при получении данных с сервера:', error);
            }
        }

        // Загружаем график при загрузке страницы
        document.addEventListener('DOMContentLoaded', function() {
            drawChart([], []); // Создаем пустой график
            updateChartWithServerData('https://api.thingspeak.com/channels/2447664/feeds.json?api_key=YGABPVZSCX5NJB3A'); // Получаем данные с сервера и обновляем график
        });
