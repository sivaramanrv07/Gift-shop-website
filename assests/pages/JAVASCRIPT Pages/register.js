
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyB7kXFcOV36N971sxqmGn0P0mYVwfs4TPM",
  authDomain: "laddu-studio.firebaseapp.com",
  projectId: "laddu-studio",
  storageBucket: "laddu-studio.firebasestorage.app",
  messagingSenderId: "176899256515",
  appId: "1:176899256515:web:9bd7113f4a732131be7276",
  measurementId: "G-0W7R833RLQ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

const name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("c-password");

const nameerror = document.getElementById("name-error");
const emailerror = document.getElementById("email-error");
const passworderror = document.getElementById("password-error");
const cpasserror = document.getElementById("c-password-error");

const btn = document.getElementById("register");
const form = document.getElementById("form");

const minlength = 8;
const hasNumber = /[0-9]/;
const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

form.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the form from submitting the traditional way
    nameerror.textContent = "";
    emailerror.textContent = "";
    passworderror.textContent = "";
    cpasserror.textContent = "";
    
    let valid = true;

    if (name.value.length === 0) {
        nameerror.textContent = "Username required";
        valid = false;
    }
     else if(name.value.length<4){
        nameerror.textContent = "Username must be at least 4 characters long.";
        valid = false;
    }
 else if (/^\d+$/.test(name.value)) {  // Check if the username consists of only digits
    nameerror.textContent = "Username cannot be just numbers.";
    valid = false;
}
    if (email.value.length === 0) {
        emailerror.textContent = "Email required";
        valid = false;
    } else if (!validateEmail(email.value)) {
        emailerror.textContent = "Please enter a valid email";
        valid = false;
    }
    if (password.value.length === 0) {
        passworderror.textContent = "Password required";
        valid = false;
    } else if (password.value.length < minlength) {
        passworderror.textContent = `Password must be at least ${minlength} characters long.`;
        valid = false;
    }
    else if(!hasNumber.test(password.value)){
        passworderror.textContent = "Password must contain at least one number.";
        valid = false;
        }
        else if(!hasSpecialChar.test(password.value)){
        passworderror.textContent = "Password must contain atleast one special character.";
        valid = false;
        }

    else if (/\s/.test(password.value)) {  // Check for spaces
        passworderror.textContent = "Password cannot contain spaces.";
        valid = false;
    }
    if (confirmPassword.value !== password.value) {
        cpasserror.textContent = "Passwords do not match";
        valid = false;
    }
    

    if (valid) {
        const emailValue = email.value;
        const passwordValue = password.value;
        
        btn.disabled = true;
        btn.innerText = 'Creating account...';

        // Disable input fields while the user is being created
        name.disabled = true;
        email.disabled = true;
        password.disabled = true;
        confirmPassword.disabled = true;

        createUserWithEmailAndPassword(auth, emailValue, passwordValue)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('Sign Up successful:', user);
                
                form.reset();
                btn.disabled = false;
                btn.innerText = 'Create an account';
                // Re-enable input fields after the process
                name.disabled = false;
                email.disabled = false;
                password.disabled = false;
                confirmPassword.disabled = false;
                
                window.location.href="../../../index.html";
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                
                if (errorCode === 'auth/email-already-in-use') {
                    emailerror.textContent = 'This email is already registered.';
                } else if (errorCode === 'auth/weak-password') {
                    passworderror.textContent = 'Password should be at least 6 characters long.';
                } else {
                    emailerror.textContent = errorMessage;
                }

                console.error('Error during sign up:', errorCode, errorMessage);
                btn.disabled = false;
                btn.innerText = 'Create an account';
                name.disabled = false;
                email.disabled = false;
                password.disabled = false;
                confirmPassword.disabled = false;
            });
    }
});

name.addEventListener("input", () => nameerror.textContent = '');
email.addEventListener("input", () => emailerror.textContent = '');
password.addEventListener("input", () => passworderror.textContent = '');
confirmPassword.addEventListener("input", () => cpasserror.textContent = '');

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

    if (!re.test(String(email).toLowerCase())) {
        return false;
    }

 
    const domainPart = email.split('@')[1];
    const domainName = domainPart.split('.')[0]; 
    if (/^\d/.test(domainName)) {
        return false; 
    }

    return true; 
};
