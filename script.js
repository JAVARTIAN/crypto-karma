// script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA_tHYcbmAXx0gaZJJ-5NFNRk2RRq_J-uE",
  authDomain: "crypto-karma.firebaseapp.com",
  projectId: "crypto-karma",
  storageBucket: "crypto-karma.appspot.com",
  messagingSenderId: "693119383161",
  appId: ""
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fetch leaderboard data
async function loadLeaderboard() {
  const leaderboardRef = collection(db, "leaderboard");
  const q = query(leaderboardRef, orderBy("amount", "desc"), limit(10));
  const querySnapshot = await getDocs(q);

  const container = document.getElementById("leaderboard");
  container.innerHTML = ""; // Clear old data

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const row = document.createElement("div");
    row.innerHTML = `<strong>${data.name}</strong> – ${data.amount} ETH`;
    container.appendChild(row);
  });
}

loadLeaderboard();
