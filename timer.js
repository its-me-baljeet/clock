const timerCont = document.getElementById("timer-container");
const inpForm = document.getElementById("input-form");
const setBtn = document.getElementById("set-timer");
const startBtn = document.getElementById("start-btn");
const deleteBtn = document.getElementById("delete-btn");
const hrsBox = document.getElementById("hrs");
const minsBox = document.getElementById("mins");
const secsBox = document.getElementById("secs");
const stopBtn = document.createElement("button");
stopBtn.textContent = "Stop";
stopBtn.id = "stop-btn";
let hrs = 0, mins = 0, secs = 0;
timerCont.textContent = `${hrs > 9 ? hrs : "0" + hrs}:${mins > 9 ? mins : "0" + mins}:${secs > 9 ? secs : "0" + secs}`;
setBtn.addEventListener("click", (e) => {
    e.preventDefault();
    inpForm.hidden = true;
    hrs = Number(hrsBox.value);
    mins = Number(minsBox.value);
    secs = Number(secsBox.value);
    timerCont.textContent = `${hrs > 9 ? hrs : "0" + hrs}:${mins > 9 ? mins : "0" + mins}:${secs > 9 ? secs : "0" + secs}`;
    hrsBox.value = "", minsBox.value = "", secsBox.value = "";
});
let interv;
startBtn.addEventListener("click", () => {
    startBtn.replaceWith(stopBtn);
    interv = setInterval(() => {
        secs--;
        if (secs < 0) {
            mins--;
            secs = 59;
        }
        if (mins < 0) {
            hrs--;
            mins = 59;
        }
        if (hrs < 0) {
            deleteBtn.click();
        }
        timerCont.textContent = `${hrs > 9 ? hrs : "0" + hrs}:${mins > 9 ? mins : "0" + mins}:${secs > 9 ? secs : "0" + secs}`;
    }, 1000);
});
stopBtn.addEventListener("click", () => {
    clearInterval(interv);
    stopBtn.replaceWith(startBtn);
})
deleteBtn.addEventListener("click", () => {
    inpForm.hidden = false;
    stopBtn.click();
    hrs = 0, mins = 0, secs = 0;
    timerCont.textContent = `${hrs > 9 ? hrs : "0" + hrs}:${mins > 9 ? mins : "0" + mins}:${secs > 9 ? secs : "0" + secs}`;
});