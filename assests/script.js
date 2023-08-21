const searchHistory = document.getElementById('searchHistory');
const citySearch = document.getElementById('citySearch');
const searchButton = document.getElementById('searchButton');
const todaysWeather = document.getElementById('todaysWeather');
const day1 = document.getElementById('1');
const day2 = document.getElementById('2');
const day3 = document.getElementById('3');
const day4 = document.getElementById('4');
const day5 = document.getElementById('5');

todaysWeather.style.visibility = "hidden"
const weatherAPI = 'e95f8a53e2cdfae989039129c9e5297c'


let geoAPI;
let lat;
let lon;
let city;
// Array holding our variables pulled from localStorage
let searches = new Array();
let days = new Array();

// Initializing the page 
// fills the search Array via getHistory
// fills the searchHistory html with content from localStorage
// runs the getWeather functions to fill forecast html
var pageLaunch = async () => {
    searches = getHistory();
    searchHistoryContent(searches);
    [lat, lon] = await geoLoc();
    getWeather();
    getWeatherFiveDay();
    addHistory(searches);
}

// localStorage functions covering get/set
// also populates the searches array / search history
var searchHistoryContent = () => {
    if (!searches) {
        return;
    }
    searchHistory.innerHTML = '';
    for (var i in searches) {
        let searchHistoryButton = document.createElement('button');
        searchHistoryButton.setAttribute('id', searches[i]);
        searchHistoryButton.innerText = searches[i];
        searchHistory.appendChild(searchHistoryButton);
    }
}

function addHistory(searches) {
    if (!searches.includes(city)) {
        searches.push(city);
    }
    localStorage.setItem("history", JSON.stringify(searches))
    searchHistoryContent(searches);
}

function getHistory() {
    let history = localStorage.getItem("history")
    if (!history) {
        searches = [];
    } else {
        searches = JSON.parse(history)
    }
    return searches;
}

// api call to get weather data and display it in "todaysWeather"
let getWeather = async () => {
    const forecastFetch = 'https://api.openweathermap.org/data/3.0/onecall?lat=' + lat + '&lon=' + lon + '&appid=' + weatherAPI;
    await fetch(forecastFetch)
    .then(function(response) {
        todaysWeather.style.visibility = "visible";
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        let temp = "Temp: " + Math.round(((data.current.temp)-273.15) * (9/5) + 32) + " " + "°F";
        let humidity = "Humidity: " + data.current.humidity + "%";
        let windSpeed = "Wind Speed: " + data.current.wind_speed + " " + "MPH";
        let date = "Date: " + dayjs.unix(data.daily[0].dt).format('M/D/YYYY');
        let icon = data.current.weather[0].icon;

        todaysWeather.innerHTML = '';
        const todaysWeatherReport = document.createElement('div');
        const cityNameHere = document.createElement('h2');
        cityNameHere.innerHTML = '<h2>' + city + '</h2>';
        const todaysDate = document.createElement('div');
        todaysDate.innerHTML = date;
        const todaysIcon = document.createElement('img');
        todaysIcon.setAttribute('src', `http://openweathermap.org/img/wn/` + icon + `@2x.png`);
        const todaysTemp = document.createElement('div');
        todaysTemp.innerHTML = temp;
        const todaysHumidity = document.createElement('div');
        todaysHumidity.innerHTML = humidity;
        const todaysWindSpeed = document.createElement('div');
        todaysWindSpeed.innerHTML = windSpeed;
        
        todaysWeatherReport.appendChild(cityNameHere);
        todaysWeatherReport.appendChild(todaysDate);
        todaysWeatherReport.appendChild(todaysIcon);
        todaysWeatherReport.appendChild(todaysTemp);
        todaysWeatherReport.appendChild(todaysHumidity);
        todaysWeatherReport.appendChild(todaysWindSpeed);
        todaysWeather.appendChild(todaysWeatherReport);
        
    });
}

// api call to get 5 day forecast data and display it in forecastCards
let getWeatherFiveDay = async () => {
    let forecastFetch = 'https://api.openweathermap.org/data/3.0/onecall?lat=' + lat + '&lon=' + lon + '&appid=' + weatherAPI;
    await fetch(forecastFetch)
    .then(function(response) {
        return response.json();
    })
    .then(function (data) {
        for (let index = 1; index < 6; index++) {
            let temp = "Temp: " +  Math.round(((data.daily[index].temp.day)-273.15) * (9/5) + 32);
            let humidity = "Humidity: " + data.daily[index].humidity;
            let windSpeed = "Wind Speed: " + data.daily[index].wind_speed;
            let date = "Date: " + dayjs.unix(data.daily[index].dt).format('M/D/YYYY');
            let icon = data.daily[index].weather[0].icon;

            const dayDiv = document.createElement('div');
            dayDiv.setAttribute('class', 'foreFive');
            
            const thisDaysDate = document.createElement('div');
            thisDaysDate.innerHTML = date;
            const thisDaysIcon = document.createElement('img');
            thisDaysIcon.setAttribute('src', `http://openweathermap.org/img/wn/` + icon + `@2x.png`);
            const thisDaysTemp = document.createElement('div');
            thisDaysTemp.innerHTML = temp;
            const thisDaysHumidity = document.createElement('div');
            thisDaysHumidity.innerHTML = humidity;
            const thisDaysWindSpeed = document.createElement('div');
            thisDaysWindSpeed.innerHTML = windSpeed;

            dayDiv.appendChild(thisDaysDate);
            dayDiv.appendChild(thisDaysIcon);
            dayDiv.appendChild(thisDaysTemp);
            dayDiv.appendChild(thisDaysHumidity);
            dayDiv.appendChild(thisDaysWindSpeed);

            forecastCards.appendChild(dayDiv);

            if (days.length <= 5) {
                days.push(dayDiv);
            } else {
                
            }
            
        }
    })
}

// api call to turn a city name into it's geographic coordinates 
// (needed for our weather api)
let geoLoc = async () => {
    geoAPI = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=' + weatherAPI;
    const response = await fetch(geoAPI);
    const data = await response.json();
    lat = data[0].lat;
    lon = data[0].lon;
    return [lat, lon];
}

searchHistory.addEventListener("click", (e) => {
    e.preventDefault();
    let historical = e.target;
    city = historical.innerText;
    searchHistory.innerHTML = '';
    geoAPI = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=' + weatherAPI;
    pageLaunch();
})

searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    forecastCards.innerHTML = '';
    city = citySearch.value;
    geoAPI = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=' + weatherAPI;
    pageLaunch();
});

pageLaunch();

