let apiKey = "16dceaba64310593c9483309e7d98601";

let urlWeather = `https://api.openweathermap.org/data/2.5/weather?q=minneapolis&appid=${apiKey}&units=imperial`;

let urlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=minneapolis&appid=${apiKey}&units=imperial`;

let urlOnecall = `https://api.openweathermap.org/data/2.5/onecall?lat=44.98&lon=-93.2638&appid=${apiKey}`;

let cityInputEl = document.getElementById("cityInput");

for (let i = 0; i < 5; i++) {
  document.getElementById(
    "dailyWeatherForecast"
  ).innerHTML += `<div class="forecast-col">
  <div id="d${i}">Sat</div>
  <img id="i${i}" class="weatherIcon" src="http://openweathermap.org/img/wn/01d@2x.png" />
  <div><span id="h${i}" class="pt-15"></span>&#176;</div>
  <div><span id="l${i}" class="pt-15 low"></span>&#176;</div>
  <div><span id="hum${i}" class="pt-15"></span><img src="./Assets/humidity.png"/></div>

</div>`;
}

//when button is click search for urlWeather
let getWeatherForecast = function (city) {
  if (city) {
    cityInputEl.value = city;
  }
  urlWeather = `https://api.openweathermap.org/data/2.5/weather?q=${cityInputEl.value}&appid=${apiKey}&units=imperial`;

  // when button is click, then get weather data
  setWeatherForecast();
};

let setWeeklyWeatherForecast = function () {
  fetch(urlForecast)
    .then(function (response) {
      //gets response ready
      return response.json();
    })
    .then(function (data) {
      if (data) {
        let j = 0;
        //moment() get the month and day now.
        let k = moment().format("MM/DD");
        for (let i = 0; i < data.list.length; i++) {
          // only update textContent when we don't have the date in the forecast
          if (k !== moment(data.list[i].dt_txt).format("MM/DD") && j < 5) {
            document.getElementById(`d${j}`).textContent = moment(
              data.list[i].dt_txt
            ).format("MM/DD");
            document.getElementById(`h${j}`).textContent =
              data.list[i].main.temp_max.toFixed(0);
            document.getElementById(`l${j}`).textContent =
              data.list[i].main.temp_min.toFixed(0);
            document.getElementById(`hum${j}`).textContent =
              data.list[i].main.humidity;

            document.getElementById(
              `i${j}`
            ).src = `http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`;
            //getting the first 5 dates that are not identical
            k = moment(data.list[i].dt_txt).format("MM/DD");
            // increment j by 1 when dates are not identical
            j++;
          }
        }
      }
      //‘response’ is ready and is available as ‘data’.
      console.log(data);
    });
  console.log();
};

//when button click search for urlForecast
let getWeeklyWeatherForecast = function () {
  cityInputEl.value !== "" && cityInputEl.value
    ? (urlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInputEl.value}&appid=${apiKey}&units=imperial`)
    : urlForecast;

  setWeeklyWeatherForecast();
};

let getUVIndex = function (lat, lon) {
  if (lat & lon) {
    urlOnecall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  }
  fetch(urlOnecall)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let uviColorEl = document.getElementById("uvColor");
      let uvi = data.current.uvi;
      document.getElementById("uvIndex").textContent = uvi;
      if (uvi < 3) {
        uviColorEl.style.backgroundColor = "green";
      } else if (uvi < 6) {
        uviColorEl.style.backgroundColor = "yellow";
      } else if (uvi < 8) {
        uviColorEl.style.backgroundColor = "orange";
      } else if (uvi < 11) {
        uviColorEl.style.backgroundColor = "red";
      } else {
        uviColorEl.style.backgroundColor = "violet";
      }

      console.log(data);
    });
};

let setWeatherForecast = function () {
  // when button is click, then get forecast data
  getWeeklyWeatherForecast();
  fetch(urlWeather)
    .then(function (response) {
      //gets response ready
      return response.json();
    })
    .then(function (data) {
      document.getElementById("temperature").textContent =
        data.main.temp.toFixed(0);
      document.getElementById("highTemperature").textContent =
        data.main.temp_max.toFixed(0);
      document.getElementById("lowTemperature").textContent =
        data.main.temp_min.toFixed(0);
      document.getElementById("wind").textContent =
        data.wind.speed.toFixed(0) + " mph";
      document.getElementById("humidity").textContent =
        data.main.humidity.toFixed(0);
      document.getElementById("cityName").textContent = data.name;
      document.getElementById("weatherDescription").textContent =
        data.weather[0].main;

      let cities = JSON.parse(window.localStorage.getItem("cities"));
      if (!cities) {
        cities = [];
      }

      if (!cities.includes(data.name)) {
        cities.push(data.name);
        window.localStorage.setItem("cities", JSON.stringify(cities));
        document.getElementById("cities").innerHTML = "";
        for (let i = 0; i < cities.length; i++) {
          document.getElementById(
            "cities"
          ).innerHTML += `<button onclick="getWeatherForecast('${cities[i]}')" class="link">${cities[i]}</button>`;
        }
      }

      getUVIndex(data.coord.lat, data.coord.lon);

      //‘response’ is ready and is available as ‘data’.
      console.log(data);
    });
};

setWeatherForecast();

let cities = JSON.parse(window.localStorage.getItem("cities"));
if (cities) {
  window.localStorage.setItem("cities", JSON.stringify(cities));
  for (let i = 0; i < cities.length; i++) {
    document.getElementById(
      "cities"
    ).innerHTML += `<button onclick="getWeatherForecast('${cities[i]}')" class="link">${cities[i]}</button>`;
  }
}
