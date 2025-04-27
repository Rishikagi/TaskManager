document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('productivity-chart').getContext('2d');
    
    // Sample data - replace with your actual task data
    const productivityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: 'Tasks Completed',
                    data: [12, 19, 8, 15, 12, 5, 3],
                    backgroundColor: 'rgba(78, 115, 223, 0.8)',
                    borderColor: 'rgba(78, 115, 223, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Tasks Added',
                    data: [8, 12, 15, 10, 14, 7, 4],
                    backgroundColor: 'rgba(28, 200, 138, 0.8)',
                    borderColor: 'rgba(28, 200, 138, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-color')
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-color')
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-color')
                    }
                }
            }
        }
    });
    
    // Update chart when theme changes
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('change', function() {
        // This is a simple solution - in a real app you might want to destroy and recreate the chart
        setTimeout(() => {
            productivityChart.update();
        }, 300); // Wait for theme transition
    });
});