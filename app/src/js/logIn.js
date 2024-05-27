//http://localhost/swagger-ui

const form = document.querySelector('.sign-in-form');

const url = new URL(window.location.href);
const hostname = url.hostname;
const port = url.port;
const urlBase = url.protocol + '//' + (port ? `${hostname}:${port}` : hostname);

const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

form.addEventListener('submit', function signUp(e) {
	e.preventDefault();
	let res = isValidRegister();

	document.getElementById("validRegisterResult").value = res;

	if (res == "")
		register();
});

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("user-name").value;
	let password = document.getElementById("password").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {authentication_provider:"USERNAME_PASSWORD",username:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/api/login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			//if server responded succesfully
			//4 = request has been completed
			//200 = request was sucessful
			if (this.readyState == 4){

                if(this.status == 200){
                    let jsonObject = JSON.parse( xhr.responseText );
                    user_id = jsonObject.user_id;
                    jwtToken= jsonObject.token;

                    Cookies.remove('jwtToken');
                    Cookies.set('jwtToken', jwtToken, {expires: 1, secure: true, sameSite:'strict'});
        
                    window.location.href = "contacts-page/index.html";
                }

                if(this.readyState==400){
                    document.getElementById("validRegisterResult").value="invalid input";
                }
                
                if(this.readyState==500){
                    document.getElementById("validRegisterResult").value="Invalid credentials or authentication provider";
                }
        }
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

