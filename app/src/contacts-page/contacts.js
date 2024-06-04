let isEditing = false;
let selectedContactIds = new Set();
let currentPageNum = 1;
let totalPages = 1;

const url = new URL(window.location.href);
const hostname = url.hostname;
const port = url.port;
const urlBase = url.protocol + '//' + (port ? `${hostname}:${port}` : hostname);

class User {
    constructor(id, firstName, lastName, dateCreated, dateLastLoggedIn, authenticationId, authenticationProvider) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateCreated = dateCreated;
        this.dateLastLoggedIn = dateLastLoggedIn;
        this.authenticationId = authenticationId;
        this.authenticationProvider = authenticationProvider;
    }
}

// When Phone Number is Implemented in Contact Object.. The Select Contact stops working
class Contact {
    constructor(id, firstName, lastName, emailAddress, phoneNumber, avatarUrl, bio, description, userId) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.emailAddress = emailAddress;
        this.phoneNumber = phoneNumber;
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
    let confirmDeletion = confirm("Are you sure you want to delete this contact?");

    if (!confirmDeletion)
        return;

    const contactId = parseInt(document.querySelector('.selected').getAttribute('data-id'));

    selectedContacts.forEach(contact => contact.remove());
    // Clear the contact details section (right side) when a profile is deleted
    clearContactDetails();

    console.log(contactId);
    deleteContact(Cookies.get("jwtToken"), contactId);

}

function clearContactDetails() {
    document.getElementById('contact-name').value = '';
    document.getElementById('contact-email').value = '';
    document.getElementById('contact-phone').value = '';
    document.getElementById('contact-avatar').src = '';
    document.getElementById('contact-bio').value = '';
    document.getElementById('contact-details').style.display = 'none';
}

function selectContact(element) {
    console.log("Arrived");
    if (isEditing) {
        alert("Please save your changes before selecting another profile.");
        return;
    }
    const allContacts = document.querySelectorAll('.list-group-item');
    allContacts.forEach(contact => contact.classList.remove('selected'));

    element.classList.add('selected');

    showContactDetails();
}

async function showContactDetails() {
    let contacts = await getContact(parseInt(document.querySelector('.selected').getAttribute('data-id')));

    document.getElementById('contact-name').value = contacts.firstName + ' ' + contacts.lastName;
    document.getElementById('contact-email').value = contacts.emailAddress;
    document.getElementById('contact-phone').value = contacts.phoneNumber;
    document.getElementById('contact-avatar').src = contacts.avatarUrl;
    document.getElementById('contact-bio').value = contacts.bio;
    document.getElementById('contact-descriptionInfo').value = contacts.description;
    document.getElementById('contact-details').style.display = 'flex';
    adjustTextareaHeight(document.getElementById('contact-bio'));
    adjustTextareaHeight(document.getElementById("contact-descriptionInfo"));
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
    reader.onload = function (event) {
        const avatarDataUrl = event.target.result;
        const contactList = document.querySelector('#contact-list');
        const noContactsMessage = document.querySelector('.no-contacts');
        if (noContactsMessage) {
            noContactsMessage.remove();
        }

        //uses .then() to ensure the id value is returned from the async function addContactToDatabase
        addContactToDatabase(firstname, lastname, email, phone, bio, description.value)
            .then(contactId => {
                // Creates a dynamic instance of a contact using all of the information from the popout
                uploadAvatar(contactId, 1);
                const newContactItem = document.createElement('li');
                newContactItem.setAttribute('data-id', contactId);
                const idDiv = document.createElement('div');
                idDiv.innerText = `${contactId}`;
                idDiv.style.display = "none";
                newContactItem.classList.add('list-group-item');
                newContactItem.setAttribute('onclick', 'selectContact(this)');
                newContactItem.appendChild(idDiv);
                newContactItem.innerHTML = `
                <div class="contact-info">
                    <img src="${avatarDataUrl}" alt="${firstname} ${lastname}" class="avatar">
                    <div class="contact-details">
                        <h5 id="contact-id-${contactId}">${firstname} ${lastname}</h5>
                        <small class="small-phone-${contactId}">${phone}</small>
                    </div>
                </div>
            `;
                contactList.appendChild(newContactItem);
                $('#addContactModal').modal('hide');
                document.getElementById('add-contact-form').reset();
            })
            .catch(error => {
                console.error("Error adding contact:", error);
            });
    };

    reader.readAsDataURL(avatarFile);
    console.log("passed");
}

// Update Existing Contact Code 
function updateExistingContact() {

    const firstname = document.getElementById('update-contact-firstname').value;
    const lastname = document.getElementById('update-contact-lastname').value;
    const email = document.getElementById('update-contact-email').value;
    const phone = document.getElementById('update-contact-phone').value;
    const avatarFile = document.getElementById('update-contact-avatar').files[0];


    let isValid = true;

    // A LOT of if statements for the validation of name, email, etc. probably could condense this down or put them into their own functions for readablity
    if (!firstname) {
        const firstnameInput = document.getElementById('update-contact-firstname');
        firstnameInput.classList.add('is-invalid');
        isValid = false;
    } else {
        const firstnameInput = document.getElementById('update-contact-firstname');
        firstnameInput.classList.remove('is-invalid');
    }

    if (!lastname) {
        const lastnameInput = document.getElementById('update-contact-lastname');
        lastnameInput.classList.add('is-invalid');
        isValid = false;
    } else {
        const lastnameInput = document.getElementById('update-contact-lastname');
        lastnameInput.classList.remove('is-invalid');
    }

    if (!validateEmail(email)) {
        const emailInput = document.getElementById('update-contact-email');
        emailInput.classList.add('is-invalid');
        isValid = false;
    } else {
        const emailInput = document.getElementById('update-contact-email');
        emailInput.classList.remove('is-invalid');
    }

    if (!validatePhoneNumber(phone)) {
        const phoneInput = document.getElementById('update-contact-phone');
        phoneInput.classList.add('is-invalid');
        isValid = false;
    } else {
        const phoneInput = document.getElementById('update-contact-phone');
        phoneInput.classList.remove('is-invalid');
    }

    if (!avatarFile) {
        const avatarInput = document.getElementById('update-contact-avatar');
        avatarInput.classList.add('is-invalid');
        isValid = false;
    } else {
        const avatarInput = document.getElementById('update-contact-avatar');
        avatarInput.classList.remove('is-invalid');
    }

    if (!isValid) {
        return;
    }

    updatContactToDatabase();
    $('#editContactModal').modal('hide');
    document.getElementById('edit-contact-form').reset();

}

function updatContactToDatabase() {

    let id = parseInt(document.querySelector('.selected').getAttribute('data-id'))
    uploadAvatar(id, 2);

    let updatedContact = {
        id: id,
        first_name: document.getElementById('update-contact-firstname').value,
        last_name: document.getElementById('update-contact-lastname').value,
        email_address: document.getElementById('update-contact-email').value,
        phone_number: document.getElementById('update-contact-phone').value,
        avatar_url: null,
        bio: document.getElementById('update-contact-bio').value,
        description: document.getElementById('update-contact-description').value
    };

    console.log("UPDATING CONTACT: " + updateContact(Cookies.get("jwtToken"), updatedContact));
}

//mode: 1 (add)
//mode: 2 (update)
function uploadAvatar(id, mode) {

    let formData = new FormData();

    let jwtField = Cookies.get('jwtToken');
    console.log("jwtField.value=" + jwtField);

    let contactIdField = id;
    console.log("contactIdField.value=" + contactIdField);

    let fileField;

    if (mode == 1)
        fileField = document.querySelector('#new-contact-avatar');
    else if (mode == 2)
        fileField = document.querySelector('#update-contact-avatar');
    else {
        console.error("invalid mode");
        return "invalid mode";
    }

    formData.append('image', fileField.files[0]);

    // Adding JSON-encoded data
    let jsonData = {
        contact_id: contactIdField,
    };

    formData.append('json', JSON.stringify(jsonData));

    fetch(urlBase + '/api/set_contact_avatar.php', {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': 'Bearer ' + jwtField
        }
    })
        .then(response => response.json())
        .then(result => {
            console.log('Success:', result);
            if (result.contact && result.contact.avatar_url) {
                let imageUrl = result.contact.avatar_url;
            } else {
                console.error('avatar_url not found in result');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

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

    await updateContactFrontend(data);

    return data.contact.id;
}

async function updateContactFrontend(data) {
    const contacts = await data.contact;

    const descriptionName = document.querySelector("#contact-name");
    const listName = document.querySelector(`#contact-id-${contacts.id}`);
    const listPhone = document.querySelector(`.small-phone-${contacts.id}`);
    const email = document.querySelector("#contact-email");
    const phone = document.querySelector("#contact-phone");
    const avatar = document.querySelector("#contact-avatar");
    const bio = document.querySelector("#contact-bio");
    const description = document.querySelector("#contact-descriptionInfo");

    descriptionName.value = `${contacts.first_name} ${contacts.last_name}`;
    listName.textContent = `${contacts.first_name} ${contacts.last_name}`;
    listPhone.textContent = `${contacts.phone_number}`

    email.value = contacts.email_address;
    phone.value = contacts.phone_number;
    avatar.src.value = contacts.avatar_url;
    bio.value = contacts.bio;
    description.value = contacts.description;

    console.log(data);
    console.log("Updated Frontend");

}

function addContactToDatabase(first_name, last_name, email, phone, bio, description) {

    if (typeof Cookies !== 'undefined') {
        console.log('Cookies library is loaded and available');
    } else {
        console.error('Cookies library is not loaded');
    }

    const contact = {
        first_name: first_name,
        last_name: last_name,
        email_address: email,
        phone_number: phone,
        bio: bio,
        description: description
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

async function getContact(contactId) {
    let token = Cookies.get("jwtToken");
    const response = await fetch(`${urlBase}/api/get_contact.php?contact_id=${encodeURIComponent(contactId)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
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
        data.contact.phone_number,
        urlBase + "/" + data.contact.avatar_url,
        data.contact.bio,
        data.contact.description,
        data.contact.user_id
    );
}

//doesnt return phone number
async function searchContacts(query, page = 1) {

    let token = Cookies.get("jwtToken");

    const response = await fetch(`${urlBase}/api/search_contacts.php?query=${encodeURIComponent(query)}&page=${encodeURIComponent(page)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error);
    }

    console.log(data);

    totalPages = data.total_pages;

    return data.contacts.map(contact => new Contact(
        contact.id,
        contact.first_name,
        contact.last_name,
        contact.email_address,
        "123-456-789",
        urlBase + "/" + contact.avatar_url,
        contact.bio,
        contact.description,
        contact.user_id
    ));
}

// Makes New Contacts Based on Query and Pagenumber Values
async function makeNewContactItem(query, pageNumber) {
    const contacts = await searchContacts(query, pageNumber);
    const listGroup = document.querySelector('#contact-list');
    const noContactsMessage = document.querySelector('.no-contacts');

    if (contacts.length > 0 && noContactsMessage) {
        noContactsMessage.remove();
    }

    contacts.forEach((contact) => {
        const newContactItem = document.createElement('li');
        newContactItem.setAttribute('data-id', contact.id);
        newContactItem.classList.add('list-group-item');
        newContactItem.setAttribute('onclick', 'selectContact(this)');
        newContactItem.innerHTML = `
                <div class="contact-info">
                    <img src="${contact.avatarUrl}" alt="${contact.firstName} ${contact.lastName}" class="avatar">
                    <div class="contact-details">
                        <h5 id="contact-id-${contact.id}">${contact.firstName} ${contact.lastName}</h5>
                        <small class="small-phone-${contact.id}">${contact.phoneNumber}</small>
                    </div>
                </div>
            `;
        listGroup.appendChild(newContactItem);
    })
}

async function getUser() {
    let token = Cookies.get("jwtToken");
    let userId= Cookies.get("userId");

    const response = await fetch(`${urlBase}/api/get_user.php?user_id=${encodeURIComponent(userId)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error);
    }
    return new User(
        data.user.authentication_id,
        data.user.first_name,
        data.user.last_name,
        data.user.date_created,
        data.user.date_last_logged_in,
        data.user.authentication_provider
    );
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

document.addEventListener('DOMContentLoaded', function () {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => adjustTextareaHeight(textarea));
});

// Page Navigation Functionality

// Prev Page Functionality
document.querySelector(".prev-page").addEventListener('click', async () => {
    if (currentPageNum === 1) {
        return;
    }

    // Removes all children of list-group
    let listGroup = document.querySelector('.list-group');
    listGroup.innerHTML = '';

    currentPageNum -= 1;
    const currentPage = document.querySelector(".current-page-num");
    currentPage.textContent = currentPageNum;
    let currentQuery = document.querySelector('.search-bar').value;

    makeNewContactItem(currentQuery, currentPageNum);

})

// Next Page Functionality
document.querySelector(".next-page").addEventListener('click', async () => {
    const currentPage = document.querySelector(".current-page-num");
    currentPageNum += 1;
    let currentQuery = document.querySelector('.search-bar').value;

    const search = await searchContacts(currentQuery, currentPageNum);
    if (search.length === 0) {
        currentPageNum -= 1;
        return;
    }

    currentPage.textContent = currentPageNum;
    // Removes all children of listgroup
    let listGroup = document.querySelector('.list-group');
    listGroup.innerHTML = '';

    makeNewContactItem(currentQuery, currentPageNum);
})

// Search Functionality 
document.querySelector(".search-button").addEventListener('click', async (event) => {
    event.preventDefault();

    const query = document.querySelector(".search-bar").value;
    const search = await searchContacts(query, 1);

    const totalPageNum = document.querySelector(".total-pages-num");
    const currentPage = document.querySelector(".current-page-num");

    currentPage.textContent = 1;
    
    if (totalPages === 0)
        currentPage.innerText = 0;

    totalPageNum.textContent = totalPages;
    makeNewContactItem(query, 1);

    // Removes all children of list-group
    let listGroup = document.querySelector('.list-group');
    listGroup.innerHTML = '';

    if (search.length === 0) {
        return;
    }
})


// Loads First Page Upon Window load
window.onload = makeNewContactItem("", 1);

window.onload = async function () {
    const currentPage = document.querySelector(".current-page-num");

    currentPage.textContent = currentPageNum;

    const search = await searchContacts("");

    let userId = Cookies.get("userId");

    document.querySelector('.total-pages-num').textContent = totalPages;

    const userInformation = await getUser(userId);
    console.log(userInformation);
    const first_name = userInformation.firstName;
    const last_name = userInformation.lastName;

    document.querySelector(".user_name_val").innerText = first_name + " " + last_name;

};




async function getUser() {
    let token = Cookies.get("jwtToken");
    let userId = Cookies.get("userId");

    const response = await fetch(`${urlBase}/api/get_user.php?user_id=${encodeURIComponent(userId)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error);
    }
    return new User(
        data.user.id,
        data.user.first_name,
        data.user.last_name,
        data.user.date_created,
        data.user.date_last_logged_in,
        data.user.authentication_id,
        data.user.authentication_provider
    );
}

