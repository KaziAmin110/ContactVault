//http://localhost/swagger-ui

const form = document.querySelector('.sign-in-form');

const url = new URL(window.location.href);
const hostname = url.hostname;
const port = url.port;
const urlBase = url.protocol + '//' + (port ? `${hostname}:${port}` : hostname);

const extension = 'php';
const usernameRegex = /^[a-zA-Z0-9_]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

	if (emailRegex.test(email)) {
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
	//if the user has input a field incorrectly, message will let the user know what is wrong
	/*
	let message = "";

	let first_name = document.getElementById("first-name").value;
	let last_name = document.getElementById("last-name").value;
	let email = document.getElementById("email").value;
	let userName = document.getElementById("user-name").value;
	let password = document.getElementById("password").value

	if (first_name.length == 0) {
		message += "First name cannot be empty<br>";
	}

	if (last_name.length == 0) {
		message += "Last name cannot be empty<br>";
	}

	if (!usernameRegex.test(userName)) {
		message += "Invalid username<br>";
		message += "please make sure the username is between 3-20 characters and has only numbers, letters, and _<br>";
	}

	if (!emailRegex.test(email)) {
		message += "Invalid email<br>";
	}

	let passReq = isValidPassword(password);

	if (passReq != "") {
		message += passReq + "<br>";
	}
	
	console.log("done validating register: "+message);
	return message;
	*/
}

//not complete
function register() {

	let first_name = document.getElementById("first-name").value;
	let last_name = document.getElementById("last-name").value;
	let email = document.getElementById("email").value;
	let userName = document.getElementById("user-name").value;
	let password = document.getElementById("password").value

	//needs to be updated to use google needs updating
	let tmp = { authentication_provider: "USERNAME_PASSWORD", username: userName, password: password, first_name:first_name,last_name:last_name };

	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + "/api/register." + extension;

	let xhr = new XMLHttpRequest();

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function () {

		if(this.readyState == 4){ //ensure the request is complete
			if (this.status == 200) {
				
				//creating cookie
				jsonObject=JSON.parse(this.responseText);
				Cookies.remove('jwtToken');
				Cookies.set('jwtToken', jsonObject.token, {expires: 1, secure: true, sameSite:'strict'});

				Cookies.remove("userId");
				Cookies.set("userId",jsonObject.user_id), {expires: 1, secure: true, sameSite:'strict'};

				window.location.href = "../contacts-page/index.html";
				///workspaces/contact-manager/app/src/contacts-page/index.html
				///workspaces/contact-manager/app/src/js/signUpAuth.js
			}
			else {
				if(this.status==400)
					console.log("ERROR 400: Username is taken");

				if(this.status==500){
					console.log("ERROR 500");
				}
			}
		}
	};
		xhr.send(jsonPayload);
	}
	catch (err) {
		jsonObject=JSON.parse(this.responseText);
		console.log(jsonObject.error);
	}
}

form.addEventListener('submit', function signUp(e) {
	e.preventDefault();
	let res = isValidRegister();

	//document.getElementById("validRegisterResult").value = res;

	if (res == "")
		register();
});