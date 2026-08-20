import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
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


const storyForm = document.getElementById("storyForm");


if (storyForm) {

    storyForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        const title =
            document.getElementById("storyTitle").value.trim();

        const author =
            document.getElementById("author").value.trim();

        const category =
            document.getElementById("category").value;

        const imageUrl =
            document.getElementById("storyImage").value.trim();

       const content =
    document.getElementById("storyContent").value.trim();
        const message =
            document.getElementById("storyMessage");


        try {

            await addDoc(collection(db, "stories"), {

                title: title,
                author: author,
                category: category,
                imageUrl: imageUrl,
                content: content,
                createdAt: serverTimestamp()

            });


            message.style.color = "green";

            message.textContent =
                "Story published successfully! 🎉";


            storyForm.reset();


        } catch (error) {

            console.error(error);

            message.style.color = "red";

            message.textContent =
                "Failed to publish story.";

        }

    });

}