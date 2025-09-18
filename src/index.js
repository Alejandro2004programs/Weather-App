import "./styles.css";

class weatherData {
    constructor(locationName, currentConditions, daysArray) {
        this.locationName = locationName;
        this.currentConditions = currentConditions;
        this.daysArray = daysArray;
    }
} 

async function fetchData(location) {
    try {
        const response = await fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + location + "?key=4YJ3YVP7FRVQQ2267QZFJ7LU5");
        const json = await response.json();
        return json;
    }
    catch {

    }
}

async function processData(promise) {
    const data = await promise;
    const dataObject = await new weatherData(data.resolvedAddress, data.currentConditions, data.days);
    console.log(dataObject);
}

const locationForm = document.querySelector(".locationForm");
locationForm.addEventListener("submit", async(e) => {
    e.preventDefault();
    const inputData = locationForm.locationInput.value;
    const response = await fetchData(inputData);
    processData(response);
});
