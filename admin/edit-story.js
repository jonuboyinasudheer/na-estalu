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


const form =
    document.getElementById("editStoryForm");

const message =
    document.getElementById("storyMessage");


const titleInput =
    document.getElementById("storyTitle");

const authorInput =
    document.getElementById("author");

const categoryInput =
    document.getElementById("category");

const imageInput =
    document.getElementById("storyImage");

const contentInput =
    document.getElementById("storyContent");


const params =
    new URLSearchParams(window.location.search);

const storyId =
    params.get("id");


/* =========================
   CLEAN STORY HTML
========================= */

function cleanStoryHTML(html) {

    if (!html) {
        return "";
    }


    let cleaned = html;


    /*
        Convert old encoded spaces
        into normal spaces.
    */

    cleaned =
        cleaned
            .replace(/&amp;nbsp;/gi, " ")
            .replace(/&nbsp;/gi, " ")
            .replace(/&#160;/gi, " ")
            .replace(/&#xA0;/gi, " ");


    /*
        Remove actual non-breaking spaces.
    */

    cleaned =
        cleaned.replace(/\u00A0/g, " ");


    /*
        Remove incorrect </br> tags.
    */

    cleaned =
        cleaned.replace(/<\/br>/gi, "");


    /*
        Remove empty formatting tags.
    */

    cleaned =
        cleaned.replace(
            /<(b|strong|i|em|u)>\s*<\/\1>/gi,
            ""
        );


    /*
        Remove <b> or <strong> around
        "తొలి చినుకు" if the user has
        removed the bold formatting.

        This also handles:
        <b>తొలి చినుకు</b>
        <strong>తొలి చినుకు</strong>
    */

    cleaned =
        cleaned.replace(
            /<(b|strong)>\s*తొలి\s*చినుకు\s*<\/\1>/gi,
            "తొలి చినుకు"
        );


    /*
        Remove unnecessary spaces
        around <br>.
    */

    cleaned =
        cleaned.replace(
            /\s*<br\s*\/?>\s*/gi,
            "<br>"
        );


    /*
        Remove excessive consecutive <br> tags.
    */

    cleaned =
        cleaned.replace(
            /(<br>){3,}/gi,
            "<br><br>"
        );


    return cleaned.trim();

}


/* =========================
   LOAD STORY
========================= */

async function loadStory() {

    if (!storyId) {

        message.style.color = "red";

        message.textContent =
            "No story selected.";

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


        /* =========================
           LOAD NORMAL FIELDS
        ========================= */

        titleInput.value =
            story.title || "";

        authorInput.value =
            story.author || "";

        categoryInput.value =
            story.category || "";

        imageInput.value =
            story.imageUrl || "";


        /* =========================
           LOAD STORY CONTENT
        ========================= */

        const cleanedContent =
            cleanStoryHTML(
                story.content || ""
            );


        contentInput.innerHTML =
            cleanedContent;


    } catch (error) {

        console.error(error);

        message.style.color = "red";

        message.textContent =
            "Unable to load story.";

    }

}


/* =========================
   UPDATE STORY
========================= */

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        if (!storyId) {

            message.style.color = "red";

            message.textContent =
                "No story selected.";

            return;
        }


        try {

            /*
                Get the current editor HTML.
            */

            let storyContent =
                contentInput.innerHTML.trim();


            /*
                Clean the HTML before saving.
            */

            storyContent =
                cleanStoryHTML(
                    storyContent
                );


            /*
                Put the cleaned content
                back into the editor.
            */

            contentInput.innerHTML =
                storyContent;


            /*
                Save the cleaned content
                to Firebase.
            */

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
                        storyContent

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

    }
);


/* =========================
   START
========================= */

loadStory();