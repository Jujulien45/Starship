import csv from './sample-flight.csv?raw';

const source = document.querySelector('#dataset');
const status = document.querySelector('.telemetry-status');
const flight = document.querySelector('#flight');
const canvas = document.querySelector('.flight-chart');
const context = canvas.getContext('2d');
let readings = [];

function drawChart() {
  if (flight.hidden || !context) return;

  const { width, height } = canvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  context.scale(scale, scale);

  const left = 42;
  const right = width - 16;
  const top = 16;
  const bottom = height - 30;
  const maxTime = readings.at(-1)[0];
  const maxAltitude = Math.max(...readings.map(([, altitude]) => altitude));
  const x = time => left + (right - left) * time / maxTime;
  const y = altitude => bottom - (bottom - top) * altitude / maxAltitude;
  const color = getComputedStyle(canvas).color;

  context.font = '12px system-ui';
  context.fillStyle = color;
  context.strokeStyle = color;
  context.textAlign = 'end';
  context.textBaseline = 'middle';
  for (let step = 0; step <= 4; step++) {
    const altitude = maxAltitude * step / 4;
    context.beginPath();
    context.moveTo(left, y(altitude));
    context.lineTo(right, y(altitude));
    context.globalAlpha = 0.25;
    context.stroke();
    context.globalAlpha = 1;
    context.fillText(altitude.toFixed(0), left - 8, y(altitude));
  }

  context.textAlign = 'center';
  for (let step = 0; step <= 4; step++) {
    const time = maxTime * step / 4;
    context.fillText(time.toFixed(0), x(time), bottom + 16);
  }

  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(x(readings[0][0]), y(readings[0][1]));
  for (const [time, altitude] of readings.slice(1)) {
    context.lineTo(x(time), y(altitude));
  }
  context.stroke();
}

const sample = csv.trim().split(/\r?\n/).slice(1)
  .map(line => line.split(',').map(Number));

function showDataset() {
  flight.hidden = true;
  if (source.value === 'live') {
    status.textContent = 'Disconnected';
    return;
  }
  readings = sample;

  const rows = readings.map(reading => {
    const row = document.createElement('tr');
    for (const value of reading) row.insertCell().textContent = value;
    return row;
  });
  flight.querySelector('tbody').replaceChildren(...rows);
  status.textContent = 'Simulated flight data · Time in seconds · Altitude in metres';
  flight.hidden = false;
  drawChart();
}

source.addEventListener('change', showDataset);
new ResizeObserver(drawChart).observe(canvas);
new MutationObserver(drawChart).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['data-theme'],
});
showDataset();
