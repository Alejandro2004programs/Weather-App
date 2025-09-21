import "./styles.css";

class weatherData {
    constructor(locationName, currentConditions, daysArray) {
        this.locationName = locationName;
        this.currentConditions = currentConditions;
        this.daysArray = daysArray;
    }
} 

function compareSentenceLength(firstSentence, secondSentence) {
    let count1 = 0;
    let count2 = 0;
    for(let i = 0; i < firstSentence.length; i++) {
        if(firstSentence[i] === " ") {
            count1 += 1;
        }
    }
    for(let j = 0; j < secondSentence.length; j++) {
        if(secondSentence[j] === " ") {
            count2 += 1;
        }
    }
    if(count1 === count2) {
        return true;
    }
    else {
        return false;
    }
}

function upperCaseFirstLetter(string) {
    let array = string.split(" ");
    let newString = "";
    for(let i = 0; i < array.length; i++) {
        let currentWord = array[i];
        newString = newString + currentWord[0].toUpperCase() + currentWord.substring(1) + " ";
    }
    return newString;
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
    console.log(data);
    let location = data.resolvedAddress;
    let upperCaseLocation = upperCaseFirstLetter(location);
    const currentConditions = data.currentConditions;
    const daysArray = data.days;
    const dataObject = await new weatherData(upperCaseLocation, currentConditions, daysArray);
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
