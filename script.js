document.addEventListener("DOMContentLoaded", function () {
    loadUserData();
    updateClock();
    setInterval(updateClock, 1000);
    loadGoal();
    fetchNews();
});

// Dark and Light Mode
document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;
    const navbar = document.querySelector(".navbar");

    // Check for saved theme preference
    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("dark-mode");
        navbar.classList.replace("navbar-light", "navbar-dark");
        navbar.classList.replace("bg-light", "bg-dark");
        themeToggle.classList.replace("btn-outline-dark", "btn-outline-light");
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

    // Theme Toggle Click Event
    themeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");

        if (body.classList.contains("dark-mode")) {
            navbar.classList.replace("navbar-light", "navbar-dark");
            navbar.classList.replace("bg-light", "bg-dark");
            themeToggle.classList.replace("btn-outline-dark", "btn-outline-light");
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem("theme", "dark");
        } else {
            navbar.classList.replace("navbar-dark", "navbar-light");
            navbar.classList.replace("bg-dark", "bg-light");
            themeToggle.classList.replace("btn-outline-light", "btn-outline-dark");
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem("theme", "light");
        }
    });
});



// Save & Load User Name
function saveUserName() {
    localStorage.setItem("userName", document.getElementById("name-input").value);
    document.getElementById("user-name").textContent = localStorage.getItem("userName") || "User";
}

// Clock
function updateClock() {
    const now = new Date();

    // Format time with leading zeros
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");

    // Format date properly
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const formattedDate = now.toLocaleDateString(undefined, options);

    // Update the HTML elements
    document.getElementById("time").textContent = `${hours}:${minutes}:${seconds}`;
    document.getElementById("date").textContent = formattedDate;
}

// Start the clock and update every second
setInterval(updateClock, 1000);
updateClock();  // Initial call to avoid 1-second delay


// Weather
const API_KEY = "b5f7dffeb30047d689d122201252503"; // Use your actual API key

function getWeather() {
    const city = document.getElementById("city-input") ? document.getElementById("city-input").value : "Chennai";

    fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`)
        .then(res => {
            if (!res.ok) throw new Error("City not found");
            return res.json();
        })
        .then(data => {
            document.getElementById("weather").textContent = `${data.current.temp_c}°C, ${data.current.condition.text}`;
        })
        .catch(error => {
            document.getElementById("weather").textContent = "Error fetching weather";
            console.error("Weather API Error:", error);
        });
}

// Quotes
function fetchQuote() {
    const apiURL = "https://api.quotable.io/random";

    fetch(apiURL)
        .then(res => res.json())
        .then(data => {
            document.getElementById("quote-text").textContent = `"${data.content}"`;
            document.getElementById("quote-author").textContent = `— ${data.author}`;
        })
        .catch(() => {
            // Fallback quotes in case API fails
            const fallbackQuotes = [
                { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
                { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
                { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
                { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
                { text: "Act as if what you do makes a difference. It does.", author: "William James" }
            ];
            const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
            document.getElementById("quote-text").textContent = `"${randomQuote.text}"`;
            document.getElementById("quote-author").textContent = `— ${randomQuote.author}`;
        });
}

// Load a quote on page load
document.addEventListener("DOMContentLoaded", fetchQuote);


// Auto-fetch weather when the page loads
document.addEventListener("DOMContentLoaded", getWeather);

// Pomodoro Timer
let timer;
function startTimer() {
    let time = 25 * 60;
    timer = setInterval(() => {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        document.getElementById("timer").textContent = `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
        time--;
        if (time < 0) clearInterval(timer);
    }, 1000);
}
function resetTimer() {
    clearInterval(timer);
    document.getElementById("timer").textContent = "25:00";
}

// Goal Tracker
function saveGoal() {
    const goalInput = document.getElementById("goal-input");
    const goalText = document.getElementById("goal-text");

    if (goalInput && goalText) {
        const goal = goalInput.value.trim();
        if (goal) {
            localStorage.setItem("dailyGoal", goal);
            goalText.textContent = goal;
        } else {
            alert("Please enter a valid goal!");
        }
    } else {
        console.error("Missing input or display element for goal.");
    }
}

function loadGoal() {
    const goalText = document.getElementById("goal-text");
    
    if (goalText) {
        goalText.textContent = localStorage.getItem("dailyGoal") || "Set your goal!";
    } else {
        console.error("Missing display element for goal.");
    }
}

// Load goal when the page loads
document.addEventListener("DOMContentLoaded", loadGoal);


// Fetch News
function fetchNews() {
    const newsList = document.getElementById("news-list");

    if (!newsList) {
        console.error("News list element not found.");
        return;
    }

    // Show loading state
    newsList.innerHTML = "<li class='list-group-item text-center'>Loading news...</li>";

    // API URL
    const API_URL = "https://newsdata.io/api/1/latest?apikey=pub_768122ddcce35e9a351f9ab19b5b3db43ffa2";

    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            newsList.innerHTML = ""; // Clear previous content

            if (!data.results || data.results.length === 0) {
                newsList.innerHTML = "<li class='list-group-item text-center'>No news available.</li>";
                return;
            }

            // Loop through articles (limit to 5)
            data.results.slice(0, 5).forEach(article => {
                const li = document.createElement("li");
                li.className = "list-group-item";
                li.innerHTML = `
                    <strong>${article.title}</strong> <br>
                    <a href="${article.link}" target="_blank">Read more</a>
                `;
                newsList.appendChild(li);
            });
        })
        .catch(error => {
            console.error("Error fetching news:", error);
            newsList.innerHTML = "<li class='list-group-item text-danger text-center'>Failed to load news.</li>";
        });
}

// Fetch news when the page loads
document.addEventListener("DOMContentLoaded", fetchNews);

// Music Player
let audio = document.getElementById("audio");

// Play Music
function playMusic() {
    audio.play();
}

// Pause Music
function pauseMusic() {
    audio.pause();
}

// Stop Music
function stopMusic() {
    audio.pause();
    audio.currentTime = 0;
}

// Change Track
function changeTrack(track) {
    audio.src = track;
    audio.play();
}

// Set Volume
function setVolume(value) {
    audio.volume = value;
}


// To-do list
document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
    let taskInput = document.getElementById("task-input").value.trim();
    if (taskInput === "") return;

    let taskList = document.getElementById("task-list");

    // Create Task Item
    let li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
        <span>${taskInput}</span>
        <div>
            <button class="btn btn-sm btn-warning" onclick="markDone(this)">✔</button>
            <button class="btn btn-sm btn-danger" onclick="deleteTask(this)">✖</button>
        </div>
    `;

    taskList.appendChild(li);
    saveTasks();
    document.getElementById("task-input").value = "";
}

function markDone(button) {
    let task = button.parentElement.parentElement;
    task.classList.toggle("text-decoration-line-through");
    saveTasks();
}

function deleteTask(button) {
    let task = button.parentElement.parentElement;
    task.remove();
    saveTasks();
}

// Save Tasks to Local Storage
function saveTasks() {
    let tasks = [];
    document.querySelectorAll("#task-list li span").forEach(task => {
        tasks.push({ text: task.innerText, done: task.parentElement.classList.contains("text-decoration-line-through") });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load Tasks from Local Storage
function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let taskList = document.getElementById("task-list");
    
    tasks.forEach(taskData => {
        let li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        if (taskData.done) li.classList.add("text-decoration-line-through");
        
        li.innerHTML = `
            <span>${taskData.text}</span>
            <div>
                <button class="btn btn-sm btn-warning" onclick="markDone(this)">✔</button>
                <button class="btn btn-sm btn-danger" onclick="deleteTask(this)">✖</button>
            </div>
        `;
        
        taskList.appendChild(li);
    });
}
