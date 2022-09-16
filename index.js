const currentTime     = document.querySelector("#current-time");
const setAlarmHours   = document.querySelector("#hours");
const setAlarmMinutes = document.querySelector("#minutes");
const setAlarmSeconds = document.querySelector("#seconds");
const setAlarmAmPm    = document.querySelector("#am-pm");
const setAlarmButton  = document.querySelector("#submitButton");
const alarmContainer  = document.querySelector("#alarms-container");

// Adding Hours, Minutes, Seconds in Option Menu
window.addEventListener("DOMContentLoaded", (event) => {
  console.log(setAlarmHours);
  setTimeMenu(1, 12, setAlarmHours);
 
  setTimeMenu(0, 59, setAlarmMinutes);

  setTimeMenu(0, 59, setAlarmSeconds);

  setInterval(getCurrTime, 1000);
  fetchAlarm();
});

// Event Listener added to Set Alarm Button
setAlarmButton.addEventListener("click", getInput);

function setTimeMenu(start, end, element) {
  for (let i = start; i <= end; i++) {
    const dropDownValue      = document.createElement("option");
    dropDownValue.value      = i < 10 ? "0" + i : i;
    dropDownValue.innerHTML  = i < 10 ? "0" + i : i;
    element.appendChild(dropDownValue);
  }
}

function getCurrTime() {
  let time  = new Date();
    time    = time.toLocaleTimeString("en-US", {
    hour    : "numeric",
    minute  : "numeric",
    second  : "numeric",
    hour12  : true,
  });
  
  currentTime.innerHTML = time;

  return time;
}

// get input time
function getInput(e) {
  e.preventDefault();
  const hourValues    = setAlarmHours.value;
  const minuteValues  = setAlarmMinutes.value;
  const secondValues  = setAlarmSeconds.value;
  const amPmValues    = setAlarmAmPm.value;
  //time in 24 hour format
  const alarmTimes    = `${parseInt(hourValues)}:${minuteValues}:${secondValues} ${amPmValues}`;
  setAlarm(alarmTimes);
}

// Alarms set by user
function addAlaramToDom(time, intervalId) {
  const alarm = document.createElement("div");
  alarm.classList.add("alarm", "mb", "d-flex");
  alarm.innerHTML = `<div class="time">${time}</div><button class="btn delete-alarm" data-id=${intervalId}>Delete</button>`;
  const deleteButton = alarm.querySelector(".delete-alarm");
  deleteButton.addEventListener("click", (e) => deleteAlarmClock(e, time, intervalId));
  alarmContainer.prepend(alarm);
}

//set alarm and alert if current time matches with set alram timing
function setAlarm(time, fetching = false) {
  //alert(time);
  const alarm = setInterval(() => {
    if (time === getCurrTime()) {
     alert("Alarm Ringing");
    }
  }, 500);

  addAlaramToDom(time, alarm);
  if (!fetching) {
    saveAlarm(time);
  }
}

// Is alarms saved in Local Storage?
function checkAlarams() {
  let alarms            = [];
  const isPresent       = localStorage.getItem("alarms");
  if (isPresent) alarms = JSON.parse(isPresent);

  return alarms;
}

// save alarm to local storage
function saveAlarm(time) {
  const alarms = checkAlarams();
  alarms.push(time);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}

// Fetching alarms from local storage
function fetchAlarm() {
  const alarms = checkAlarams();
  //console.log(alarms);
  alarms.forEach((time) => {
    setAlarm(time, true);
  });
}

// Delete alrams
function deleteAlarmClock(event, time, intervalId) {
  const self = event.target;
  clearInterval(intervalId);
  const alarm = self.parentElement;
  //console.log(time);
  deleteAlarmClockFromLocalStorage(time);
  alarm.remove();
}

//Delete from local
function deleteAlarmClockFromLocalStorage(time) {
  const alarms = checkAlarams();
  const index = alarms.indexOf(time);
  alarms.splice(index, 1);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}