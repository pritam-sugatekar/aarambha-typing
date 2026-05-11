let totalTime = 120;
let time = totalTime;
let timerStarted = false;
let interval;

const timer = document.getElementById("time");
const input = document.getElementById("input");
const startBtn = document.getElementById("startBtn");
const result = document.getElementById("result");
const leaderboardBody = document.getElementById("leaderboardBody");
const liveWpm = document.getElementById("liveWpm");
const liveAccuracy = document.getElementById("liveAccuracy");
const startCountdown = document.getElementById("startCountdown");
const paragraphElement = document.getElementById("paragraph");

const paragraphText = "Technology has become an important part of our daily life. Students use computers and the internet for learning communication and project development. Typing speed and accuracy are essential skills in the modern digital world because they help students complete work faster and improve productivity. A person with good typing skills can save time reduce mistakes and work more efficiently. Regular practice improves finger movement concentration and confidence while typing. Many companies and organizations prefer candidates with better technical and communication skills. In today's competitive world learning technology and improving practical skills are very important for students to achieve success in their careers and future opportunities.";
paragraphElement.innerHTML = paragraphText
.split("")
.map(letter => `<span>${letter}</span>`)
.join("");

const paragraph = paragraphText;

timer.innerText = time;

input.disabled = true;
input.addEventListener("input", () => {

    const typedText = input.value;

    const typedWords = typedText.split(" ");
    const originalWords = paragraph.split(" ");

    let html = "";

    let correctWords = 0;

    for(let i = 0; i < originalWords.length; i++){

        // CURRENT WORD BEING TYPED
        if(i === typedWords.length - 1){

            html += `<span style="color:white">${originalWords[i]}</span> `;

        }

        // WORD NOT TYPED YET
        else if(typedWords[i] == null){

            html += `<span style="color:white">${originalWords[i]}</span> `;

        }

        // CORRECT WORD
        else if(typedWords[i] === originalWords[i]){

            html += `<span style="color:#22c55e">${originalWords[i]}</span> `;

            correctWords++;

        }

        // WRONG WORD
        else{

            html += `<span style="color:#ef4444">${originalWords[i]}</span> `;

        }

    }

    paragraphElement.innerHTML = html;
    const activeWord = paragraphElement.querySelector("span[style='color:white']");

    if(activeWord){

        activeWord.scrollIntoView({
            behavior:"smooth",
            block:"center"
        });

    }

    // LIVE WPM

    let timePassed = (totalTime - time) / 60;

    let currentWpm = 0;

    if(timePassed > 0){

        currentWpm = Math.round(correctWords / timePassed);

    }

    liveWpm.innerText = currentWpm;

    // LIVE ACCURACY

    let accuracy = 100;

    if(typedWords.length > 0){

        accuracy = ((correctWords / typedWords.length) * 100).toFixed(0);

    }

    liveAccuracy.innerText = accuracy;

});

startBtn.addEventListener("click", beginCountdown);

function beginCountdown(){

    const name = document.getElementById("name").value.trim();
    const usn = document.getElementById("usn").value.trim();
    const division = document.getElementById("division").value.trim();
    const branch = document.getElementById("branch").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if(
        name === "" ||
        usn === "" ||
        division === "" ||
        branch === "" ||
        phone === ""
    ){

        alert("Please fill all details before starting the test!");

        return;

    }

    startBtn.disabled = true;

    let countdownTime = 10;

    startCountdown.innerText = countdownTime;

    const countdownInterval = setInterval(() => {

        countdownTime--;

        startCountdown.innerText = countdownTime;

        if(countdownTime <= 0){

            clearInterval(countdownInterval);

            startCountdown.innerText = "GO!";

            paragraphElement.classList.remove("hidden");
            input.classList.remove("hidden");

            setTimeout(() => {

                startCountdown.innerText = "";

            },1000);

            startTest();

        }

    },1000);

}

function openFullscreen() {

    if(document.documentElement.requestFullscreen){

        document.documentElement.requestFullscreen();

    }

}

function startTest(){

    // Reset values
    clearInterval(interval);

    time = totalTime;
    timer.innerText = time;

    result.innerHTML = "";

    input.value = "";
    input.disabled = false;

    input.focus();
    openFullscreen();

    timerStarted = true;

    interval = setInterval(() => {

        time--;

        timer.innerText = time;

        if(time <= 0){

            clearInterval(interval);

            input.disabled = true;

            calculateResult();

        }

    },1000);

}

function calculateResult(){

    let typedText = input.value.trim();

    let typedWords = typedText.split(/\s+/).length;

    let wpm = Math.round(typedWords / 2);

    let correctChars = 0;

    for(let i = 0; i < typedText.length; i++){

        if(typedText[i] === paragraph[i]){

            correctChars++;

        }

    }

    let accuracy = 0;

    if(typedText.length > 0){

        accuracy = ((correctChars / typedText.length) * 100).toFixed(2);

    }

    result.innerHTML = `
        <h2>🏆 Test Completed!</h2>
        <p>⚡ WPM: <b>${wpm}</b></p>
        <p>🎯 Accuracy: <b>${accuracy}%</b></p>
    `;
    let playerName = document.getElementById("name").value;

    let row = `
    <tr>
        <td>${playerName}</td>
        <td>${wpm}</td>
        <td>${accuracy}%</td>
    </tr>
    `;

    leaderboardBody.innerHTML += row;
  
    saveResult(wpm, accuracy);
}
// Disable Right Click
document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});

// Disable Copy Paste & Shortcuts
document.addEventListener("keydown", (e) => {

    // Disable Ctrl+C
    if (e.ctrlKey && e.key === "c") {
        e.preventDefault();
    }

    // Disable Ctrl+V
    if (e.ctrlKey && e.key === "v") {
        e.preventDefault();
    }

    // Disable Ctrl+X
    if (e.ctrlKey && e.key === "x") {
        e.preventDefault();
    }

    // Disable Ctrl+A
    if (e.ctrlKey && e.key === "a") {
        e.preventDefault();
    }

});
let lockedIndex = 0;

input.addEventListener("keydown", (e) => {

    if(e.key === " "){

        lockedIndex = input.value.length;

    }

    if(e.key === "Backspace"){

        if(input.value.length <= lockedIndex){

            e.preventDefault();

        }

    }

});
function saveResult(wpm, accuracy) {

    const data = {
        name: document.getElementById("name").value,
        usn: document.getElementById("usn").value,
        division: document.getElementById("division").value,
        branch: document.getElementById("branch").value,
        phone: document.getElementById("phone").value,
        wpm: wpm,
        accuracy: accuracy
    };

    fetch("https://script.google.com/macros/s/AKfycby9ndwQIxywM56yrNT5n-6DORRQakmYgPsWfjvZ4UldRH7qUoZXECUeBXBlLJOQ-GJxsg/exec", {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

}