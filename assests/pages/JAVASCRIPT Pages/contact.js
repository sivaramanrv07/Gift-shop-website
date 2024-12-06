const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const numberError = document.getElementById('numberError');
const messageError = document.getElementById('messageError');

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const numberInput = document.getElementById('number');
const messageInput = document.getElementById('message');

submitBtn.addEventListener('click', (event) => {
    event.preventDefault(); 

  
    nameError.textContent = '';
    emailError.textContent = '';
    numberError.textContent = '';
    messageError.textContent = '';

    let hasError = false;

    const nameRegex = /^[A-Za-z]{3,}(\s[A-Za-z]+)*$/;  

    let nameValue = nameInput.value.trim();
    if (!nameInput.value) {
        nameError.textContent = 'Please enter your name.';
        hasError = true;
    } else if (!nameRegex.test(nameValue)) {
        nameError.textContent = 'Please enter a valid name.';
        hasError = true;
    }

    if (!emailInput.value) {
        emailError.textContent = 'Please enter your email address.';
        hasError = true;
    } else if (!validateEmail(emailInput.value)) {
        emailError.textContent = 'Please enter a valid email address.';
        hasError = true;
    }

    const numberRegex = /^[0-9]{3}-?[0-9]{3}-?[0-9]{4}$/; 

    if (!numberInput.value) {
        numberError.textContent = 'Please enter your phone number.';
        hasError = true;
    } else if (!numberRegex.test(numberInput.value)) {
        numberError.textContent = 'Please enter a valid phone number.';
        hasError = true;
    }

    if (!messageInput.value) {
        messageError.textContent = 'Please enter a message.';
        hasError = true;
    }

    if (!hasError) {
        successMessage.style.display = 'block';

        nameInput.value = '';
        emailInput.value = '';
        numberInput.value = '';
        messageInput.value = '';

        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    }
});


function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
}
