//change hosting
const urlBase = 'http://localhost/';
const extension = 'php';
const usernameRegex = /^[a-zA-Z0-9_]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let userId = 0;
let firstName = "";
let lastName = "";

//redirects from home page to log in page
function toLoginPage() {
	//must be updated to redirect to the loginPage
    window.location.href = "contacts-page/index.html";
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "../../index.html";
}

function signUp(){
	event.preventDefault();
	let res= isValidRegister();

	document.getElementById("validRegisterResult").innerHTML=res;
	
	if(res=="")
		register();
}

function isValidPassword(password){

	let passwordRequieres="";

	const minLength = 8;
    
	const hasUppercase = /[A-Z]/.test(password);
	const hasLowercase = /[a-z]/.test(password);
	const hasNumber = /[0-9]/.test(password);
	const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
 
	const isValidLength = password.length >= minLength;

	if(!isValidLength)
		passwordRequieres+= "Password must be atleast 8 characters long<br>"
	if(!hasUppercase)
		passwordRequieres+= "Password must contain atleast 1 uppercase<br>"
	if(!hasLowercase)
		passwordRequieres+= "Password must contain atleast 1 lowercase<br>"
	if(!hasNumber)
		passwordRequieres+= "Password must contain atleast 1 number<br>"
	if(!hasSpecialChar)
		passwordRequieres+= "Password must contain atleast 1 special character<br>"
	
	return passwordRequieres;
}

function isValidRegister(){

	//if the user has input a field incorrectly, message will let the user know what is wrong
	let message= "";
	
	let first_name = document.getElementById("first-name").value;
	let last_name = document.getElementById("last-name").value;
	let email = document.getElementById("email").value;
	let userName= document.getElementById("user-name").value;
	let password = document.getElementById("password").value

	if(first_name.length ==0 ){
		message+="First name cannot be empty<br>";
		flag=false;
	}

	if(last_name.length ==0 ){
		message+="Last name cannot be empty<br>";
		flag=false;
	}

	if(!usernameRegex.test(userName)){
		message+="Invalid username<br>";
		message+="please make sure the username is between 3-20 characters and has only numbers, letters, and _<br>";
		flag=false;
	}

	if(!emailRegex.test(email) ){
		message+="Invalid email<br>";
		flag=false;
	}

	let passReq= isValidPassword(password);

	if(passReq!=""){
		message+=passReq+"<br>";
		flag=false;
	}

	return message;
}

//not complete
function register(){
	
	let first_name = document.getElementById("first-name").value;
	let last_name = document.getElementById("last-name").value;
	let email = document.getElementById("email").value;
	let userName= document.getElementById("user-name").value;
	let password = document.getElementById("password").value

	//needs to be updated to use google
	let tmp={enum: "USERNAME_PASSWORD",username:userName,password:password};

	let jsonPayload= JSON.stringify(tmp);
	let url= urlBase + "api/register"+extension;
	
	let xhr = new XMLHttpRequest();

	xhr.open("POST", url, true);

	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	try{
		xhr.onreadystatechange= function() {

			if(this.readyState==4 && this.status == 200){

				let jsonObject= JSON.parse(xhr.responseText);

				if(jsonObject.console.error != ''){
					document.getElementById("registerResult").innerHTML="An error has occured";
				}
			}
			else{
				document.getElementById("registerResult").innerHTML= "Successfully registered!";
				window.location.href = "contacts-page/index.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err){
		document.getElementById("registerResult").innerHTML=err.message;
	}
}

//noty working error 404
function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {username:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + 'api/login.' + extension;

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
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
				
				//checks to see if the login was valid
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
				
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;
				
				userId= jsonObject.
				saveCookie();
	
				window.location.href = "contacts-page/index.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "contacts-page/index.html";
	}
	else
	{
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

//not completed needs jwt token
function addContact()
{

	let firstName= document.getElementById("FirstName").value;
	let lastName= document.getElementById("LastName").value;
	//let phoneNumber= document.getElementById("PhoneNumber").value;
	let emailAdress= document.getElementById("EmailAdress").value;
	//let avaratUrl= document.getElementById("AvatarUrl").value;
	//let bio= document.getElementById("Bio").value;
	//let description= document.getElementById("Description").value;

	//validate contact?

	//clear
	document.getElementById("FirstName").value= "";
	document.getElementById("LastName").value= "";
	//document.getElementById("PhoneNumber").value= "";
	document.getElementById("EmailAdress").value= "";
	//document.getElementById("AvatarUrl").value= "";
	//document.getElementById("Bio").value= "";
	//document.getElementById("Description").value= "";

	//let tmp = {firstName:firstName, lastName: lastName, phoneNumber:phoneNumber,
	//emailAdress:emailAdress, avaratUrl:avaratUrl, bio:bio,description:description};

	let tmp= {first_name: firstName, last_name: lastName, email: emailAdress}
	
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '../api/add_contact.' + extension;

	let jwt= '';
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	xhr.setRequestHeader("Authorization", "bearer "+jwt);
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
}
//not complete needs jwt token
function delete_contact(contactID){

	let tmp={contact_id: contactID};
	let jsonPayload= JSON.stringify(tmp);

	let url= urlBase+ '../api/delete_contact.'+extension;

	let xhr= new XMLHttpRequest();

	let jwt= '';

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	xhr.setRequestHeader("Authorization", "bearer "+jwt);

	try
	{
		xhr.onreadystatechange = function(){
			if(this.readyState==4 && this.status==200){
				document.getElementById("deleteContactResult").innerHTML= "Contact has been added"
			}
		}
		xhr.send(jsonPayload);	
	}

	catch(err){
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
}
