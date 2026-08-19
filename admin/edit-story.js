import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore,
    doc,
    getDoc,
    updateDoc
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


const form = document.getElementById("editStoryForm");

const message = document.getElementById("storyMessage");


const titleInput = document.getElementById("storyTitle");

const authorInput = document.getElementById("author");

const categoryInput = document.getElementById("category");

const imageInput = document.getElementById("storyImage");

const contentInput = document.getElementById("storyContent");


const params = new URLSearchParams(window.location.search);

const storyId = params.get("id");


async function loadStory() {

    if (!storyId) {

        message.style.color = "red";

        message.textContent = "No story selected.";

        form.style.display = "none";

        return;
    }


    try {

        const storyRef = doc(
            db,
            "stories",
            storyId
        );


        const storySnapshot =
            await getDoc(storyRef);


        if (!storySnapshot.exists()) {

            message.style.color = "red";

            message.textContent =
                "Story not found.";

            form.style.display = "none";

            return;
        }


        const story =
            storySnapshot.data();


        titleInput.value =
            story.title || "";

        authorInput.value =
            story.author || "";

        categoryInput.value =
            story.category || "";

        imageInput.value =
            story.imageUrl || "";

        contentInput.value =
            story.content || "";


    } catch (error) {

        console.error(error);

        message.style.color = "red";

        message.textContent =
            "Unable to load story.";

    }

}


form.addEventListener("submit", async function (event) {

    event.preventDefault();


    try {

        await updateDoc(

            doc(
                db,
                "stories",
                storyId
            ),

            {

                title:
                    titleInput.value.trim(),

                author:
                    authorInput.value.trim(),

                category:
                    categoryInput.value,

                imageUrl:
                    imageInput.value.trim(),

                content:
                    contentInput.value.trim()

            }

        );


        message.style.color = "green";

        message.textContent =
            "Story updated successfully! 🎉";


    } catch (error) {

        console.error(error);

        message.style.color = "red";

        message.textContent =
            "Failed to update story.";

    }

});


loadStory();