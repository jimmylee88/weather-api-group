document.getElementById("getWeather").addEventListener("click", async function() {
    const city = document.getElementById("city").value;
      console.log(city); // featch the city name from the input field
    const resultDiv = document.getElementById("weatherResult");
      console.log(resultDiv); // featch the result div
  
    resultDiv.innerHTML = ""; // Clear previous results

    if (!city) {
    resultDiv.innerHTML = "<p>Please enter a city name.</p>";
    console.log("No city entered");
    return;
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
        console.log(lat); //  latitude
        const lon = geoData[0].lon;
        console.log(lon); //  longitude

        // Now, get the weather data using the latitude and longitude
        console.log("Fetching weather data for coordinates:", lat, lon);
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        const weatherResponse = await fetch(weatherUrl);
        if (!weatherResponse.ok) {
            throw new Error("Network response was not ok");
        }
        console.log("Weather data fetched successfully");
        console.log(weatherUrl); // weather URL to see the request
        const weatherData = await weatherResponse.json();
        console.log(weatherData); //  weatherData to see the response

        if (weatherData.cod !== 200) {
            resultDiv.innerHTML = `<p>Error: ${weatherData.message}</p>`;
            return;
        }

        // Display the weather data
        resultDiv.innerHTML = `
            <h2>Weather in ${weatherData.name}</h2>
            <p>Temperature: ${weatherData.main.temp} °C</p>
            <p>Weather: ${weatherData.weather[0].description}</p>
            <p>Humidity: ${weatherData.main.humidity}%</p>
            <p>Wind Speed: ${weatherData.wind.speed} m/s</p>
            <p>Coordinates: ${weatherData.coord.lat}, ${weatherData.coord.lon}</p>
            <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png" alt="${weatherData.weather[0].description}">
        `;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        resultDiv.innerHTML = "<p>Failed to fetch weather data. Please try again later.</p>";
    }

  
});