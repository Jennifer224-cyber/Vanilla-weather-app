function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  return `${day} ${hours} : ${minutes}`;
}

function getForecast(coordinates) {
  let key = "bd79ao40tde3dec118ca46bc3e6dd55f";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&key=${key}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let dailyForecast = response.data.daily;

  let forecast = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  dailyForecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        ` 
                  <div class="col-2">
                    ${formatDay(forecastDay.time)} <br />
                    <img
                      src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
                        forecastDay.condition.icon
                      }.png"
                      width="36"
                    />
                    <br />
                    <span class="maxTemperature">${Math.round(
                      forecastDay.temperature.maximum
                    )}° </span
                    ><span class="minTemperature">${Math.round(
                      forecastDay.temperature.minimum
                    )}°</span>
                  </div>
                `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecast.innerHTML = forecastHTML;
}

function displayTemperature(response) {
  document.querySelector("#currentTemperature").innerHTML = Math.round(
    response.data.temperature.current
  );
  document.querySelector("#currentDescription").innerHTML =
    response.data.condition.description;
  document.querySelector("#city").innerHTML = response.data.city;
  document.querySelector("#humidity").innerHTML =
    response.data.temperature.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#currentTime").innerHTML = formatDate(
    response.data.time * 1000
  );
  let icon = document.querySelector("#icon");
  icon.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  celsiusTemperature = response.data.temperature.current;
  getForecast(response.data.coordinates);
}

function search(city) {
  let key = "bd79ao40tde3dec118ca46bc3e6dd55f";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${key}`;
  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form");
  search(searchInput.value);
}
function showFahrenheit(event) {
  event.preventDefault();
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  let fahrenheitLink = document.querySelector("#currentTemperature");
  fahrenheitLink.innerHTML = Math.round(fahrenheitTemperature);
}

function showCelsius(event) {
  event.preventDefault();
  let celsius = document.querySelector("#currentTemperature");
  celsius.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let form = document.querySelector("form");
form.addEventListener("submit", handleSubmit);

let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", showFahrenheit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", showCelsius);

search("Johannesburg");
