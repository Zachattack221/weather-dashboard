// defined most variables in global scope to use in multiple functions

var searchForm = document.querySelector('#search-Form')
var searchedCities = document.querySelector('#searched-Cities')
var searchedEl = document.querySelector('#search');
var appid = '485bbc753e29e9770f09ca55c32c6d79';
var fiveDayEl = document.querySelector('#fiveDay');
var currentEl = document.querySelector('#current');


var toJSON = function (response) {
    return response.json();
};

var displayWeather = function (data, city) {
    console.log(data);


    var temp = data.current.temp;
    var icon = data.current.weather[0].icon;
    var wind = data.current.wind_speed;
    var humidity = data.current.humidity;
    var uv = data.daily[0].uvi;


    var h2El = document.createElement('h2');
    var tempEl = document.createElement('p');
    var dateEl = document.createElement('p');
    var humidityEl = document.createElement('p');
    var windEl = document.createElement('p');
    var uvEl = document.createElement('p')
    var imgEl = document.createElement('img');
    var uvSpanEl = document.createElement('span');
    currentEl.innerHTML = null;

    h2El.textContent = city.name;
    tempEl.textContent = 'Temp: ' + temp
    windEl.textContent = 'Wind: ' + wind
    humidityEl.textContent = 'Humidity: ' + humidity;
    uvEl.textContent = 'UVI: ';
    uvSpanEl.textContent = uv;

    imgEl.width = 90;
    imgEl.height = 90;
    imgEl.alt = icon;
    imgEl.src = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

    currentEl.append(h2El);
    currentEl.append(dateEl);
    currentEl.append(imgEl);
    currentEl.append(tempEl);
    currentEl.append(windEl);
    currentEl.append(humidityEl);
    currentEl.append(uvEl);
    uvEl.append(uvSpanEl);

    // set up logic to change UV index display color depending on the value in three ranges

    if (uv < 3) {
        uvSpanEl.classList.add('bg-success', 'rounded', 'p-2');
    }
    if (uv > 3 && uv < 7) {
        uvSpanEl.classList.add('bg-warning', 'rounded', 'p-2');
    }
    else {
        uvSpanEl.classList.add('bg-danger', 'rounded', 'p-2');
    }

    var fiveDays = data.daily.slice(1, 6);

    fiveDay.innerHTML = null;
    for (var day of fiveDays) {
        console.log('DAY', day);
        var date = new Date(day.dt * 1000).toLocaleDateString();
        var temp = day.temp.day;
        var icon = day.weather[0].icon;
        var wind = day.wind_speed;
        var humidity = day.humidity;

        var cardEl = document.createElement('div');
        var dateEl = document.createElement('p');
        var windEl = document.createElement('p');
        var humidityEl = document.createElement('p');
        var tempEL = document.createElement('div');
        var imgEl = document.createElement('img');


        cardEl.className = 'card col-2 col-md p-3 m-3';

        dateEl.textContent = 'Date: ' + date;
        tempEL.textContent = 'Temp: ' + temp;
        windEl.textContent = 'Wind: ' + wind;
        humidityEl.textContent = 'Humidity: ' + humidity;


        imgEl.width = 90;
        imgEl.height = 90;
        imgEl.alt = icon;
        imgEl.src = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

        fiveDayEl.append(cardEl);
        cardEl.append(dateEl);
        cardEl.append(imgEl);
        cardEl.append(tempEL);
        tempEL.append(windEl);
        tempEL.append(humidityEl);

    }
}

// Function to generate search buttons for each searched city

var displayButtons = function () {
    var cities = JSON.parse(localStorage.getItem('cities')) || [];
    searchedCities.innerHTML = null;
    for (var city of cities) {
        var buttonEl = document.createElement('button');
        buttonEl.textContent = city;
        buttonEl.className = 'btn btn-success mb-3';
        searchedCities.appendChild(buttonEl);
    }
}

var getOneCall = function (city) {
    var oneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${city.lat}&lon=${city.lon}&appid=${appid}&units=imperial&exclude=hourly,minutely`;

    fetch(oneCall)
        .then(toJSON)
        .then(function (data) {
            displayWeather(data, city);
        });
};

var saveToLocalStorage = function (city) {
    var cities = JSON.parse(localStorage.getItem('cities')) || [];
    cities.push(city);
    // Reduces duplicates then reconvert into string
    var citySet = Array.from(new Set(cities));
    var data = JSON.stringify(citySet);
    localStorage.setItem('cities', data)
    displayButtons();
};

// functions below handle API requests via inserting specific parameters as template literals

var getGEO = function (locations) {
    var city = locations[0];
    console.log('LAT', city.lat);
    console.log('LON', city.lon);
    saveToLocalStorage(city.name);
    getOneCall(city);
};



var handleSearch = function (event) {
    event.preventDefault();
    var q = document.querySelector('#q');
    var geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${q.value}&appid=${appid}`;
    fetch(geoURL)
        .then(toJSON)
        .then(getGEO);

};

var handleCityClick = function (event) {
    event.preventDefault();
    if (event.target.matches('button')) {
        var q = event.target.textContent;
        var geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${q}&appid=${appid}`;
        fetch(geoURL)
            .then(toJSON)
            .then(getGEO);
    }
};

searchedEl.addEventListener('click', handleSearch);
searchedCities.addEventListener('click', handleCityClick);

displayButtons();