// $('.container').on('click','.submitBtn', function() {
//     var cityEl = $(this).prev().val();
//     localStorage.setItem('cityname', cityEl);
//     var lastSearch = document.createElement('li');
//     lastSearch.textContent = cityEl;
//     console.log(cityEl);
//     $('#previousSearchSection').append(JSON.stringify(cityEl).toUpperCase());
//     $('.allSearches').addClass('btn-primary btn-lg btn-block');



    // if (p !== null) {

    // }
    // console.log(typeof(lastSearch));
    // console.log(JSON.stringify(lastSearch));
// });

// $('#previousSearchSection').on('click','')

// TODO: button element with previous search needs to be functionally connected to search bar with function

// TODO: create functions that accociate with API key for open weather map

// TODO: remember to convert units to imperial 


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
  var uv = data.current.uvi;
  var icon = data.current.weather[0].icon;
  
  var h2El = document.createElement('h2');
  var tempEl = document.createElement('p');
  var dateEl = document.createElement('p');                                     
  var humidityEl = document.createElement('p');                                     
  var windEl = document.createElement('p'); 
  var uvEl = document.createElement('p')
  var imgEl = document.createElement('img');

  currentEl.innerHTML = null;

  h2El.textContent = city.name;
  tempEl.textContent = 'Temp: ' + temp
  windEl.textContent = 'Wind: ' + wind
  humidityEl.textContent = 'Humidity: ' + humidity;
  uvEl.textContent ='UVI: ' + uv;

  imgEl.width = 90;
  imgEl.height = 90;
  imgEl.alt = icon;
  imgEl.src = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

currentEl.append(h2El);
currentEl.append(dateEl);
currentEl.append(imgEl);
currentEl.append(tempEl);
currentEl.append(windEl);
currentEl.append(humidityEl);
currentEl.append(uvEl);
//   document.body.appendChild(h2El);
//   document.body.appendChild(tempEl);

  console.log('DAILY', data.daily.slice(1, 6));
  var fiveDays = data.daily.slice(1, 6);
  
//   fiveDays.innerHTML = null;
  for (var day of fiveDays) {
    console.log('DAY', day);
    var date = new Date(day.dt * 1000).toLocaleDateString();
    console.log(date);
    var temp = day.temp.day;
    console.log(temp);
    var icon = day.weather[0].icon;
    var wind = day.wind_speed;
    var humidity = day.humidity;
    // var colEl = document.createElement('div');
    var cardEl = document.createElement('div');
    var dateEl = document.createElement('p');                                     
    var windEl = document.createElement('p');                                     
    var humidityEl = document.createElement('p');                                     
    var tempEL = document.createElement('div');
    var imgEl = document.createElement('img');

    // colEl.className = 'col-12 col-md';
    cardEl.className = 'card col-12 col-md p-3 m-3';

    dateEl.textContent ='Date: ' + date;
    tempEL.textContent ='Temp: ' + temp;
    windEl.textContent = 'Wind: ' + wind;
    humidityEl.textContent ='Humidity: ' + humidity;
    

    imgEl.width = 90;
    imgEl.height = 90;
    imgEl.alt = icon;
    imgEl.src = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

    fiveDayEl.append(cardEl);
    cardEl.append(dateEl);
    cardEl.append(imgEl);
    cardEl.append(tempEL);
    tempEL.append(windEl);
    tempEL.append(humidityEl);
    // fiveDayEl.append(colEl);
  }
}

var displayButtons = function () {
  var cities = JSON.parse(localStorage.getItem('cities')) || [];
  // var showOnlyThreeCities = cities.slice(cities.length - 3);
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
  // how to reduce duplicates then reconvert into 
  var citySet = Array.from(new Set(city));
  var data = JSON.stringify(cities);
  localStorage.setItem('cities', data)
  displayButtons();
};

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
  var geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${q.value}&appid=${appid}`;
  fetch(geoURL)
    .then(toJSON)
    .then(getGEO);

};

var handleCityClick = function (event) {
  event.preventDefault();
  if (event.target.matches('button')) {
    var q = event.target.textContent;
    var geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${q}&appid=${appid}`;
    fetch(geoURL)
      .then(toJSON)
      .then(getGEO);
  }
};


searchedEl.addEventListener('click', handleSearch);
searchedCities.addEventListener('click', handleCityClick);

displayButtons();