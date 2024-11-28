const clkTime = document.getElementById("clock");
const dayPara = document.getElementById("day-date");
let format12Hr = true;
const changeFormat = document.getElementById("change-format");
changeFormat.addEventListener("click", () => { format12Hr = !format12Hr; });
function getTime() {
    const d = new Date;
    const timeString =
        d.toLocaleString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: format12Hr
        });
    console.log(timeString);
    const [date, time] = timeString.split(" at ");
    clkTime.textContent = time;
    dayPara.textContent = date;
}
setInterval(() => {
    getTime();
}, 1000);