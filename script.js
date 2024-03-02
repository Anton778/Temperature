document.addEventListener('DOMContentLoaded', function() {
    // Функция для загрузки данных и построения графика
    function fetchDataAndDrawChart(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const temperatureData = data.feeds.map(feed => parseFloat(feed.field1));
                const recordNumbers = data.feeds.map((_, index) => index + 1); // Массив порядковых номеров записей

                const ctx = document.getElementById('temperatureChart').getContext('2d');
                const chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: recordNumbers, // Используем порядковые номера записей в качестве меток на оси X
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
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Порядковый номер записи'
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
            })
            .catch(error => console.error('Ошибка при получении данных:', error));
    }

    // Обработчик кнопки "За день"
    document.getElementById('btnDay').addEventListener('click', function() {
        const url = 'https://api.thingspeak.com/channels/2447664/feeds.json?api_key=YGABPVZSCX5NJB3A&days=1';
        fetchDataAndDrawChart(url);
    });

    // Обработчик кнопки "За все время"
    document.getElementById('btnAllTime').addEventListener('click', function() {
        fetchDataAndDrawChart(defaultUrl);
    });

    // Загружаем график по умолчанию при загрузке страницы
    fetchDataAndDrawChart(defaultUrl);
});
