import "./styles.css";
import {compareSentenceLength, upperCaseFirstLetter, get24HourForecast, get24HourTimes, getRainChance, getWeatherIconNames, getCurrentWeatherIcon} from "./helperFunctions.js";

class weatherData {
    constructor(locationName, currentConditions, hoursArray, forecastArray, rainChanceArray, weatherIconNamesArray, currentWeatherIcon) {
        this.locationName = locationName;
        this.currentConditions = currentConditions;
        this.hoursArray = hoursArray;
        this.forecastArray = forecastArray;
        this.rainChanceArray = rainChanceArray;
        this.weatherIconNamesArray = weatherIconNamesArray;
        this.currentWeatherIcon = currentWeatherIcon;

    }
}

async function fetchData(location) {
    try {
        const response = await fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + location + "?key=4YJ3YVP7FRVQQ2267QZFJ7LU5");
        const json = await response.json();
        if(json && compareSentenceLength(location, await json.resolvedAddress)) {
            return json;
        }
        else {
            throw new Error("This location input should not be accepted");
        }
    }
    catch {
        alert("No data available for this input");
    }
}

async function processData(promise) {
    const data = await promise;
    const location = data.resolvedAddress;
    const upperCaseLocation = upperCaseFirstLetter(location);
    const currentConditions = data.currentConditions;
    const hoursArray = get24HourTimes(data);
    const forecastArray = get24HourForecast(data);
    const rainChanceArray = getRainChance(data);
    const weatherIconNamesArray = getWeatherIconNames(data);
    const currentWeatherIcon = getCurrentWeatherIcon(data);
    const dataObject = await new weatherData(upperCaseLocation, currentConditions, hoursArray, forecastArray, rainChanceArray, weatherIconNamesArray, currentWeatherIcon);
    console.log(data);
    console.log(dataObject);
    return dataObject;
}

async function getWeatherIcon(iconName) {
    try {
        const icon = await import('./weatherIcons/' + iconName + '.png');
        return icon.default;
    }
    catch(err) {
        console.warn(`Missing icon: ${iconName}, using fallback.`);
        const fallback = await import("./weatherIcons/clear-day.png");
        return fallback.default;
    }
}

function setUpInputForm() {
    const locationForm = document.querySelector(".locationForm");
    locationForm.addEventListener("submit", async(e) => {
    e.preventDefault();
    const inputData = locationForm.locationInput.value;
    const response = await fetchData(inputData);
    if(response) {
        const weatherObject = await processData(response);
        updateDOM(weatherObject);
    }
    });
}

async function updateDOM(weatherObject) {
    const currentLocation = document.querySelector(".currentLocation");
    const weatherConditions = document.querySelector(".weatherConditions");
    const currentTemperature = document.querySelector(".currentTemperature");
    currentLocation.textContent = await weatherObject.locationName;
    weatherConditions.textContent = await weatherObject.currentConditions.conditions;
    currentTemperature.textContent = Math.floor(await weatherObject.currentConditions.temp) + "°F";
    const futureForecastContainer = document.querySelector(".futureHoursContainer");
    futureForecastContainer.replaceChildren();
    for(let i = 0; i <= 23; i++) {
        const futureForecastDiv = document.createElement("div");
        const futureTimeText = document.createElement("p");
        const imageContainer = document.createElement("div");
        const weatherIcon = document.createElement("img");
        const futureTemperatureText = document.createElement("p");
        futureTimeText.textContent = weatherObject.hoursArray[i];
        futureTemperatureText.textContent = weatherObject.forecastArray[i] + "°F"; 
        weatherIcon.src = await getWeatherIcon(weatherObject.weatherIconNamesArray[i]);
        futureForecastDiv.setAttribute("class", "futureHourDiv");
        futureTimeText.setAttribute("class", "futureTimeText");
        futureTemperatureText.setAttribute("class", "futureTemperatureText");
        imageContainer.appendChild(weatherIcon);
        futureForecastDiv.appendChild(futureTimeText);
        futureForecastDiv.appendChild(imageContainer);
        futureForecastDiv.appendChild(futureTemperatureText);
        futureForecastContainer.appendChild(futureForecastDiv);
    }
    const currentWeatherIcon = document.querySelector(".currentWeatherIcon");
    currentWeatherIcon.src = await getWeatherIcon(weatherObject.currentWeatherIcon);
    
}

setUpInputForm();

// async function setInitialLocation() {
//     const response = await fetchData("san diego");
//     const weatherObject = await processData(response);
//     updateDOM(weatherObject);
// }

// setInitialLocation();