const stopwatchCont = document.getElementById("stopwatch-container");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
let ms = 0, sec = 0, min = 0;
let interv;
startBtn.addEventListener("click", () => {
    startBtn.replaceWith(stopBtn);
    interv =
        setInterval(() => {
            ms++;
            if (ms > 99) {
                sec++;
                ms = 0;
            }
            if (sec > 59) {
                min++;
                sec = 0;
            }
            stopwatchCont.textContent = `${min > 9 ? min : "0" + min} : ${sec > 9 ? sec : "0" + sec} : ${ms > 9 ? ms : "0" + ms}`;
        }, 10);
})
//Stop Button
const stopBtn = document.createElement("button");
stopBtn.classList.add("stop-btn");
stopBtn.textContent = "Stop";

stopBtn.addEventListener("click", () => {
    clearInterval(interv);
    stopBtn.replaceWith(startBtn);
});
//Reset Button
resetBtn.addEventListener("click", () => {
    stopBtn.click();
    ms = 0, sec = 0, min = 0;
    stopwatchCont.textContent = `${min > 9 ? min : "0" + min} : ${sec > 9 ? sec : "0" + sec} : ${ms > 9 ? ms : "0" + ms}`;
});
resetBtn.click();