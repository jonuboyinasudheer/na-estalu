import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// Your Firebase configuration
const firebaseConfig = {
    // KEEP YOUR EXISTING FIREBASE CONFIG HERE
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firestore
const db = getFirestore(app);


// Get the story form
const storyForm = document.getElementById("storyForm");


// Handle story publishing
storyForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    const title = document.getElementById("storyTitle").value.trim();

    const author = document.getElementById("author").value.trim();

    const category = document.getElementById("category").value;

    const imageUrl = document.getElementById("storyImage").value.trim();

    const content = document.getElementById("storyContent").value.trim();

    const message = document.getElementById("storyMessage");


    if (!title || !author || !category || !content) {

        message.style.color = "red";

        message.textContent = "Please fill in all required fields.";

        return;

    }


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

        message.textContent = "Story published successfully! 🎉";


        storyForm.reset();


    } catch (error) {

        console.error("Error:", error);

        message.style.color = "red";

        message.textContent = "Failed to publish story.";

    }

});