const username = document.querySelector('#user-name');
const password = document.querySelector('#password');
const form = document.querySelector('.sign-in-form');
const userForm = document.querySelector('.username');
const passForm = document.querySelector('.password');

function isValidPassword(password) {
	console.log("validating password:");
	let passwordRequieres = "";

	const minLength = 8;

	const hasUppercase = /[A-Z]/.test(password);
	const hasLowercase = /[a-z]/.test(password);
	const hasNumber = /[0-9]/.test(password);
	const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

	const isValidLength = password.length >= minLength;

	if (!isValidLength)
		passwordRequieres += "Password must be atleast 8 characters long<br>"
	if (!hasUppercase)
		passwordRequieres += "Password must contain atleast 1 uppercase<br>"
	if (!hasLowercase)
		passwordRequieres += "Password must contain atleast 1 lowercase<br>"
	if (!hasNumber)
		passwordRequieres += "Password must contain atleast 1 number<br>"
	if (!hasSpecialChar)
		passwordRequieres += "Password must contain atleast 1 special character<br>"

	console.log("done validating password: "+passwordRequieres);
	return passwordRequieres;
}

function isValidEmail(email) {
	console.log("validating email:");
	let emailRequieres = "";

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (!emailRegex.test(email)) {
		emailRequieres += "Please enter a valid email address.<br>";
	}

	console.log("done validating email: " + emailRequieres);
	return emailRequieres;
}

function isValidRegister() {
	console.log("validating register");
	var isValid = true;

    var firstName = document.getElementById('first-name');
    var lastName = document.getElementById('last-name');
    var email = document.getElementById('email');
    var userName = document.getElementById('user-name');
    var password = document.getElementById('password');
    var checkBox = document.getElementById('exampleCheck1');
    var passwordFeedback = document.getElementById('password-feedback');

    if (!firstName.value) {
        isValid = false;
        firstName.classList.add('is-invalid');
    } else {
        firstName.classList.remove('is-invalid');
        firstName.classList.add('is-valid');
    }

    if (!lastName.value) {
        isValid = false;
        lastName.classList.add('is-invalid');
    } else {
        lastName.classList.remove('is-invalid');
        lastName.classList.add('is-valid');
    }

    var emailValidationMessage = isValidEmail(email.value);
    if (emailValidationMessage) {
        isValid = false;
        email.classList.add('is-invalid');
        emailFeedback.innerHTML = emailValidationMessage;
    } else {
        email.classList.remove('is-invalid');
        email.classList.add('is-valid');
        emailFeedback.innerHTML = "";
    }

    if (!userName.value) {
        isValid = false;
        userName.classList.add('is-invalid');
    } else {
        userName.classList.remove('is-invalid');
        userName.classList.add('is-valid');
    }

    var passwordValidationMessage = isValidPassword(password.value);
    if (passwordValidationMessage) {
        isValid = false;
        password.classList.add('is-invalid');
        passwordFeedback.innerHTML = passwordValidationMessage;
    } else {
        password.classList.remove('is-invalid');
        password.classList.add('is-valid');
        passwordFeedback.innerHTML = "";
    }

    if (!checkBox.checked) {
        isValid = false;
        checkBox.classList.add('is-invalid');
    } else {
        checkBox.classList.remove('is-invalid');
        checkBox.classList.add('is-valid');
    }

	return isValid;
}
const clearElements = () => {
    const usernameDiv = document.querySelector('.usernameDiv');
    const passwordDiv = document.querySelector('.passwordDiv');

    if (usernameDiv) {
        userForm.removeChild(usernameDiv);
    }
        
    
    if (passwordDiv) {
        passForm.removeChild(passwordDiv);
    }        
}


form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearElements();
    
    let numbers = /[0-9]/g;
    let letters = /[a-zA-Z]/g;
    let special = /[!@#$%^&*]/g;

    // const div = document.createElement('div');
    // div.classList.add('invalid-feedback');
    
    // Username Validation (Must be between 3 and 20 characters)
    if (username.value.length >= 3 && username.value.length <= 20) {
        console.log("Username Valid");

        const div = document.createElement('div');
        div.classList.add('usernameDiv');
        div.classList.add('valid-feedback');
        div.textContent = "Looks Good!";

        if (username.classList.contains('is-invalid'))
            username.classList.remove('is-invalid');
        
        username.classList.add("is-valid");
        userForm.appendChild(div);
    }
    else {
        console.log("Username Invalid")
        
        const div = document.createElement('div');
        div.classList.add('usernameDiv');
        div.classList.add('invalid-feedback');
        div.textContent = "Invalid Username : Username must be between 3 and 20 Characters";

        if (username.classList.contains('is-valid'))
            username.classList.remove('is-valid');

        username.classList.add("is-invalid");
        userForm.appendChild(div);
    }


    // Password Validation Must Contain atleast 8 characters and atleast one number and special character
    if (password.value.length >= 8 && password.value.match(numbers) && password.value.match(letters) && password.value.match(special)) {
        console.log("Password Valid");

        const div = document.createElement('div');
        div.classList.add('passwordDiv');
        div.classList.add('valid-feedback');
        div.textContent = "Looks Good!";

        passForm.appendChild(div);

        if (password.classList.contains('is-invalid'))
            password.classList.remove('is-invalid');

        password.classList.add("is-valid");
    }


    else {
        console.log("Password Invalid");

        const div = document.createElement('div');
        div.classList.add('passwordDiv');
        div.classList.add('invalid-feedback');
        div.textContent = "Invalid Password : Password must contain atleast 8 characters, 1 number, and 1 special character";

        if (password.classList.contains('is-valid'))
            password.classList.remove('is-valid');

        password.classList.add("is-invalid");
        passForm.appendChild(div);
    }        
})