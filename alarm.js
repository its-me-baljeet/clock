const alarmCont = document.getElementById("alarm-container");
const setBtn = document.getElementById("set-btn");
const inpTime = document.getElementById("input-time");
const checkBoxes = document.querySelectorAll("input[type=checkbox]");
const ringtoneFile = document.getElementById("ringtone");
let interVals = {};
var isPlaying = false;
setBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const time = (inpTime.value);
    const weekDay = [];
    for (const day in checkBoxes) {
        if (checkBoxes[day].checked) {
            weekDay.push(checkBoxes[day].value);
        }
    }
    let alarm = {
        time: time,
        repeat: weekDay.toString(),
        ringtone: ringtoneFile.value,
        status: true
    }
    const alarmList = JSON.parse(localStorage.getItem("alarms")) || [];
    alarmList.push(alarm);
    const index = alarmList.length - 1;
    // console.log(index)
    localStorage.setItem("alarms", JSON.stringify(alarmList));
    createCard(alarm, index);
});

function checkAlarms(alarm, ringtone, stopBtn, index) {
    if (isPlaying) { return; }
    if (interVals[index]) clearInterval(interVals[index]);
    interVals[index] = setInterval(() => {
        const now = new Date;
        const currHrs = now.getHours();
        const currMins = now.getMinutes();
        const weekDay = now.toLocaleString("en-US", { weekday: "short" });
        if (alarm.repeat.length == 0) { alarm.repeat = weekDay }
        const [alarmHrs, alarmMins] = (alarm.time || "00:00").split(":");
        if (alarm.repeat.includes(weekDay) && currHrs == alarmHrs && currMins == alarmMins) {
            isPlaying = true;
            ringtone.play();
            setTimeout(() => {
                ringtone.pause();
                stopBtn.click();
            }, 60000);
            ringtone.loop = true;
            stopBtn.style.display = "flex";
            clearInterval(interVals[index]);
        }
    }, 1000);
}

function createCard(alarm, index) {
    const toggleBtn = document.createElement("input");//Toggle Button
    toggleBtn.type = "checkbox";
    toggleBtn.checked = alarm.status;
    toggleBtn.classList.add("toggle-btn");

    const alarmTime = document.createElement("p");//Alarm Time
    alarmTime.classList.add("time-para");
    alarmTime.textContent = alarm.time;

    const alarmRepeat = document.createElement("p");//Repeat
    alarmRepeat.classList.add("repeat-para");
    alarmRepeat.textContent = alarm.repeat;

    const stopBtn = document.createElement("button");
    stopBtn.classList.add("stop-btn");
    stopBtn.textContent = "Stop";
    stopBtn.style.display = "none";

    const deleteBtn = document.createElement("button");//Delete Button
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "Delete";

    const ringtone = document.createElement("audio");//RingTone
    ringtone.src = alarm.ringtone;

    const alarmCard = document.createElement("div");//Alarm Card
    alarmCard.classList.add("alarm-card");
    toggleBtn.addEventListener("change", () => {
        const alarms = JSON.parse(localStorage.getItem("alarms"));
        if (alarms[index]) {

            alarms[index].status = toggleBtn.checked;
            localStorage.setItem("alarms", JSON.stringify(alarms));
            if (toggleBtn.checked == true) {
                checkAlarms(alarm, ringtone, stopBtn);//Working of alarms
            }
            else {
                stopBtn.click();
            }
        }
        else {
            console.log("alarm doesnt exist at index: " + index);
        }
    })
    if (toggleBtn.checked == true) {
        checkAlarms(alarm, ringtone, stopBtn, index);//Working of alarms
    }
    stopBtn.addEventListener("click", () => {
        const alarms = JSON.parse(localStorage.getItem("alarms"));
        if (alarms[index]) {

            clearInterval(interVals[index]);
            ringtone.pause();
            toggleBtn.checked = false;
            alarms[index].status = toggleBtn.checked;
            localStorage.setItem("alarms", JSON.stringify(alarms))
            stopBtn.style.display = "none";
            isPlaying = false;
        }
        else {
            console.log("alarm doesnt exist at index: " + index);
        }
    })
    deleteBtn.addEventListener("click", () => {
        const alarms = JSON.parse(localStorage.getItem("alarms"));
        if (alarms[index]) {
            stopBtn.click();
            clearInterval(interVals[index]);
            alarms.splice(index, 1);
            localStorage.setItem("alarms", JSON.stringify(alarms));
            loadPage();
        }
        else {
            console.log("alarm doesnt exist at index: " + index);
        }
    });
    alarmCard.appendChild(alarmTime);
    alarmCard.appendChild(alarmRepeat);
    alarmCard.appendChild(toggleBtn);
    alarmCard.appendChild(deleteBtn);
    alarmCard.appendChild(stopBtn);
    alarmCont.appendChild(alarmCard);
}
function loadPage() {
    alarmCont.innerHTML = "";
    const cardList = JSON.parse(localStorage.getItem("alarms")) || [];
    cardList.forEach((alarm, index) => {
        createCard(alarm, index);
    });
}
loadPage();