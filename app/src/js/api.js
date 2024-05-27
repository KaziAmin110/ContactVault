const url = new URL(window.location.href);
const hostname = url.hostname;
const port = url.port;
const API_BASE_URL = url.protocol + '//' + (port ? `${hostname}:${port}` : hostname);

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

async function login(authenticationProvider, username, password) {
    const response = await fetch(`${API_BASE_URL}/api/login.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            authentication_provider: authenticationProvider,
            username,
            password,
        }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error);
    }
    return data;
}

async function register(authenticationProvider, username, password, firstName, lastName) {
    const response = await fetch(`${API_BASE_URL}/api/register.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            authentication_provider: authenticationProvider,
            username,
            password,
            first_name: firstName,
            last_name: lastName,
        }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error);
    }
    return data;
}

async function addContact(token, contact) {
    const response = await fetch(`${API_BASE_URL}/api/add_contact.php`, {
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

async function getContact(token, contactId) {
    const response = await fetch(`${API_BASE_URL}/api/get_contact.php`, {
        method: 'GET',
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

async function deleteContact(token, contactId) {
    const response = await fetch(`${API_BASE_URL}/api/delete_contact.php`, {
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
    return data;
}

async function updateContact(token, contact) {
    const response = await fetch(`${API_BASE_URL}/api/update_contact.php`, {
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

async function searchContacts(token, query, page = 1) {
    const response = await fetch(`${API_BASE_URL}/api/search_contacts.php`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ query, page }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error);
    }
    return data.contacts.map(contact => new Contact(
        contact.id,
        contact.first_name,
        contact.last_name,
        contact.email_address,
        contact.avatar_url,
        contact.bio,
        contact.description,
        contact.user_id
    ));
}

async function getUser(token, userId) {
    const response = await fetch(`${API_BASE_URL}/api/get_user.php`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userId }),
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

// Usage example:
// login('USERNAME_PASSWORD', 'username', 'password')
//   .then(data => console.log(data))
//   .catch(error => console.error(error));
