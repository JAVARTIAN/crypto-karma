// script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase Config
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

// 🚀 Load Leaderboard
async function loadLeaderboard() {
  const leaderboardRef = collection(db, "leaderboard");
  const q = query(leaderboardRef, orderBy("amount", "desc"), limit(10));
  const snapshot = await getDocs(q);

  const container = document.getElementById("leaderboard");
  container.innerHTML = "";

  snapshot.forEach((doc, index) => {
    const data = doc.data();
    const badge = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "";
    const row = document.createElement("div");
    row.className = index < 3 ? "entry highlight" : "entry";
    row.innerHTML = `<span><span class="rank-badge">${badge}</span>${index + 1}. ${data.name}</span><span>💸 ${data.amount} ETH</span>`;
    container.appendChild(row);
  });
}

// 🔁 Load Live Feed
async function loadLiveFeed() {
  const feedRef = collection(db, "liveFeed");
  const q = query(feedRef, orderBy("timestamp", "desc"), limit(5));
  const snapshot = await getDocs(q);

  const container = document.getElementById("liveFeed");
  container.innerHTML = "";

  snapshot.forEach(doc => {
    const data = doc.data();
    const entry = document.createElement("div");
    entry.className = "feed-item";
    entry.innerHTML = `<span>${data.name}</span><span>✨ Donated ${data.amount} ETH</span>`;
    container.appendChild(entry);
  });
}

// 🧱 Load Memory Wall
async function loadMemoryWall() {
  const memoryRef = collection(db, "memoryWall");
  const q = query(memoryRef, orderBy("timestamp", "desc"), limit(5));
  const snapshot = await getDocs(q);

  const container = document.getElementById("memoryWall");
  container.innerHTML = "";

  snapshot.forEach(doc => {
    const data = doc.data();
    const message = document.createElement("div");
    message.className = "memory-message";
    message.innerHTML = `<span>${data.name}</span><span>“${data.message}”</span>`;
    container.appendChild(message);
  });
}

// Run all
loadLeaderboard();
loadLiveFeed();
loadMemoryWall();
