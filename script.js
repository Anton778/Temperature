// Глобальные переменные
let chart; // Переменная для хранения объекта Chart

// Данные о температуре и времени
const temperatureData = [4, 5, 1, 8]; // Замените данными о температуре из вашего набора данных
const timeLabels = [1, 3, 6, 9]; // Замените данными о времени из вашего набора данных

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
                    type: 'linear',
                    ticks: {
                        min: 0,
                        max: 10,
                        stepSize: 2
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Время (часы)'
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
