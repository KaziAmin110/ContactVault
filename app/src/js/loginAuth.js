const form = document.querySelector('.sign-in-form');
const url = new URL(window.location.href);
const hostname = url.hostname;
const port = url.port;
const urlBase = url.protocol + '//' + (port ? `${hostname}:${port}` : hostname);
const extension = 'php';
const usernameRegex = /^[a-zA-Z0-9_]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;



function isValidPassword(password) {

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

	return passwordRequieres;
}

function isValidRegister() {

	//if the user has input a field incorrectly, message will let the user know what is wrong
	let message = "";

	let first_name = document.getElementById("first-name").value;
	let last_name = document.getElementById("last-name").value;
	let email = document.getElementById("email").value;
	let userName = document.getElementById("user-name").value;
	let password = document.getElementById("password").value

	if (first_name.length == 0) {
		message += "First name cannot be empty<br>";
		flag = false;
	}

	if (last_name.length == 0) {
		message += "Last name cannot be empty<br>";
		flag = false;
	}

	if (!usernameRegex.test(userName)) {
		message += "Invalid username<br>";
		message += "please make sure the username is between 3-20 characters and has only numbers, letters, and _<br>";
		flag = false;
	}

	if (!emailRegex.test(email)) {
		message += "Invalid email<br>";
		flag = false;
	}

	let passReq = isValidPassword(password);

	if (passReq != "") {
		message += passReq + "<br>";
		flag = false;
	}

	return message;
}

//not complete
function register() {

	console.log("Bob");

	let first_name = document.getElementById("first-name").value;
	let last_name = document.getElementById("last-name").value;
	let email = document.getElementById("email").value;
	let userName = document.getElementById("user-name").value;
	let password = document.getElementById("password").value

	//needs to be updated to use google needs updating
	let tmp = { authentication_provider: "USERNAME_PASSWORD", username: userName, password: password };

	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + "api/register" + extension;

	let xhr = new XMLHttpRequest();

	xhr.open("POST", url, true);

	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function () {

			if (this.status != 200) {

				let jsonObject = JSON.parse(xhr.responseText);
				document.getElementById("registerResult").innerHTML = "An error has occured";
				console.log(jsonObject);
			}
			else {
				
				document.getElementById("registerResult").innerHTML = "Successfully registered!";
				window.location.href = "../contacts-page/index.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("registerResult").innerHTML = err.message;
	}
}

form.addEventListener('submit', function signUp(e) {
	e.preventDefault();
	let res = isValidRegister();

	document.getElementById("validRegisterResult").value = res;

	if (res == "")
		register();
});

