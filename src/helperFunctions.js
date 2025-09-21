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

function get24HourForecast(data) {
    const returnArray = [];
    const currentHour = data.currentConditions.datetime.substring(0, 2);
    const currentDay = data.days[0];
    const nextDay = data.days[1];
    for(let i = parseInt(currentHour) + 1; i <= 23; i++) {
        returnArray.push(currentDay.hours[i].temp);
    }
    for(let j = 0; j <= parseInt(currentHour); j++) {
        returnArray.push(nextDay.hours[j].temp);
    }
    return returnArray;
}

function get24HourTimes(data) {
    const returnArray = [];
    const currentTime = data.currentConditions.datetime;
    const currentHour = currentTime.substring(0, 2);
    for(let i = parseInt(currentHour) + 1; i <= 23; i++) {
        returnArray.push(i);
    }
    for(let j = 0; j <= parseInt(currentHour); j++) {
        returnArray.push(j)
    }
    return returnArray;
}

export {compareSentenceLength, upperCaseFirstLetter, get24HourForecast, get24HourTimes};