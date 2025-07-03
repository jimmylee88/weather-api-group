document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("getWeather").addEventListener("click", async function () {
        const city = document.getElementById("city").value;
        //console.log(city); // featch the city name from the input field
        const resultDiv = document.getElementById("weatherResult");
        //console.log(resultDiv); // featch the result div
        resultDiv.innerHTML = ""; // Clear previous results

        if (!city) {
            resultDiv.innerHTML = "<p>Please enter a city name.</p>";
            console.log("No city entered");
        }

        const API_KEY = "f23ee9deb4e1a7450f3157c44ed020e1";

        try {
            // First, get the latitude and longitude for the city
            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
            const geoResponse = await fetch(geoUrl);
            const geoData = await geoResponse.json();
            console.log(geoData); //  geoData to see the response

            if (geoData.length === 0) {
                resultDiv.innerHTML = "<p>City not found.</p>";
                return;
            }
            const lat = geoData[0].lat;
            //console.log(lat); //  latitude
            const lon = geoData[0].lon;
            //console.log(lon); //  longitude
            // Now, get the weather data using the latitude and longitude
            //console.log("Fetching weather data for coordinates:", lat, lon);
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

            const weatherResponse = await fetch(weatherUrl);
            const weatherData = await weatherResponse.json();
            let weatherHTML = `
                            <h2>Today's Weather in ${weatherData.name}</h2>
                            <p><strong>${weatherData.weather[0].main}</strong> - ${weatherData.weather[0].description}</p>
                            <p>🌡️ Temperature: ${weatherData.main.temp} °C</p>
                            <p>💧 Humidity: ${weatherData.main.humidity}%</p>
                            <p>🌬️ Wind: ${weatherData.wind.speed} m/s</p>
                            <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png" alt="${weatherData.weather[0].description}">
                            <hr>
                            `;
            // 3. Get 5-day forecast
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
            const forecastResponse = await fetch(forecastUrl);
            const forecastData = await forecastResponse.json();
            const dailyForecast = {};
            forecastData.list.forEach(entry => {
                const date = entry.dt_txt.split(" ")[0];
                if (!dailyForecast[date] && entry.dt_txt.includes("12:00:00")) {
                    dailyForecast[date] = entry;
                }
            });
            let forecastHTML = `<h2>5-Day Forecast</h2><div style="display:flex;gap:16px;overflow-x:auto;padding:10px;">`;
            for (const date in dailyForecast) {
                const day = dailyForecast[date];
                const weekday = new Date(day.dt_txt).toLocaleDateString(undefined, { weekday: "short" });
                forecastHTML += `
                                <div style="text-align:center;min-width:100px;">
                                <strong>${weekday}</strong><br>
                                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}" title="${day.weather[0].description}">
                                <div>${day.main.temp_min.toFixed(0)}° / ${day.main.temp_max.toFixed(0)}°</div>
                                </div>
                        `;
            }
            forecastHTML += "</div>";
            resultDiv.innerHTML = weatherHTML + forecastHTML;
        } catch (error) {
            console.error("Error:", error);
            resultDiv.innerHTML = "<p>Failed to load weather data. Please try again later.</p>";
        }
    }
    );
});
