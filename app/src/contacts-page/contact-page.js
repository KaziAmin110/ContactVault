const modal = document.querySelector(".modal");
const addContactSubmit = document.querySelector(".add-contact-submit");
const addMembers = document.querySelector(".add-image");
const exitModal = document.querySelector(".exit-modal");

// Frontend + Backend Code to add a new Contact
function addNewContact() {
    const firstname = document.getElementById('new-contact-firstname').value;
    const lastname = document.getElementById('new-contact-lastname').value;
    const email = document.getElementById('new-contact-email').value;
    const phone = document.getElementById('new-contact-phone').value;
    const avatarFile = document.getElementById('new-contact-avatar').files[0];
    const bio = document.getElementById('new-contact-bio').value;

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

    // Adds Upload functionality for Profile Image
    const reader = new FileReader();
    reader.onload = function (event) {
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

    addContactToDatabase(firstname, lastname, email, bio, linkedin);
}


function addContactToDatabase(first_name, last_name, email, bio, description) {


    if (typeof Cookies !== 'undefined') {
        console.log('Cookies library is loaded and available');
    } else {
        console.error('Cookies library is not loaded');
    }


    console.log(first_name + "|" + last_name + "|" + email + "|" + bio + "|" + description);


    const contact = {
        first_name: first_name,
        last_name: last_name,
        email_address: email,
        bio: bio,
        description: description
    };


    let res = addContact(Cookies.get("jwtToken"), contact);
}


async function addContact(token, contact) {

    console.log(`${urlBase}/api/add_contact.php`);

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




