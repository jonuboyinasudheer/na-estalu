import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    query,
    orderBy,
    deleteDoc,
    doc
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


const container =
    document.getElementById("manageStoriesContainer");


async function loadStories() {

    try {

        const storiesQuery = query(
            collection(db, "stories"),
            orderBy("createdAt", "desc")
        );


        const snapshot =
            await getDocs(storiesQuery);


        container.innerHTML = "";


        if (snapshot.empty) {

            container.innerHTML =
                "<p>No stories found.</p>";

            return;

        }


        snapshot.forEach((storyDoc) => {

            const story =
                storyDoc.data();


            const storyBox =
                document.createElement("div");


            storyBox.className =
                "story-card";


            storyBox.innerHTML = `

                <span class="story-type">
                    ${(story.category || "STORY").toUpperCase()}
                </span>

                <h3>
                    ${story.title || "Untitled Story"}
                </h3>

                <p>
                    Author:
                    ${story.author || "Unknown"}
                </p>

                <p>
                    ${story.content
                        ? story.content.substring(0, 150) + "..."
                        : ""
                    }
                </p>

                <div class="story-actions">

                    <a
                        href="../story.html?id=${storyDoc.id}"
                        target="_blank"
                    >
                        View
                    </a>

                    <a
                        href="edit-story.html?id=${storyDoc.id}"
                    >
                        Edit
                    </a>

                    <button
                        class="delete-btn"
                        data-id="${storyDoc.id}"
                    >
                        Delete
                    </button>

                </div>

            `;


            container.appendChild(storyBox);

        });


        addDeleteListeners();


    } catch (error) {

        console.error(
            "Error loading stories:",
            error
        );

        container.innerHTML =
            "<p>Unable to load stories.</p>";

    }

}


function addDeleteListeners() {

    const deleteButtons =
        document.querySelectorAll(".delete-btn");


    deleteButtons.forEach((button) => {

        button.addEventListener(
            "click",
            async function () {

                const storyId =
                    this.dataset.id;


                const confirmDelete =
                    confirm(
                        "Are you sure you want to delete this story?"
                    );


                if (!confirmDelete) {

                    return;

                }


                try {

                    await deleteDoc(
                        doc(
                            db,
                            "stories",
                            storyId
                        )
                    );


                    alert(
                        "Story deleted successfully."
                    );


                    loadStories();


                } catch (error) {

                    console.error(
                        "Delete error:",
                        error
                    );


                    alert(
                        "Failed to delete story."
                    );

                }

            }
        );

    });

}


loadStories();