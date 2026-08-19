import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


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

const auth = getAuth(app);


const loginForm =
    document.getElementById("loginForm");

const loginMessage =
    document.getElementById("loginMessage");


loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    const email =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;


    loginMessage.style.color = "#888";

    loginMessage.textContent =
        "Logging in...";


    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );


        loginMessage.style.color = "green";

        loginMessage.textContent =
            "Login successful!";


        setTimeout(() => {

            window.location.href =
                "dashboard.html";

        }, 500);


    } catch (error) {

        console.error(error);

        loginMessage.style.color = "red";

        loginMessage.textContent =
            "Invalid email or password.";

    }

});