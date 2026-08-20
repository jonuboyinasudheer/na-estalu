import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    query,
    orderBy,
    deleteDoc,
    doc,
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


const container =
    document.getElementById("manageStoriesContainer");


// ===============================
// CLEAN STORY CONTENT
// ===============================

function cleanPreview(content) {

    if (!content) {
        return "";
    }

    const temp =
        document.createElement("div");

    temp.innerHTML = content;

    let text =
        temp.textContent ||
        temp.innerText ||
        "";

    text = text
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;nbsp;/gi, " ")
        .replace(/&#160;/gi, " ")
        .replace(/&#xA0;/gi, " ")
        .replace(/\u00A0/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    return text;
}


// ===============================
// LOAD STORIES
// ===============================

async function loadStories() {

    try {

        console.log("Loading stories...");


        const storiesQuery =
            query(
                collection(db, "stories"),
                orderBy("createdAt", "desc")
            );


        const snapshot =
            await getDocs(storiesQuery);


        console.log(
            "Stories found:",
            snapshot.size
        );


        container.innerHTML = "";


        if (snapshot.empty) {

            container.innerHTML = `

                <div class="story-card">

                    <h3>
                        No Stories Found
                    </h3>

                    <p>
                        You have not published any stories yet.
                    </p>

                </div>

            `;

            return;
        }


        snapshot.forEach((storyDoc) => {

            const story =
                storyDoc.data();


            const storyBox =
                document.createElement("div");


            storyBox.className =
                "story-card";


            const preview =
                cleanPreview(
                    story.content
                );


            storyBox.innerHTML = `

                <span class="story-type">

                    ${(story.category || "STORY").toUpperCase()}

                </span>


                <h3>

                    ${story.title || "Untitled Story"}

                </h3>


                <p>

                    <strong>Author:</strong>
                    ${story.author || "Unknown"}

                </p>


                <p>

                    ${
                        preview
                            ? preview.substring(0, 150) + "..."
                            : "No story preview available."
                    }

                </p>


                ${
                    story.imageUrl

                    ?

                    `
                    <div style="margin:15px 0;">

                        <img
                            src="${story.imageUrl}"
                            alt="Story Image"
                            style="
                                width:180px;
                                height:120px;
                                object-fit:cover;
                                border-radius:8px;
                                display:block;
                                margin-bottom:10px;
                            "
                        >

                        <p style="margin:0 0 8px 0;">
                            Current Story Image
                        </p>

                    </div>
                    `

                    :

                    `
                    <p style="color:#888;">
                        No image added yet.
                    </p>
                    `
                }


                <!-- IMAGE CHOOSER -->

                <div
                    style="
                        margin:15px 0;
                        padding:12px;
                        border:1px solid #ddd;
                        border-radius:8px;
                    "
                >

                    <label
                        style="
                            display:block;
                            margin-bottom:8px;
                            font-weight:bold;
                        "
                    >
                        Story Image
                    </label>


                    <input
                        type="file"
                        class="story-image-input"
                        data-id="${storyDoc.id}"
                        accept="image/*"
                    >


                    <p
                        class="image-status"
                        data-status="${storyDoc.id}"
                        style="
                            margin:8px 0 0 0;
                            font-size:14px;
                        "
                    ></p>

                </div>


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


            container.appendChild(
                storyBox
            );

        });


        addDeleteListeners();

        addImageUploadListeners();


    } catch (error) {

        console.error(
            "ERROR LOADING STORIES:",
            error
        );


        container.innerHTML = `

            <div class="story-card">

                <h3>
                    Unable to Load Stories
                </h3>

                <p>
                    ${error.message}
                </p>

                <p>
                    Open F12 → Console to see the error.
                </p>

            </div>

        `;

    }

}


// ===============================
// IMAGE UPLOAD
// ===============================

function addImageUploadListeners() {

    const imageInputs =
        document.querySelectorAll(
            ".story-image-input"
        );


    imageInputs.forEach((input) => {

        input.addEventListener(
            "change",
            async function () {

                const imageFile =
                    this.files[0];


                const storyId =
                    this.dataset.id;


                if (!imageFile) {

                    return;

                }


                const status =
                    document.querySelector(
                        `.image-status[data-status="${storyId}"]`
                    );


                try {

                    status.style.color =
                        "#555";

                    status.textContent =
                        "Uploading image...";


                    // =========================
                    // CLOUDINARY UPLOAD
                    // =========================

                    const formData =
                        new FormData();


                    formData.append(
                        "file",
                        imageFile
                    );


                    formData.append(
                        "upload_preset",
                        "na_estalu_images"
                    );


                    formData.append(
                        "folder",
                        "na-estalu"
                    );


                    const response =
                        await fetch(
                            "https://api.cloudinary.com/v1_1/drkbvxed/image/upload",
                            {
                                method: "POST",
                                body: formData
                            }
                        );


                    const data =
                        await response.json();


                    if (!response.ok) {

                        console.error(
                            "Cloudinary error:",
                            data
                        );

                        throw new Error(
                            data.error?.message ||
                            "Image upload failed."
                        );

                    }


                    const imageUrl =
                        data.secure_url;


                    console.log(
                        "Image uploaded:",
                        imageUrl
                    );


                    // =========================
                    // UPDATE EXISTING STORY
                    // =========================

                    await updateDoc(

                        doc(
                            db,
                            "stories",
                            storyId
                        ),

                        {
                            imageUrl:
                                imageUrl
                        }

                    );


                    status.style.color =
                        "green";


                    status.textContent =
                        "Image added successfully ✓";


                    // Reload stories so the new image appears

                    setTimeout(
                        () => {
                            loadStories();
                        },
                        1000
                    );


                } catch (error) {

                    console.error(
                        "IMAGE UPLOAD ERROR:",
                        error
                    );


                    status.style.color =
                        "red";


                    status.textContent =
                        "Failed to upload image: " +
                        error.message;

                }

            }
        );

    });

}


// ===============================
// DELETE STORIES
// ===============================

function addDeleteListeners() {

    const buttons =
        document.querySelectorAll(
            ".delete-btn"
        );


    buttons.forEach((button) => {

        button.addEventListener(
            "click",
            async function () {

                const storyId =
                    this.dataset.id;


                const confirmed =
                    confirm(
                        "Are you sure you want to delete this story?"
                    );


                if (!confirmed) {

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
                        "DELETE ERROR:",
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


// ===============================
// START
// ===============================

loadStories();