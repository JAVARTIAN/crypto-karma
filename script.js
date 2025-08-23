// script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore, collection, query, orderBy, limit, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase Config (public client config is OK to expose)
const firebaseConfig = {
  apiKey: "AIzaSyA_tHYcbmAXx0gaZJJ-5NFNRk2RRq_J-uE",
  authDomain: "crypto-karma.firebaseapp.com",
  projectId: "crypto-karma",
  storageBucket: "crypto-karma.appspot.com",
  messagingSenderId: "693119383161",
  appId: "1:693119383161:web:217ff1ffe2efc0b80ac6a8"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Formatters
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
const fmtAmount = (amount, currency) => {
  if (currency === "USD") return usd.format(Number(amount || 0));
  // for crypto/other, show raw value + code
  return `${Number(amount || 0)} ${currency}`;
};

// 🔥 Realtime Leaderboard (top 10 by totalUSD)
(function mountLeaderboard() {
  const container = document.getElementById("leaderboard");
  container.textContent = "Loading...";

  const qLb = query(collection(db, "leaderboard"), orderBy("totalUSD", "desc"), limit(10));
  onSnapshot(qLb, (snap) => {
    container.innerHTML = "";
    let rank = 0;
    snap.forEach((doc) => {
      const d = doc.data();
      const badge = rank === 0 ? "🥇" : rank === 1 ? "🥈" : rank === 2 ? "🥉" : "";
      const row = document.createElement("div");
      row.className = rank < 3 ? "entry highlight" : "entry";
      row.innerHTML = `
        <span><span class="rank-badge">${badge}</span>${rank + 1}. ${d.name || "Anonymous"}</span>
        <span>💸 ${usd.format(Number(d.totalUSD || 0))}</span>
      `;
      container.appendChild(row);
      rank++;
    });
    if (rank === 0) container.textContent = "No donations yet.";
  });
})();

// ⚡ Realtime Live Feed (latest 5)
(function mountLiveFeed() {
  const container = document.getElementById("liveFeed");
  container.textContent = "Loading...";

  const qFeed = query(collection(db, "liveFeed"), orderBy("timestamp", "desc"), limit(5));
  onSnapshot(qFeed, (snap) => {
    container.innerHTML = "";
    if (snap.empty) {
      container.textContent = "Waiting for the first spark ⚡";
      return;
    }
    snap.forEach((doc) => {
      const d = doc.data();
      const item = document.createElement("div");
      item.className = "feed-item";
      item.innerHTML = `
        <span>${d.name || "Anonymous"}</span>
        <span>✨ Donated ${fmtAmount(d.amount, d.currency || "USD")}</span>
      `;
      container.appendChild(item);
    });
  });
})();

// 💭 Realtime Memory Wall (latest 5)
(function mountMemoryWall() {
  const container = document.getElementById("memoryWall");
  container.textContent = "Loading...";

  const qMem = query(collection(db, "memoryWall"), orderBy("timestamp", "desc"), limit(5));
  onSnapshot(qMem, (snap) => {
    container.innerHTML = "";
    if (snap.empty) {
      container.textContent = "No whispers yet.";
      return;
    }
    snap.forEach((doc) => {
      const d = doc.data();
      const msg = document.createElement("div");
      msg.className = "memory-message";
      const safeMsg = (d.message || "").toString().slice(0, 280);
      msg.innerHTML = `<span>${d.name || "Anonymous"}</span><span>“${safeMsg}”</span>`;
      container.appendChild(msg);
    });
  });
})();
