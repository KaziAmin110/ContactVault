//change hosting
const urlBase = 'http://localhost/';
const extension = 'php';

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
