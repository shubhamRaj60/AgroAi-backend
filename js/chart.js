// Setup 3 charts for Moisture, Temperature, TDS

// Moisture Chart
const moistureCtx = document.getElementById('moistureChart').getContext('2d');
const moistureChart = new Chart(moistureCtx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Soil Moisture (%)',
      data: [],
      borderColor: 'green',
      backgroundColor: 'rgba(39, 174, 96, 0.2)',
      tension: 0.4,
      pointRadius: 3
    }]
  },
  options: {
    responsive: true,
    scales: { y: { min: 0, max: 100 } }
  }
});

// Temperature Chart
const tempCtx = document.getElementById('temperatureChart').getContext('2d');
const tempChart = new Chart(tempCtx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Temperature (°C)',
      data: [],
      borderColor: 'red',
      backgroundColor: 'rgba(231, 76, 60, 0.2)',
      tension: 0.4,
      pointRadius: 3
    }]
  },
  options: {
    responsive: true,
    scales: { y: { min: 0, max: 50 } }
  }
});

// TDS Chart
const tdsCtx = document.getElementById('tdsChart').getContext('2d');
const tdsChart = new Chart(tdsCtx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'TDS (ppm)',
      data: [],
      borderColor: 'blue',
      backgroundColor: 'rgba(52, 152, 219, 0.2)',
      tension: 0.4,
      pointRadius: 3
    }]
  },
  options: {
    responsive: true,
    scales: { y: { min: 0, max: 2000 } } // Adjust max as per your TDS range
  }
});

// Utility function to update chart with new data and keep max 10 points
function updateChart(chart, value) {
  const timestamp = new Date().toLocaleTimeString();
  if (chart.data.labels.length >= 10) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }
  chart.data.labels.push(timestamp);
  chart.data.datasets[0].data.push(value);
  chart.update();
}

// Firebase DB reference (assumes firebase initialized in firebase-config.js)
const db = firebase.database();

// Subscribe to Moisture
db.ref('/AgroAI/Moisture').on('value', snapshot => {
  const moisture = snapshot.val();
  if (moisture !== null) {
    updateChart(moistureChart, moisture);
  }
});

// Subscribe to Temperature
db.ref('/AgroAI/Temperature').on('value', snapshot => {
  const temp = snapshot.val();
  if (temp !== null) {
    updateChart(tempChart, temp);
  }
});

// Subscribe to TDS
db.ref('/AgroAI/TDS').on('value', snapshot => {
  const tds = snapshot.val();
  if (tds !== null) {
    updateChart(tdsChart, tds);
  }
});
