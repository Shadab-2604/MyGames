let timer;
let timeRemaining;
let isRunning = false;
let totalChars = 0;
let correctChars = 0;

// Sentences grouped by categories
const sentences = {
  motivational: [
    "Believe you can and you're halfway there.",
    "Success is not final; failure is not fatal.",
    "What we think, we become."
  ],
  programming: [
    "JavaScript is the language of the web.",
    "Debugging is like being the detective in a crime drama.",
    "Code is like humor. When you have to explain it, it’s bad."
  ],
  nature: [
    "The earth laughs in flowers.",
    "The mountains are calling and I must go.",
    "In every walk with nature, one receives far more than he seeks."
  ]
};

// Disable pull-to-refresh
document.addEventListener('touchmove', (e) => {
  if (e.touches[0].pageY > 0 && window.scrollY === 0) {
    e.preventDefault();
  }
}, { passive: false });


// Get a random sentence
function getRandomSentence() {
  const categories = Object.keys(sentences);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const randomSentence = sentences[randomCategory][Math.floor(Math.random() * sentences[randomCategory].length)];
  return randomSentence;
}

const customText = document.getElementById("customText");
const textDisplay = document.getElementById("text-display");
const textInput = document.getElementById("text-input");

// Set timer buttons
document.querySelectorAll(".timer-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (isRunning) return;
    timeRemaining = parseInt(btn.dataset.time);
    startTest();
  });
});

// Start the test
function startTest() {
  const customTextValue = customText.value.trim();
  textDisplay.textContent = customTextValue || getRandomSentence();
  textInput.disabled = false;
  textInput.focus();
  totalChars = 0;
  correctChars = 0;
  isRunning = true;
  textInput.value = "";

  timer = setInterval(() => {
    timeRemaining--;
    if (timeRemaining === 0) {
      endTest();
    }
  }, 1000);
}

// End the test
function endTest() {
    clearInterval(timer);
    isRunning = false;
    textInput.disabled = true;
  
    const typedText = textInput.value.trim();
    const originalText = textDisplay.textContent.trim();
  
    // Calculate elapsed time
    const elapsedTime = timeRemaining ? timeRemaining : 0; // Time left when user finishes
    const totalTime = parseInt(document.querySelector(".timer-btn.active")?.dataset.time || "60"); // Total selected time
    const timeUsed = totalTime - elapsedTime; // Time used in seconds
  
    // Calculate WPM based on characters
    const timeUsedMinutes = timeUsed / 60;
    const wpm = Math.round((totalChars / 5) / timeUsedMinutes) || 0;
  
    // Calculate Accuracy
    const accuracy = Math.round(((correctChars / totalChars) * 100) || 0);
  
    // Save results in localStorage
    localStorage.setItem("wpm", wpm);
    localStorage.setItem("accuracy", accuracy);
    localStorage.setItem("chars", totalChars);
  
    // Redirect to results page
    window.location.href = "result.html";
  }
  
  

// Input event listener
textInput.addEventListener("input", (e) => {
  const typedValue = e.target.value.trim();
  const originalText = textDisplay.textContent.trim();
  totalChars = typedValue.length;

  // Check if the typed text matches the original text
  if (typedValue === originalText) {
    endTest(); // End the test early if the user completes the sentence
  }

  // Calculate the number of correct characters
  correctChars = [...typedValue].filter((char, idx) => char === originalText[idx]).length;
});
