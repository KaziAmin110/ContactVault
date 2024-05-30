//http://localhost/swagger-ui

const form = document.querySelector('.sign-in-form');

const url = new URL(window.location.href);
const hostname = url.hostname;
const port = url.port;
const urlBase = url.protocol + '//' + (port ? `${hostname}:${port}` : hostname);

const extension = 'php';

let userId = 0;

form.addEventListener('submit', function signUp(e) {
	e.preventDefault();
	doLogin();
});

function doLogin()
{
	
	let username = document.getElementById("user-name").value;
	let password = document.getElementById("password").value;
//	var hash = md5( password );
	
	//document.getElementById("loginResult").innerHTML = "";

	let tmp = {authentication_provider:"USERNAME_PASSWORD",username:username,password:password};
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
            let jsonObject=JSON.parse(this.responseText);
            userId = jsonObject.user_id;
			//if server responded succesfully
			//4 = request has been completed
			//200 = request was sucessful
			if (this.readyState == 4){

                if(this.status == 200){
                    
                    
                    //creating cookie
                    Cookies.remove('jwtToken');
				    Cookies.set('jwtToken', jsonObject.token, {expires: 1, secure: true, sameSite:'strict'});

                    window.location.href = "../contacts-page/index.html";
                }

                if(this.status==400){
                    //document.getElementById("validRegisterResult").value="invalid input";
                    console.log("ERROR 400: "+jsonObject.error);
                }
                if(this.status==401){
                    //document.getElementById("validRegisterResult").value="Invalid credentials or authentication provider";
                    console.log("ERROR 401: "+jsonObject.error);
                }
        }
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		//document.getElementById("loginResult").innerHTML = err.message;
		console.log(err.message);
	}

}

