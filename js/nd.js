/**
 * Ad Numerare Dierum
 * Returns current Julian Date UTC +1
 * Shows current Beat Time
 * A fun time measuring project
 * JL Hoover 2059270
 */

// --------------------------------------------------------
function getMeliaName(index) {
  return [
    "Nullamelia",
    "Unumelia",
    "Duomelia",
    "Triamelia",
    "Quattarmelia",
    "Quinquemelia",
    "Sexmelia",
    "Septmelia",
    "Octomelia",
    "Novemelia",
  ][index];
}

// --------------------------------------------------------
function getDayName(index) {
  return [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][index];
}

// --------------------------------------------------------
function getJulianDay(year, month, date) {
  // calculate julian date - thanks stackoverflow (jbabey)
  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;

  let JD =
    date +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  // remove the fractional bit
  let remainder = JD % 1;
  JD -= remainder;

  return JD;
}

// --------------------------------------------------------
function getBeats() {
  const secondsPerBeat = 86.4;

  let time = new Date();
  let seconds = time.getUTCSeconds(),
    minutes = time.getUTCMinutes(),
    hours = time.getUTCHours();

  // correct for Central European Standard -> UTC + 1
  if (hours === 23) {
    hours = 0;
  } else {
    hours++;
  }

  let secondsSoFar = convertToSeconds(hours, minutes, seconds);

  // convert to beats - next 4 lines separated for clarity

  // chop excessive precision
  let internetTime = (secondsSoFar / secondsPerBeat).toFixed(2);
  // pad with leading zeros
  internetTime = "000" + internetTime;
  // cut to correct length - start rightmost
  internetTime = internetTime.slice(-6);
  // add the @
  internetTime = "@" + internetTime;

  return internetTime;
}

// --------------------------------------------------------
function convertToSeconds(hours, minutes, seconds) {
  return (hours * 60 + minutes) * 60 + seconds;
}

// --------------------------------------------------------
function sliceJD(ND) {
  // extract elements from the JD for ND
  let triennium = ND.toString().slice(0, 4);
  let melia = ND.toString().slice(4, 5);
  let centum = ND.toString().slice(5, 7);

  return [triennium, melia, centum];
}

// --------------------------------------------------------
function showNumerareDierum(triennium, melia, centum, thebeats, dotw) {
  const output = document.querySelector(".output");

  output.innerHTML = `Now: <span class="green"> (${triennium}${melia}${centum}) ${dotw} ${centum}${getOrdinalIndicator(
    centum
  )} ${getMeliaName(melia)} ${triennium} ${thebeats}</span>`;
}

// --------------------------------------------------------
function addDatePicker() {
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let date = now.getDate();

  // input control requires leading zeros
  if (month < 10) {
    month = month.toString().padStart(2, 0);
  }

  if (date < 10) {
    date = date.toString().padStart(2, 0);
  }

  let datePicker = document.getElementById("date-picker");
  datePicker.value = `${year}-${month}-${date}`;

  datePicker.addEventListener("change", (event) => {
    // selectedDate is 00:00 UTC, so 5 or 6pm Central
    // if time picker is added, this can be made more precise
    let selectedDate = new Date(event.target.value);
    let year = selectedDate.getUTCFullYear();
    let month = selectedDate.getUTCMonth() + 1;
    let date = selectedDate.getUTCDate();

    let ND = getJulianDay(year, month, date);
    let [triennium, melia, centum] = sliceJD(ND);
    let dotw = getDayName((ND + 1) % 7);

    const output = document.querySelector(".selected-date-output");
    output.style.visibility = "visible";

    output.innerHTML = `Then: <span class="green">(${ND}) ${dotw} ${centum}${getOrdinalIndicator(
      centum
    )} ${getMeliaName(melia)} ${triennium}</span>`;
  });
}

// --------------------------------------------------------
function toggleit() {
  // toggles visibility of explainer in DOM - obviously
  const toggleButton = document.getElementById("toggle-button");
  const explainer = document.querySelector(".explainer");

  if (toggleButton.innerHTML === "Show More") {
    toggleButton.innerHTML = "Show Less";
    explainer.style.display = "block";
  } else {
    toggleButton.innerHTML = "Show More";
    explainer.style.display = "none";
  }
}

// --------------------------------------------------------
function getOrdinalIndicator(number) {
  // adds st, nd, rd or th to number
  let rightmostDigit = number.toString().slice(-1);
  let ordinalIndicator = "";

  // in English, 11 - 13 are exceptions to the rule
  if (number >= 11 && number <= 13) {
    ordinalIndicator = "th";
  } else if (rightmostDigit < 1 || rightmostDigit >= 4) {
    ordinalIndicator = "th";
  } else if (parseInt(rightmostDigit) === 1) {
    ordinalIndicator = "st";
  } else if (parseInt(rightmostDigit) === 2) {
    ordinalIndicator = "nd";
  } else if (parseInt(rightmostDigit) === 3) {
    ordinalIndicator = "rd";
  }

  return ordinalIndicator;
}

// --------------------------------------------------------
function getUTCdate() {
  // returns current julian date, offset UTC+1 tho
  let today = new Date();
  let year = today.getUTCFullYear(),
    month = today.getUTCMonth(),
    date = today.getUTCDate(),
    hour = today.getUTCHours();

  month++; // because javascript counts 0-11

  // correct for Central European Standard Time so that
  // between 11pm and 12am UTC, the date is incremented
  if (hour === 23) {
    date++;
  }

  return [year, month, date];
}

// --------------------------------------------------------
function main() {
  let [year, month, date] = getUTCdate();
  let ND = getJulianDay(year, month, date);
  let thebeats = getBeats();
  let [triennium, melia, centum] = sliceJD(ND);
  let dotw = getDayName((ND + 1) % 7);

  showNumerareDierum(triennium, melia, centum, thebeats, dotw);
}

// --------------------------------------------------------
main();
setInterval(main, 1000);
addDatePicker();
