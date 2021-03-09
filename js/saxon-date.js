/*
Saxon Date Node App / BitBar Plugin / Web Page
by jan Uwe 2019.12.04 (8 Ereyule 2269)
Last updated 2020.12.29 (16 Ereyule 2270)
Adding Calendar feature (20 Sol 2271)
  Equinox algorithm adapted from:
  Juergen Giesen 6.5.2012
  Moon Phase algorithm by Endel Dreyer Github @endel
*/

// dates do not work before March 1 AD 1900
"use strict";
// --------------------------------------------------------
function getSaxonMonth(index) {
  return [
    "Afterlitha",
    "Trilitha",
    "Weed",
    "Holy",
    "Winterful",
    "Blot",
    "Ereyule",
    "Afteryule",
    "Sol",
    "Retha",
    "Easter",
    "Trimilch",
    "Erelitha",
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

// ========================================================
function getJulianDate(date, month, year) {
  // returns julian date
  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;

  let JD =
    date +
    Math.floor((153 * m + 2) / 5) +
    y * 365 +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  return JD;
}

// ========================================================
function getSolsticeJD(year) {
  // returns the julian date of the summer solstice in a given year
  const K = Math.PI / 180.0;
  let T, W, dL, ssJD;
  let y = (year - 2000) / 1000;
  let JDE0 =
    2451716.56767 +
    365241.62603 * y +
    0.00325 * y * y +
    0.00888 * y * y * y -
    0.0003 * y * y * y * y;

  T = (JDE0 - 2451545.0) / 36525.0;
  W = 35999.373 * T - 2.47;
  W *= K;
  dL = 1.0 + 0.0334 * Math.cos(W) + 0.0007 * Math.cos(2 * W);

  ssJD = JDE0 + (0.00001 * S(T)) / dL - (66.0 + (year - 2000) * 1.0) / 86400.0;

  return ssJD;
}

// ======Helper Function for getSolsticeJD=====================
function S(T) {
  const K = Math.PI / 180.0;
  let x;
  x = 485 * Math.cos(K * (324.96 + 1934.136 * T));
  x += 203 * Math.cos(K * (337.23 + 32964.467 * T));
  x += 199 * Math.cos(K * (342.08 + 20.186 * T));
  x += 182 * Math.cos(K * (27.85 + 445267.112 * T));
  x += 156 * Math.cos(K * (73.14 + 45036.886 * T));
  x += 136 * Math.cos(K * (171.52 + 22518.443 * T));
  x += 77 * Math.cos(K * (222.54 + 65928.934 * T));
  x += 74 * Math.cos(K * (296.72 + 3034.906 * T));
  x += 70 * Math.cos(K * (243.58 + 9037.513 * T));
  x += 58 * Math.cos(K * (119.81 + 33718.147 * T));
  x += 52 * Math.cos(K * (297.17 + 150.678 * T));
  x += 50 * Math.cos(K * (21.02 + 2281.226 * T));
  x += 45 * Math.cos(K * (247.54 + 29929.562 * T));
  x += 44 * Math.cos(K * (325.15 + 31555.956 * T));
  x += 29 * Math.cos(K * (60.93 + 4443.417 * T));
  x += 18 * Math.cos(K * (155.12 + 67555.328 * T));
  x += 17 * Math.cos(K * (288.79 + 4562.452 * T));
  x += 16 * Math.cos(K * (198.04 + 62894.029 * T));
  x += 14 * Math.cos(K * (199.76 + 31436.921 * T));
  x += 12 * Math.cos(K * (95.39 + 14577.848 * T));
  x += 12 * Math.cos(K * (287.11 + 31931.756 * T));
  x += 12 * Math.cos(K * (320.81 + 34777.259 * T));
  x += 9 * Math.cos(K * (227.73 + 1222.114 * T));
  x += 8 * Math.cos(K * (15.45 + 16859.074 * T));

  return x;
}

// ========================================================
function JDtoDateString(JD) {
  let date, month, year;
  let B, D, F;
  let JD0, C, E;

  JD0 = Math.floor(JD + 0.5);
  B = Math.floor((JD0 - 1867216.25) / 36524.25);
  C = JD0 + B - Math.floor(B / 4) + 1525.0;
  D = Math.floor((C - 122.1) / 365.25);
  E = 365.0 * D + Math.floor(D / 4);
  F = Math.floor((C - E) / 30.6001);
  date = Math.floor(C - E + 0.5) - Math.floor(30.6001 * F);

  month = F - 1 - 12 * Math.floor(F / 14);
  year = D - 4715 - Math.floor((7 + month) / 10);

  return [date, month, year];
}

// ========================================================
function isNewMoon(date, month, year) {
  // use min and max to tune the sensitivity for new moon detection
  const maxNewMoon = 0.98; // moon is almost new
  const minNewMoon = 0.02; // moon is just past new

  let newMoon = false;

  if (month < 3) {
    year--;
    month += 12;
  }

  month++; // because jan = 0

  let c = 365.25 * year; // mean length of calendar year
  let e = 30.6001 * month; // mean length of calendar month

  let moonAge = c + e + date - 694039.09; // num of days since known new moon 1900.01.01
  moonAge /= 29.5305882; // average duration of lunation

  // remove the whole number, leave fraction (current age of moon)
  let moonAgeInteger = parseInt(moonAge);
  moonAge -= moonAgeInteger; // a number between 0 & 1

  if (moonAge > maxNewMoon || moonAge < minNewMoon) {
    newMoon = true;
  } else {
    newMoon = false;
  }

  return newMoon;
}

// ========================================================
function adjustYear(day, month, year) {
  // if solstice hasnt happened yet, use last year's solstice
  const MAY = 4; // solstice hasnt happened yet
  const JUNE = 5; // solstice happens in june

  if (month <= MAY) {
    year--;
  }
  if (month === JUNE) {
    // find date of solstice. Returns array but m & y not used
    let [dayOfss, m, y] = JDtoDateString(getSolsticeJD(year));

    // if date is before solstice decrement year
    if (day < dayOfss) {
      year--;
    }
  }

  return year;
}

// ========================================================
function isIntercalary(date, month, year) {
  // refactored. may fail?
  let intercalary = false;
  const fortnight = 14; // a new moon within 14 days of solstice triggers intercalary month following Afterlitha. Is this number too large?

  for (let i = 0; i < fortnight; i++) {
    let newMoon = isNewMoon(date + i, month, year);
    if (newMoon) {
      intercalary = true;
      return intercalary;
    }
  }
  return intercalary;
}

// ========================================================
function getSaxonYear(today, moon, year) {
  const December = 11;
  let saxonYear = year;

  // New Year is 1 Afteryule, so adjust year
  if (getSaxonMonth(moon) === "Afteryule" && today.getMonth() === December) {
    saxonYear += 251;
  } else {
    saxonYear += 250;
  }

  return saxonYear;
}

// ========================================================
function isBetween(julianDateToday, julianDateSS) {
  // is the the date between the solstice and the new moon?
  let newMoon = false;
  let ctr = 0;

  do {
    // start at solstice: check following days for new moon
    let [day, month, year] = JDtoDateString(julianDateSS + ctr);
    newMoon = isNewMoon(day, month, year);

    if (newMoon) {
      let julianDateNM = getJulianDate(day, month, year);

      if (julianDateToday < julianDateNM && julianDateToday > julianDateSS) {
        return true;
      }
    }
    ctr++;
  } while (newMoon === false);
}

// ========================================================
function fixTheDate(julianDateSS) {
  let newMoon = false;
  let ctr = 0;

  do {
    // start at solstice: walk back days & check for new moon
    let [day, month, year] = JDtoDateString(julianDateSS + ctr);
    newMoon = isNewMoon(day, month, year);

    if (newMoon) {
      return ctr;
    }
    ctr--;
  } while (newMoon === false);
}

// ========================================================
function getSaxonDate(intercalary, ssDateString, today, year) {
  // ss = summer solstice
  const ssDate = new Date(ssDateString);
  const ssDay = ssDate.getDate();
  const ssMonth = ssDate.getMonth() + 1;
  const ssYear = ssDate.getFullYear();

  const currDate = new Date();
  const currDay = currDate.getDate() + 1;
  const currMonth = currDate.getMonth() + 1;
  const currYear = currDate.getFullYear();

  const ssJulianDate = getJulianDate(ssDay, ssMonth, ssYear);
  const todayJulianDate = getJulianDate(currDay, currMonth, currYear);
  let daysSinceSolstice = todayJulianDate - ssJulianDate;

  // initialize and scope vars
  let saxonDay = 0;
  let moon = -1; // will this break at the summer solstice???
  let justChanged = false;
  let daysElapsed = 0;
  let newMoonJD;
  let firstDay;

  // dates between solstice and 1st new moon need fixing // *** why?
  let dateIsBetween = isBetween(todayJulianDate, ssJulianDate);

  if (dateIsBetween) {
    daysElapsed = Math.abs(fixTheDate(ssJulianDate));
  }

  for (let i = 0; i <= daysSinceSolstice; i++) {
    saxonDay++;

    // Convert date of solstice to d,m,y -> test for new moon
    let [day, month, year] = JDtoDateString(ssJulianDate + i);
    let newMoon = isNewMoon(day, month, year);

    if (newMoon && !justChanged) {
      justChanged = true; //flag to run once

      // JD of current new moon
      newMoonJD = ssJulianDate + i;
      // gets the day of the week
      firstDay = new Date(year, month + 1).getDay();

      if (intercalary === false && moon === 0) {
        // moon increments twice to skip Trilitha when not intercalary
        moon++;
      }

      moon++;
      // in case of moon overflow: 0-12 so 13 is always wrong
      if (moon > 12) {
        moon = 0;
      }
      saxonDay = 1; // reset date at new moon
    } else {
      justChanged = false;
    }
  }

  // returns the JD of the next new moon
  let nextNewMoon = getNextNewMoon(newMoonJD);
  let daysInMonth = nextNewMoon - newMoonJD;

  saxonDay += daysElapsed; // now agrees with day of the week
  const saxonYear = getSaxonYear(today, moon, year);
  const saxonDate =
    getDayName(todayJulianDate % 7) +
    " " +
    saxonDay +
    " " +
    getSaxonMonth(moon) +
    " " +
    saxonYear;

  showCalendar(daysInMonth, firstDay, saxonYear, moon, saxonDay);

  return saxonDate;
}

// ========================================================
function showSaxonDate(saxonDate) {
  document.querySelector(".saxon-date").innerHTML = `<span>${saxonDate}</span>`;
}

// --------------------------------------------------------
function toggleit() {
  // toggles the visibility of the explainer section
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
function getNextNewMoon(newMoonJD) {
  // returns julian date of next new moon

  let date,
    month,
    year = [];
  let newMoon = false;

  do {
    newMoonJD += 1;
    [date, month, year] = JDtoDateString(newMoonJD);
    newMoon = isNewMoon(date, month, year);
  } while (!newMoon);

  let nextNewMoonJD = getJulianDate(date, month, year);

  return nextNewMoonJD;
}

// --------------------------------------------------------
// based on https://github.com/niinpatel/calendarHTML-Javascript
function showCalendar(daysInMonth, firstDay, saxonYear, saxonMonth, saxonDay) {
  const calendarBody = document.getElementById("calendar-body");
  const monthYear = document.getElementById("month-year");

  // clearing any previous cells
  calendarBody.innerHTML = "";
  // fill in month and year

  monthYear.innerHTML = getSaxonMonth(saxonMonth) + " " + saxonYear;
  // these two lines are for dropdown boxes
  // selectYear.value = year;
  //selectMonth.value = month;

  // create &populate table
  let date = 1;
  for (let i = 0; i < 6; i++) {
    // creates table row (tr)
    const row = document.createElement("tr");
    //create cells with data (td).
    for (let j = 0; j < 7; j++) {
      // blank cells before the 1st
      if (i === 0 && j < firstDay) {
        const cell = document.createElement("td");
        const cellText = document.createTextNode("");
        cell.appendChild(cellText);
        row.appendChild(cell);
        // end this after last day of month
      } else if (date > daysInMonth) {
        break;
      } else {
        // fill in the cells
        const cell = document.createElement("td");
        const cellText = document.createTextNode(date);
        // highlight today's cell
        if (
          // year === saxonYear() &&
          // month === saxonMonth() &&
          date === saxonDay
        ) {
          cell.classList.add("highlight-cell");
        }
        cell.appendChild(cellText);
        row.appendChild(cell);
        date++;
      }
    }

    calendarBody.appendChild(row); // appending each row into calendar body.
  }
}

// ========================================================
function main() {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();

  // before summer solstice? decrement year
  let ssYear = adjustYear(day, month, year);

  // get date string of summer solstice
  const [d, m, y] = JDtoDateString(getSolsticeJD(ssYear));
  const ssDateString = y + "/" + m + "/" + d; // use / for Safari

  // 13 moons or 12?
  let intercalary = isIntercalary(d, m, y);

  // get computed Saxon Date
  let saxonDate = getSaxonDate(intercalary, ssDateString, today, year);

  // output for web page
  showSaxonDate(saxonDate);
}

// --------------------------------------------------------
main();
