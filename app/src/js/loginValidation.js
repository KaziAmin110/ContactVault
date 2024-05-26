const username = document.querySelector('#user-name');
const password = document.querySelector('#password');
const form = document.querySelector('.sign-in-form');
const userForm = document.querySelector('.username');
const passForm = document.querySelector('.password');


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