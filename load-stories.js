console.log("Na Istalu stories.js is working!");
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyCtU4kBKmDWQWt72tJk96EKuLvH2MLq5JU",
    authDomain: "na-estalu.firebaseapp.com",
    projectId: "na-estalu",
    storageBucket: "na-estalu.firebasestorage.app",
    messagingSenderId: "790933220074",
    appId: "1:790933220074:web:6768a0a86547e786a78593",
    measurementId: "G-G94D1ZGPKK"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const storiesContainer =
    document.getElementById("storiesContainer");


async function loadStories() {

    try {

        const storiesQuery = query(
            collection(db, "stories"),
            orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(storiesQuery);

        storiesContainer.innerHTML = "";


        if (snapshot.empty) {

            storiesContainer.innerHTML =
                "<p>No stories published yet.</p>";

            return;
        }


        snapshot.forEach((doc) => {

            const story = doc.data();

            const card = document.createElement("div");

            card.className = "story-card";


            card.innerHTML = `

                <span class="story-type">
                    ${story.category || "STORY"}
                </span>

                <h3>
                    ${story.title || "Untitled Story"}
                </h3>

                <p>
                    ${story.content
                        ? story.content.substring(0, 120) + "..."
                        : "Read this beautiful story on Na Istalu."
                    }
                </p>

                <a href="story.html?id=${doc.id}">
                    Read Story →
                </a>

            `;


            storiesContainer.appendChild(card);

        });


    } catch (error) {

        console.error("Error loading stories:", error);

        storiesContainer.innerHTML =
            "<p>Unable to load stories.</p>";

    }

}


loadStories();