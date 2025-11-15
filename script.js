const validUsername = "demoUser";
const validPassword = "demoPass";

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === validUsername && password === validPassword) {
      const overlay = document.querySelector(".fade-overlay");
      overlay.classList.add("fade-active");
      setTimeout(() => {
        localStorage.setItem("username", username);
        window.location.href = "dashboard.html";
      }, 800);
    } else {
      alert("Incorrect username or password");
    }
  });
}

if (window.location.pathname.includes("dashboard.html")) {
  const user = localStorage.getItem("username");
  const welcomeText = document.getElementById("welcomeText");
  if (user && welcomeText) {
    welcomeText.textContent = `Welcome, ${user}!`;
  }

  const clock = document.getElementById("clock");
  if (clock) {
    setInterval(() => {
      const now = new Date();
      clock.textContent = now.toLocaleTimeString();
    }, 1000);
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      const overlay = document.querySelector(".fade-overlay");
      overlay.classList.add("fade-active");
      setTimeout(() => {
        localStorage.removeItem("username");
        window.location.href = "login.html";
      }, 800);
    });
  }
}
