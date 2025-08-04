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

  snapshot.forEach(doc => {
    const data = doc.data();
    const row = document.createElement("div");
    row.innerHTML = `<strong>${data.name}</strong> – ${data.amount} ETH`;
    container.appendChild(row);
  });
}

// 🔁 Load Live Feed
async function loadLiveFeed() {
  const feedRef = collection(db, "liveFeed");
  const q = query(feedRef, orderBy("timestamp", "desc"), limit(5));
  const snapshot = await getDocs(q);

  const container = document.querySelector(".live-feed");
  const feedList = document.createElement("div");
  feedList.innerHTML = "<h2>Live Donation Feed</h2>";
  snapshot.forEach(doc => {
    const data = doc.data();
    const entry = document.createElement("div");
    entry.innerHTML = `<span>${data.name}</span> donated <strong>${data.amount}</strong> ETH`;
    feedList.appendChild(entry);
  });
  container.appendChild(feedList);
}

// 🧱 Load Memory Wall
async function loadMemoryWall() {
  const memoryRef = collection(db, "memoryWall");
  const q = query(memoryRef, orderBy("timestamp", "desc"), limit(5));
  const snapshot = await getDocs(q);

  const container = document.querySelector(".memory-wall");
  const wall = document.createElement("div");
  wall.innerHTML = "<h2>🕯 Memory Wall</h2>";
  snapshot.forEach(doc => {
    const data = doc.data();
    const message = document.createElement("div");
    message.innerHTML = `<span>${data.name}</span>: "<em>${data.message}</em>"`;
    wall.appendChild(message);
  });
  container.appendChild(wall);
}

document.getElementById("leaderboard")
document.getElementById("liveFeed")
document.getElementById("memoryWall")


// Run all
loadLeaderboard();
loadLiveFeed();
loadMemoryWall();
