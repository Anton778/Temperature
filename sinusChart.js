// sinusChart.js

document.addEventListener('DOMContentLoaded', function() {
    // Создаем массив значений x от 0 до 2*pi с шагом 0.1
    const xValues = [];
    for (let x = 0; x <= Math.PI * 2; x += 0.1) {
        xValues.push(x);
    }

    // Создаем массив значений y, где y = sin(x)
    const yValues = xValues.map(x => Math.sin(x));

    // Получаем контекст canvas
    const ctx = document.getElementById('sinusChart').getContext('2d');

    // Создаем график синуса
    const sinusChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xValues, // Задаем значения x
            datasets: [{
                label: 'sin(x)', // Задаем название датасета
                data: yValues, // Задаем значения y
                borderColor: 'blue', // Задаем цвет линии
                backgroundColor: 'transparent', // Прозрачный фон
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'x' // Название оси x
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'sin(x)' // Название оси y
                    }
                }]
            }
        }
    });
});
