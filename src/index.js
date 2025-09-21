import "./styles.css";
import {compareSentenceLength, upperCaseFirstLetter, get24HourForecast, get24HourTimes} from "./helperFunctions.js";

class weatherData {
    constructor(locationName, currentConditions, hoursArray, forecastArray) {
        this.locationName = locationName;
        this.currentConditions = currentConditions;
        this.hoursArray = hoursArray;
        this.forecastArray = forecastArray;
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
    const hoursArray = get24HourTimes(data);
    const forecastArray = get24HourForecast(data);
    console.log(data);
    let location = data.resolvedAddress;
    let upperCaseLocation = upperCaseFirstLetter(location);
    const currentConditions = data.currentConditions;
    const daysArray = data.days;
    const dataObject = await new weatherData(upperCaseLocation, currentConditions, hoursArray, forecastArray);
    console.log(dataObject);
    return dataObject;
}

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

async function updateDOM(weatherObject) {
    const currentLocation = document.querySelector(".currentLocation");
    const weatherConditions = document.querySelector(".weatherConditions");
    const currentTemperature = document.querySelector(".currentTemperature");
    currentLocation.textContent = await weatherObject.locationName;
    weatherConditions.textContent = await weatherObject.currentConditions.conditions;
    currentTemperature.textContent = Math.floor(await weatherObject.currentConditions.temp) + "°F";

}

// async function setInitialLocation() {
//     const response = await fetchData("san diego");
//     console.log(response);
    
//     // Later on, finish setting this up, but for now i just want this to call the API every time i make a change so that i can see the object

// }

// setInitialLocation();