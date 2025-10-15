  // Custom background image upload as button
  const bgBtn = document.getElementById('bg-upload-btn');
  const bgInput = document.getElementById('bg-upload');
  if (bgBtn && bgInput) {
    bgBtn.addEventListener('click', function() {
      bgInput.click();
    });
    bgInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          localStorage.setItem('customBg', evt.target.result);
          setCustomBackground(evt.target.result);
        };
        reader.readAsDataURL(file);
      }
    });
    // Load custom background if exists
    const savedBg = localStorage.getItem('customBg');
    if (savedBg) {
      setCustomBackground(savedBg);
    }
  }
// Custom background image logic
function setCustomBackground(imgData) {
  const section = document.querySelector('.coming-soon');
  if (section) {
    section.style.backgroundImage = `url('${imgData}')`;
    section.style.backgroundSize = 'cover';
    section.style.backgroundRepeat = 'no-repeat';
  }
}

function removeCustomBackground() {
  const section = document.querySelector('.coming-soon');
  if (section) {
    section.style.backgroundImage = '';
    section.style.backgroundSize = '';
    section.style.backgroundRepeat = '';
  }
}
// Confetti/Fireworks animation
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = 'block';
  const ctx = canvas.getContext('2d');
  const confettiCount = 150;
  const confetti = [];
  for (let i = 0; i < confettiCount; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * confettiCount,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      tilt: Math.random() * 10 - 10,
      tiltAngle: 0,
      tiltAngleIncremental: (Math.random() * 0.07) + 0.05
    });
  }
  let angle = 0;
  let tiltAngle = 0;
  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    angle += 0.01;
    tiltAngle += 0.1;
    for (let i = 0; i < confettiCount; i++) {
      let c = confetti[i];
      c.tiltAngle += c.tiltAngleIncremental;
      c.y += (Math.cos(angle + c.d) + 3 + c.r / 2) / 2;
      c.x += Math.sin(angle);
      c.tilt = Math.sin(c.tiltAngle - (i % 3)) * 15;
      ctx.beginPath();
      ctx.lineWidth = c.r;
      ctx.strokeStyle = c.color;
      ctx.moveTo(c.x + c.tilt + c.r / 3, c.y);
      ctx.lineTo(c.x + c.tilt, c.y + c.tilt + 10);
      ctx.stroke();
    }
    frame++;
    if (frame < 120) {
      requestAnimationFrame(draw);
    } else {
      canvas.style.display = 'none';
    }
  }
  draw();
}
// Theme switcher logic
function setTheme(theme) {
  document.body.classList.remove('light-theme', 'dark-theme');
  document.body.classList.add(theme + '-theme');
  localStorage.setItem('theme', theme);
}

function toggleTheme() {
  const current = localStorage.getItem('theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  setTheme(next);
}

// Get countdown date from localStorage or use default
function getCountdownDate() {
  const saved = localStorage.getItem('countdownDate');
  if (saved) {
    return new Date(saved).getTime();
  }
  // Default date if not set
  return new Date("Jan 1, 2026 00:00:00").getTime();
}

function setCountdownDate(dateStr) {
  localStorage.setItem('countdownDate', dateStr);
}

// Show/hide popup modal for countdown complete
function showPopup() {
  const popup = document.getElementById('countdown-popup');
  if (popup) {
    popup.style.display = 'flex';
  }
}

function hidePopup() {
  const popup = document.getElementById('countdown-popup');
  if (popup) {
    popup.style.display = 'none';
  }
}

let popupShown = false;
let lastSecond = null;

const countdown = () => {
  const countDate = getCountdownDate();
  const now = new Date().getTime();
  const remainingTime = countDate - now;

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Play ticking sound every second
  const tickAudio = document.getElementById('tick-audio');
  const completeAudio = document.getElementById('complete-audio');

  if (remainingTime <= 0) {
    document.querySelector(".day").innerText = 0;
    document.querySelector(".hour").innerText = 0;
    document.querySelector(".minute").innerText = 0;
    document.querySelector(".second").innerText = 0;
    // Stop ticking sound
    if (tickAudio) {
      tickAudio.pause();
      tickAudio.currentTime = 0;
    }
    if (!popupShown) {
      showPopup();
      // Sound toggle
      const soundOn = document.getElementById('toggle-sound')?.checked;
      if (soundOn && completeAudio) {
        completeAudio.currentTime = 0;
        completeAudio.play();
      }
      // Animation toggle
      const confettiOn = document.getElementById('toggle-confetti')?.checked;
      if (confettiOn) {
        launchConfetti();
      }
      popupShown = true;
    }
    return;
  } else {
    hidePopup();
    popupShown = false;
  }

  const textDay = Math.floor(remainingTime / day);
  const texthour = Math.floor((remainingTime % day) / hour);
  const textMinute = Math.floor((remainingTime % hour) / minute);
  const textSecond = Math.floor((remainingTime % minute) / second);

  document.querySelector(".day").innerText = textDay > 0 ? textDay : 0;
  document.querySelector(".hour").innerText = texthour > 0 ? texthour : 0;
  document.querySelector(".minute").innerText = textMinute > 0 ? textMinute : 0;
  document.querySelector(".second").innerText = textSecond > 0 ? textSecond : 0;

  // Only play tick if second changes
  if (lastSecond !== textSecond && tickAudio && remainingTime > 0) {
    const soundOn = document.getElementById('toggle-sound')?.checked;
    if (soundOn) {
      tickAudio.currentTime = 0;
      tickAudio.play();
    }
    lastSecond = textSecond;
  }
  // Accessibility: add ARIA labels and focus management
  document.getElementById('theme-switcher')?.setAttribute('aria-label', 'Switch between dark and light theme');
  document.getElementById('bg-upload-btn')?.setAttribute('aria-label', 'Set a custom background image');
  document.getElementById('toggle-sound')?.setAttribute('aria-label', 'Toggle countdown sounds');
  document.getElementById('toggle-confetti')?.setAttribute('aria-label', 'Toggle confetti animation');
  document.getElementById('countdown-form')?.setAttribute('aria-label', 'Set a custom countdown date and time');
}

// Handle form submission for custom date and theme switcher
window.addEventListener('DOMContentLoaded', function() {
  // Theme switcher setup
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);
  const themeBtn = document.getElementById('theme-switcher');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }

  const form = document.getElementById('countdown-form');
  const input = document.getElementById('date-input');
  const okBtn = document.getElementById('popup-ok-btn');
  if (form && input) {
    // Set input value to saved date if exists
    const saved = localStorage.getItem('countdownDate');
    if (saved) {
      // Convert to local datetime string for input
      const dt = new Date(saved);
      input.value = dt.toISOString().slice(0,16);
    }
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (input.value) {
  setCountdownDate(input.value);
  localStorage.setItem('countdownStart', new Date().toISOString());
  hidePopup();
  countdown();
      }
    });
  }
  if (okBtn) {
    okBtn.addEventListener('click', function() {
      hidePopup();
      popupShown = true;
    });
  }
  // Set countdown start if not set
  if (!localStorage.getItem('countdownStart')) {
    localStorage.setItem('countdownStart', new Date().toISOString());
  }
  countdown();
  setInterval(countdown, 500);
});