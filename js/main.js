// ✅ Connect to global Firebase DB
const db = window.db;

// 🔧 Default Thresholds
let tempThreshold = 35;
let moistureThreshold = 30;

// 🌾 Crop Suggestion Logic
function suggestCrop(temp, moisture) {
  let crop = "--";
  if (moisture > 60 && temp < 30) crop = "Rice";
  else if (moisture > 40 && temp <= 32) crop = "Wheat";
  else if (moisture > 30 && temp < 35) crop = "Tomato";
  else crop = "Check Conditions";

  const suggestionDiv = document.getElementById("cropSuggestion");
  const cropText = document.getElementById("cropName");
  if (suggestionDiv && cropText) {
    cropText.innerText = crop;
    suggestionDiv.style.display = "block";
  }
}

// 🌐 Handle Model Selection
const modelDropdown = document.getElementById("sensor-model");
if (modelDropdown) {
  modelDropdown.addEventListener("change", function () {
    const model = this.value;
    if (model === "basic") {
      tempThreshold = 35;
      moistureThreshold = 30;
    } else if (model === "advanced") {
      tempThreshold = 32;
      moistureThreshold = 40;
    }
  });
}

// 🌡 Temperature Reading
let latestTemperature = null;
let latestMoisture = null;

db.ref("/AgroAI/Temperature").on("value", snapshot => {
  const temp = snapshot.val();
  latestTemperature = temp;
  document.getElementById("temperature").innerText = temp + " °C";

  if (temp > tempThreshold) {
    alert("⚠️ Temperature exceeds safe limit!");
  }

  if (latestMoisture !== null) {
    suggestCrop(temp, latestMoisture);
  }
});

// 💧 Moisture Reading
db.ref("/AgroAI/Moisture").on("value", snapshot => {
  const moisture = snapshot.val();
  latestMoisture = moisture;
  document.getElementById("moisture").innerText = moisture + " %";

  if (moisture < moistureThreshold) {
    alert("💧 Soil moisture is too low!");
  }

  if (latestTemperature !== null) {
    suggestCrop(latestTemperature, moisture);
  }
});

// 🧪 TDS
db.ref("/AgroAI/TDS").on("value", snapshot => {
  document.getElementById("tds").innerText = snapshot.val() + " ppm";
});

// 🚿 Pump Status
db.ref("/AgroAI/PumpStatus").on("value", snapshot => {
  const isOn = snapshot.val();
  const pump = document.getElementById("pumpStatus");
  pump.innerText = isOn ? "ON 🔵" : "OFF ⚪";
  pump.className = isOn ? "on" : "off";
});