const email = document.querySelector('#new-contact-email');
const phoneNumber = document.querySelector('#new-contact-phone');
const emailGroup = document.querySelector(".email-group");
const phoneGroup = document.querySelector(".phone-group");
const modalForm = document.querySelector('#add-contact-form');


function validePhoneNumber(phone) {
    const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
    return phonePattern.test(phone);
}

function valideEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}



modalForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // const div = document.createElement('div');
    // div.classList.add('invalid-feedback');
    
    // Email Validation

    if (valideEmail(email.value)) {
        console.log("Email Valid");

        const div = document.createElement('div');
        div.classList.add('emailDiv');
        div.classList.add('valid-feedback');
        div.textContent = "Looks Good!";

        if (email.classList.contains('is-invalid'))
            email.classList.remove('is-invalid');
        
        email.classList.add("is-valid");
        emailGroup.appendChild(div);
    }
    else {
        console.log("Email Invalid")
        
        const div = document.createElement('div');
        div.classList.add('emailDiv');
        div.classList.add('invalid-feedback');
        div.textContent = "Invalid Email: Email Must Contain a valid email address";

        if (email.classList.contains('is-valid'))
            email.classList.remove('is-valid');

        email.classList.add("is-invalid");
        emailGroup.appendChild(div);
    }


    // Password Validation Must Contain atleast 8 characters and atleast one number and special character
    if (validePhoneNumber(phoneNumber.value)) {
        console.log("Valid Phone Number");

        const div = document.createElement('div');
        div.classList.add('phoneDiv');
        div.classList.add('valid-feedback');
        div.textContent = "Looks Good!";


        if (password.classList.contains('is-invalid'))
            password.classList.remove('is-invalid');

        phone.classList.add("is-valid");
        phoneGroup.appendChild(div);
    }


    else {
        console.log("Invalid Phone Number");

        const div = document.createElement('div');
        div.classList.add('phoneDiv');
        div.classList.add('invalid-feedback');
        div.textContent = "Invalid Phone Number: Number be in the form xxx-xxx-xxxx";

        if (phone.classList.contains('is-valid'))
            phone.classList.remove('is-valid');

        phone.classList.add("is-invalid");
        phoneGroup.appendChild(div);
    }        
})