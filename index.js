const apiKey = CONFIG.apiKey;


    let updateInterval = null;

    window.onload = () => {
      const lastCity = localStorage.getItem("lastCity");
      if (lastCity) {
        document.getElementById("cityInput").value = lastCity;
        getWeather();
      }
    };

    function getWeather(auto = false) {
      const city = document.getElementById("cityInput").value.trim();
      const lang = document.getElementById("langSelect").value;

      if (!city) {
        document.getElementById("weather").innerHTML = "❗ Please enter a city name.";
        return;
      }

      if (!auto) {
        localStorage.setItem("lastCity", city);
      }

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=${lang}`;

      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error("❌ City not found.");
          }
          return response.json();
        })
        .then(data => {
          const temp = data.main.temp;
          const humidity = data.main.humidity;
          const wind = data.wind.speed;
          const description = data.weather[0].description;
          const icon = data.weather[0].icon;
          const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

          const lat = data.coord.lat;
          const lon = data.coord.lon;

          document.getElementById("weather").innerHTML = `
            <img src="${iconUrl}" alt="${description}">
            <p><strong>${description}</strong></p>
            <p>🌡️ Temperature: ${temp}°C</p>
            <p>💨 Wind Speed: ${wind} m/s</p>
            <p>💧 Humidity: ${humidity}%</p>
            <p>📍 City: ${city}</p>
            <p><em>Last updated: ${new Date().toLocaleTimeString()}</em></p>
          `;

          const map = document.getElementById("map");
          map.style.display = "block";
          map.src = `https://maps.google.com/maps?q=${lat},${lon}&z=10&output=embed`;

          if (!auto) {
            clearInterval(updateInterval);
            updateInterval = setInterval(() => getWeather(true), 60000);
          }
        })
        .catch(error => {
          document.getElementById("weather").innerHTML = `⚠️ Error: ${error.message}`;
          document.getElementById("map").style.display = "none";
          clearInterval(updateInterval);
        });
    }

    function clearSavedCity() {
      localStorage.removeItem("lastCity");
      document.getElementById("cityInput").value = "";
      document.getElementById("weather").innerHTML = "";
      document.getElementById("map").style.display = "none";
      clearInterval(updateInterval);
    }
