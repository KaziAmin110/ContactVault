let isEditing = false;
let selectedContactIds = new Set();

const url = new URL(window.location.href);
const hostname = url.hostname;
const port = url.port;
const urlBase = url.protocol + '//' + (port ? `${hostname}:${port}` : hostname);

class Contact {
    constructor(id, firstName, lastName, emailAddress, avatarUrl, bio, description, userId) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.emailAddress = emailAddress;
        this.avatarUrl = avatarUrl;
        this.bio = bio;
        this.description = description;
        this.userId = userId;
    }
}

// Phone number & name validation
function validatePhoneNumber(phone) {
    const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
    return phonePattern.test(phone);
}

function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function deleteSelected() {
    const selectedContacts = document.querySelectorAll('.list-group-item.selected');
    if (selectedContacts.length === 0) {
        alert("Error: No contacts were selected for deletion.");
        return;
    }
    selectedContacts.forEach(contact => contact.remove());

    // Clear the contact details section (right side) when a profile is deleted
    clearContactDetails();

    //for front end people: please make sure to add in the element 'delete-contact-id' that holds the id of the contacts to be deleted
    //then uncomment the following line
    //const contactId = document.getElementById('delete-contact-id').value;

    //change 12 to contactId
    deleteContact(Cookies.get("jwtToken"),12);

}

async function deleteContact(token, contactId) {
    const response = await fetch(`${urlBase}/api/delete_contact.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ contact_id: contactId }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error);
    }
    return new Contact(
        data.contact.id,
        data.contact.first_name,
        data.contact.last_name,
        data.contact.email_address,
        data.contact.avatar_url,
        data.contact.bio,
        data.contact.description,
        data.contact.user_id
    );
}

function clearContactDetails() {
    document.getElementById('contact-name').value = '';
    document.getElementById('contact-email').value = '';
    document.getElementById('contact-phone').value = '';
    document.getElementById('contact-avatar').src = '';
    document.getElementById('contact-bio').value = '';
    document.getElementById('contact-details').style.display = 'none';
}

function selectContact(element, firstname, lastname, email, phone, avatar, bio, description) {
    if (isEditing) {
        alert("Please save your changes before selecting another profile.");
        return;
    }

    const allContacts = document.querySelectorAll('.list-group-item');
    allContacts.forEach(contact => contact.classList.remove('selected'));

    element.classList.add('selected');

    showContactDetails(firstname, lastname, email, phone, avatar, bio, description);
}

function showContactDetails(firstname, lastname, email, phone, avatar, bio, description) {
    document.getElementById('contact-name').value = firstname + ' ' + lastname;
    document.getElementById('contact-email').value = email;
    document.getElementById('contact-phone').value = phone;
    document.getElementById('contact-avatar').src = avatar;
    document.getElementById('contact-bio').value = bio;
    document.getElementById('contact-descriptionInfo').value = description;
    document.getElementById('contact-details').style.display = 'block';
    adjustTextareaHeight(document.getElementById('contact-bio'));
    adjustTextareaHeight(document.getElementById("contact-description"));
}

function modifySelected() {
    const fields = document.querySelectorAll('.editable-field');
    fields.forEach(field => field.removeAttribute('readonly'));

    const saveButton = document.querySelector('.save-button');
    saveButton.style.display = 'inline-block';

    isEditing = true;
}

function saveContactDetails() {
    const fields = document.querySelectorAll('.editable-field');
    fields.forEach(field => field.setAttribute('readonly', 'true'));

    const saveButton = document.querySelector('.save-button');
    saveButton.style.display = 'none';

    isEditing = false;

    updatContactToDatabase();
}

//incomplete
function updatContactToDatabase(){
    
    //api endpoint doesnt accept phone number

    //front end: need to store each contacts id. this is the id of contact to be edited
    //let id = document.getElementById('update-contact-id').value,

    const str= document.getElementById('contact-name').value;
    const split= str.split(' ');

    first_name= split[0];

    if(split[1])
        last_name=split[1];
    else last_name="";

    //front end: avatar url isnt avaialble to edit
    //id is hardcoded
    let updatedContact = {
        id: 30,
        first_name: first_name,
        last_name: last_name,
        email_address: document.getElementById('contact-email').value,
        avatar_url:"https://thispersondoesnotexist.com/" ,
        bio: document.getElementById('contact-bio').value,
        description: document.getElementById('contact-description').value
    };
        //avatar_url: contact_avatar ,
        //phone: contact_phone

    console.log(updateContact(Cookies.get("jwtToken"), updatedContact));
}

async function updateContact(token, contact) {

    const response = await fetch(`${urlBase}/api/update_contact.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ contact }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error);
    }

    console.log(data.contact.id);
    return data.contact.id;
}

function addNewContact() {
    const firstname = document.getElementById('new-contact-firstname').value;
    const lastname = document.getElementById('new-contact-lastname').value;
    const email = document.getElementById('new-contact-email').value;
    const phone = document.getElementById('new-contact-phone').value;
    const avatarFile = document.getElementById('new-contact-avatar').files[0];
    const bio = document.getElementById('new-contact-bio').value;
    const description = document.querySelector('#new-contact-description');

    let isValid = true;

	// A LOT of if statements for the validation of name, email, etc. probably could condense this down or put them into their own functions for readablity
    if (!firstname) {
        const firstnameInput = document.getElementById('new-contact-firstname');
        firstnameInput.classList.add('is-invalid');
        isValid = false;
    } else {
        const firstnameInput = document.getElementById('new-contact-firstname');
        firstnameInput.classList.remove('is-invalid');
    }

    if (!lastname) {
        const lastnameInput = document.getElementById('new-contact-lastname');
        lastnameInput.classList.add('is-invalid');
        isValid = false;
    } else {
        const lastnameInput = document.getElementById('new-contact-lastname');
        lastnameInput.classList.remove('is-invalid');
    }

    if (!validateEmail(email)) {
        const emailInput = document.getElementById('new-contact-email');
        emailInput.classList.add('is-invalid');
        isValid = false;
    } else {
        const emailInput = document.getElementById('new-contact-email');
        emailInput.classList.remove('is-invalid');
    }

    if (!validatePhoneNumber(phone)) {
        const phoneInput = document.getElementById('new-contact-phone');
        phoneInput.classList.add('is-invalid');
        isValid = false;
    } else {
        const phoneInput = document.getElementById('new-contact-phone');
        phoneInput.classList.remove('is-invalid');
    }

    if (!avatarFile) {
        const avatarInput = document.getElementById('new-contact-avatar');
        avatarInput.classList.add('is-invalid');
        isValid = false;
    } else {
        const avatarInput = document.getElementById('new-contact-avatar');
        avatarInput.classList.remove('is-invalid');
    }

    if (!isValid) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const avatarDataUrl = event.target.result;
        const contactList = document.querySelector('#contact-list');
        // const contactId = addContactToDatabase(firstname.value,lastname.value,email.value,bio.value,description.value);

        const noContactsMessage = document.querySelector('.no-contacts');
        if (noContactsMessage) {
            noContactsMessage.remove();
        }
		
		
		// Creates a dynamic instance of a contact using all of the information from the popout
        const newContactItem = document.createElement('li');
        newContactItem.classList.add('list-group-item');
        // newContactItem.setAttribute('data-id', contactId);
        newContactItem.setAttribute('onclick', `selectContact(this, '${firstname}', '${lastname}', '${email}', '${phone}', '${avatarDataUrl}', '${bio}', '${description})`);
        newContactItem.innerHTML = `
            <div class="contact-info">
                <img src="${avatarDataUrl}" alt="${firstname} ${lastname}" class="avatar">
                <div class="contact-details">
                    <h5 class="contact-name">${firstname} ${lastname}</h5>
                    <small>${phone}</small>
                </div>
            </div>
        `;
        contactList.appendChild(newContactItem);
        $('#addContactModal').modal('hide');
        document.getElementById('add-contact-form').reset();
    };
    reader.readAsDataURL(avatarFile);    
}


function addContactToDatabase(first_name, last_name, email,bio,description){

    if (typeof Cookies !== 'undefined') {
        console.log('Cookies library is loaded and available');
    } else {
        console.error('Cookies library is not loaded');
    }

    const contact = {
        first_name: first_name,
        last_name: last_name,
        email_address: email,
        bio: bio,
        description:description
    };

    return addContact(Cookies.get("jwtToken"), contact);
}


async function addContact(token, contact) {

    const response = await fetch(`${urlBase}/api/add_contact.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ contact }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error);
    }

    return data.contact.id;
}


// Adjusted text area for the description with event listeners to make the description go further down as the user inputs more
function adjustTextareaHeight(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight) + 'px';
}

document.addEventListener('input', function (event) {
    if (event.target.classList.contains('is-invalid')) {
        event.target.classList.remove('is-invalid');
    }

    if (event.target.tagName.toLowerCase() === 'textarea') {
        adjustTextareaHeight(event.target);
    }
}, false);

document.addEventListener('DOMContentLoaded', function() {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => adjustTextareaHeight(textarea));
});

