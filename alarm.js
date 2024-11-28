const alarmCont = document.getElementById("alarm-container");
const setBtn = document.getElementById("set-btn");
const inpTime = document.getElementById("input-time");
const checkBoxes = document.querySelectorAll("input[type=checkbox]");
const ringtoneFile = document.getElementById("ringtone");
let interVals = {};
let isPlaying = false;

// Set alarm and create card
setBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const time = inpTime.value;
  const weekDay = [];
  for (const box of checkBoxes) {
    if (box.checked) {
      weekDay.push(box.value);
    }
  }

  if (!time || !ringtoneFile.value) {
    alert("Please provide valid time and ringtone.");
    return;
  }

  const alarm = {
    time: time,
    repeat: weekDay,
    ringtone: ringtoneFile.value,
    status: true,
  };

  const alarmList = JSON.parse(localStorage.getItem("alarms")) || [];
  alarmList.push(alarm);
  localStorage.setItem("alarms", JSON.stringify(alarmList));
  createCard(alarm, alarmList.length - 1);
});

// Check and trigger alarms
let currentRingtone = null; // To track the currently playing ringtone

function checkAlarms(alarm, ringtone, stopBtn, index) {
  if (interVals[index]) clearInterval(interVals[index]);
  interVals[index] = setInterval(() => {
    const now = new Date();
    const currHrs = now.getHours();
    const currMins = now.getMinutes();
    const weekDay = now.toLocaleString("en-US", { weekday: "short" });
    if (alarm.repeat.length == 0) alarm.repeat = weekDay;
    const [alarmHrs, alarmMins] = (alarm.time || "00:00").split(":");

    if (
      alarm.repeat.includes(weekDay) &&
      currHrs == alarmHrs &&
      currMins == alarmMins
    ) {
      if (isPlaying) return; // Prevent multiple triggers

      isPlaying = true;

      // Pause any existing ringtone before starting the new one
      if (currentRingtone) {
        currentRingtone.pause();
        currentRingtone.currentTime = 0;
      }

      currentRingtone = ringtone;
      ringtone.play();
      ringtone.loop = true;

      stopBtn.style.display = "flex";

      setTimeout(() => {
        ringtone.pause();
        stopBtn.click();
      }, 60000); // Stops after 1 minute if not manually stopped

      clearInterval(interVals[index]);
    }
  }, 1000);
}

// Create alarm card
function createCard(alarm, index) {
  const toggleBtn = document.createElement("input");
  toggleBtn.type = "checkbox";
  toggleBtn.checked = alarm.status;
  toggleBtn.classList.add("toggle-btn");

  const alarmTime = document.createElement("p");
  alarmTime.classList.add("time-para");
  alarmTime.textContent = alarm.time;

  const alarmRepeat = document.createElement("p");
  alarmRepeat.classList.add("repeat-para");
  alarmRepeat.textContent = alarm.repeat.join(", ") || "No Repeat";

  const stopBtn = document.createElement("button");
  stopBtn.classList.add("stop-btn");
  stopBtn.textContent = "Stop";
  stopBtn.style.display = "none";

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.textContent = "Delete";

  const ringtone = document.createElement("audio");
  ringtone.src = alarm.ringtone;

  const alarmCard = document.createElement("div");
  alarmCard.classList.add("alarm-card");

  toggleBtn.addEventListener("change", () => {
    const alarms = JSON.parse(localStorage.getItem("alarms")) || [];
    if (alarms[index]) {
      alarms[index].status = toggleBtn.checked;
      localStorage.setItem("alarms", JSON.stringify(alarms));

      if (toggleBtn.checked) {
        checkAlarms(alarms[index], ringtone, stopBtn, index);
      } else {
        stopBtn.click();
      }
    }
  });

  if (toggleBtn.checked) {
    checkAlarms(alarm, ringtone, stopBtn, index);
  }

  stopBtn.addEventListener("click", () => {
    ringtone.pause();
    ringtone.loop = false;
    stopBtn.style.display = "none";
    isPlaying = false;

    if (interVals[index]) clearInterval(interVals[index]);
  });

  deleteBtn.addEventListener("click", () => {
    const alarms = JSON.parse(localStorage.getItem("alarms")) || [];
    if (alarms[index]) {
      stopBtn.click();
      alarms.splice(index, 1);
      localStorage.setItem("alarms", JSON.stringify(alarms));
      loadPage();
    }
  });

  alarmCard.append(alarmTime, alarmRepeat, toggleBtn, stopBtn, deleteBtn);
  alarmCont.appendChild(alarmCard);
}

// Load alarms from localStorage
function loadPage() {
  alarmCont.innerHTML = "";
  const cardList = JSON.parse(localStorage.getItem("alarms")) || [];
  cardList.forEach((alarm, index) => {
    createCard(alarm, index);
  });
}

loadPage();
