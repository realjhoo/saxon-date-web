const meliaName = [
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
];

// --------------------------------------------------------
function getJulianDay() {
  // gets the julian date, off set UTC+1 tho
  let today = new Date();
  let year = today.getUTCFullYear(),
    month = today.getUTCMonth(),
    date = today.getUTCDate(),
    hour = today.getUTCHours();

  month++; // because javascript counts 0-11

  // correct for Central European Standard Time
  // so that between 11pm and 12am UTC, the date
  // is incremented
  if (hour === 23) {
    date++;
  }

  // calculate julian date - thanks stackoverflow
  let a = (14 - month) / 12;
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;

  let JD =
    date + (153 * m + 2) / 5 + y * 365 + y / 4 - y / 100 + y / 400 - 32045;

  // remove the fractional bit. We'll replace with beats later
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

  // * * * convert to beats, aka internet time * * *
  // the next 4 lines of code could be combined. Separated for clarity
  // chop excessive precision
  let internetTime = (secondsSoFar / secondsPerBeat).toFixed(2);
  // pad with leading zeros
  internetTime = "000" + internetTime;
  // cut to correct length start with back
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
  // extract elements from the JD
  let triennium = ND.toString().slice(0, 4);
  let melia = ND.toString().slice(4, 5);
  let centum = ND.toString().slice(5, 7);

  return [triennium, melia, centum];
}

// --------------------------------------------------------
function showNumerareDierum(triennium, melia, centum, thebeats) {
  let today = new Date();
  //let newDate = today.toISOString().slice(0, 10); // shows current gregorian date bigendian with dash separators

  const output = document.querySelector(".output");
  output.innerHTML = `Today, is the <span class="green">${centum}${getOrdinalIndicator(
    centum
  )} day of ${
    meliaName[melia]
  } in Triennium ${triennium}.</span></p> <p>Or, <span class="green">${
    meliaName[melia]
  } ${centum}, ${triennium}</span>.</p> 
  <p>Or, even: <span class="green">${triennium}.${melia}.${centum}</span>.</p> 
  <p>The time, in beats, may be appended: <span class="green">${triennium} ${melia} ${centum} ${thebeats}</span></p>
  <p>Or, <span class="green">${centum} ${
    meliaName[melia]
  } ${triennium} ${thebeats}</span></p> `;
}

// --------------------------------------------------------
function toggleit() {
  let toggleButton = document.getElementById("toggle-button");
  let explainer = document.querySelector(".explainer");

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
function main() {
  let ND = getJulianDay();
  let thebeats = getBeats();
  let [triennium, melia, centum] = sliceJD(ND);

  showNumerareDierum(triennium, melia, centum, thebeats);

  // console.log(triennium, meliaName[melia], centum);
  // console.log(triennium, meliaName[melia], centum + " " + thebeats);
  // console.log(ND);
}

// --------------------------------------------------------
main();
setInterval(main, 1000);
/* 
TODO: 
x Place lose code in functions... I hate lose code!!!
x How to do ordinal identifiers?
x Output the results to the web page
Make page pretty for gods' sake sorta... ???
x Rewrite blurb so it doesnt want to show current Numerare Dierum multiple times
x Run the current and updating time at the top
x Adapt the code to the bitbar beats :-)
Deploy this page to saxondate.com using the menu bar there
Rewrite the menu bar on saxon-date-web. Dev Ed?
*/
