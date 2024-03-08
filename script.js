// Глобальные переменные
let chart; // Переменная для хранения объекта Chart

// Данные о температуре и времени
const temperatureData = [4, 5]; // Замените данными о температуре из вашего набора данных
const timeLabels = ['8:33', '9:45']; // Замените данными о времени из вашего набора данных

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
                        },
                        min: '00:00', // Установка начального времени на 00:00
                        max: '23:00', // Установка конечного времени на 23:00
                    },
                    ticks: {
                        stepSize: 1 // Шаг оси в 1 час
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

// Загружаем график при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    drawChart(timeLabels, temperatureData);
});
