let currentUser = null;

function updateUI() {
  if (currentUser) {
    document.getElementById("auth").style.display = "none";
    document.getElementById("game").style.display = "block";
    document.getElementById("userName").innerText = currentUser.username;
    document.getElementById("saldo").innerText = currentUser.balance;
    loadLeaderboard();
    loadHistory();
  }
}

function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Registrasi berhasil! Silakan login.");
      } else {
        alert(data.error || "Registrasi gagal.");
      }
    });
}

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        currentUser = data.user;
        updateUI();
      } else {
        alert(data.error || "Login gagal.");
      }
    });
}

function topup() {
  fetch("/api/topup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: currentUser.id })
  })
    .then(res => res.json())
    .then(() => {
      currentUser.balance += 1000;
      updateUI();
    });
}

function mainSlot() {
  const bet = parseInt(document.getElementById("slotBet").value);
  fetch("/api/slot", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: currentUser.id, bet })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert(data.error);
        return;
      }
      document.getElementById("slotHasil").innerText =
        data.reels.join(" ") + " — Menang: " + data.win;
      reloadUser();
    });
}

function mainRoulette() {
  const bet = parseInt(document.getElementById("rouletteBet").value);
  const guess = parseInt(document.getElementById("rouletteGuess").value);
  fetch("/api/roulette", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: currentUser.id, bet, guess })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert(data.error);
        return;
      }
      document.getElementById("rouletteHasil").innerText =
        "Hasil: " + data.result + " — Menang: " + data.win;
      reloadUser();
    });
}

function reloadUser() {
  fetch(`/api/me/${currentUser.id}`)
    .then(res => res.json())
    .then(data => {
      currentUser = data.user;
      document.getElementById("saldo").innerText = currentUser.balance;
      loadHistory();
    });
}

function loadLeaderboard() {
  fetch("/api/leaderboard")
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("leaderboard");
      list.innerHTML = "";
      data.leaderboard.forEach(player => {
        const li = document.createElement("li");
        li.innerText = `${player.username}: ${player.balance}`;
        list.appendChild(li);
      });
    });
}

function loadHistory() {
  fetch(`/api/me/${currentUser.id}`)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("riwayat");
      list.innerHTML = "";
      data.history.forEach(h => {
        const li = document.createElement("li");
        li.innerText = `${h.game} - Bet: ${h.bet}, Hasil: ${h.result}, Menang: ${h.win}`;
        list.appendChild(li);
      });
    });
}
