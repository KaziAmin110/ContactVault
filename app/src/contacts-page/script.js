let isEditing = false;
let selectedContactIds = new Set();

function deleteSelected() {
    const selectedContacts = document.querySelectorAll('.list-group-item.selected');
    if (selectedContacts.length === 0) {
        alert("Error: No contacts were selected for deletion.");
        return;
    }
    selectedContacts.forEach(contact => contact.remove());

    // Clear the contact details section (right side) when a profile is deleted
    clearContactDetails();
}

function clearContactDetails() {
    document.getElementById('contact-name').value = '';
    document.getElementById('contact-email').value = '';
    document.getElementById('contact-phone').value = '';
    document.getElementById('contact-avatar').src = '';
    document.getElementById('contact-bio').value = '';
    document.getElementById('contact-linkedin').value = '';
    document.getElementById('contact-details').style.display = 'none';
}

function selectContact(element, firstname, lastname, email, phone, avatar, bio, linkedin) {
    if (isEditing) {
        alert("Please save your changes before selecting another profile.");
        return;
    }

    const allContacts = document.querySelectorAll('.list-group-item');
    allContacts.forEach(contact => contact.classList.remove('selected'));

    element.classList.add('selected');

    showContactDetails(firstname, lastname, email, phone, avatar, bio, linkedin);
}

function showContactDetails(firstname, lastname, email, phone, avatar, bio, linkedin) {
    document.getElementById('contact-name').value = firstname + ' ' + lastname;
    document.getElementById('contact-email').value = email;
    document.getElementById('contact-phone').value = phone;
    document.getElementById('contact-avatar').src = avatar;
    document.getElementById('contact-bio').value = bio;
    document.getElementById('contact-linkedin').value = linkedin;
    document.getElementById('contact-details').style.display = 'block';
    adjustTextareaHeight(document.getElementById('contact-bio'));
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
}

function addNewContact() {
    const firstname = document.getElementById('new-contact-firstname').value;
    const lastname = document.getElementById('new-contact-lastname').value;
    const email = document.getElementById('new-contact-email').value;
    const phone = document.getElementById('new-contact-phone').value;
    const avatarFile = document.getElementById('new-contact-avatar').files[0];
    const bio = document.getElementById('new-contact-bio').value;
    const linkedin = document.getElementById('new-contact-linkedin').value;

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
        const contactList = document.getElementById('contact-list');
        const contactId = `contact-${Date.now()}`;

        const noContactsMessage = document.querySelector('.no-contacts');
        if (noContactsMessage) {
            noContactsMessage.remove();
        }
		
		
		// Creates a dynamic instance of a contact using all of the information from the popout
        const newContactItem = document.createElement('li');
        newContactItem.classList.add('list-group-item');
        newContactItem.setAttribute('data-id', contactId);
        newContactItem.setAttribute('onclick', `selectContact(this, '${firstname}', '${lastname}', '${email}', '${phone}', '${avatarDataUrl}', '${bio}', '${linkedin}')`);
        newContactItem.innerHTML = `
            <div class="contact-info">
                <img src="${avatarDataUrl}" alt="${firstname} ${lastname}" class="avatar">
                <div class="contact-details">
                    <h5 class="contact-name">${firstname} ${lastname}</h5>
                    <p>${email}</p>
                </div>
            </div>
        `;
        contactList.appendChild(newContactItem);
        $('#addContactModal').modal('hide');
        document.getElementById('add-contact-form').reset();
    };
    reader.readAsDataURL(avatarFile);
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
