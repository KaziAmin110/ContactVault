
let JWT_TOKEN;

document.getElementById('login-tab').addEventListener('click', () => {
  showForm('login-form');
});

document.getElementById('register-tab').addEventListener('click', () => {
  showForm('register-form');
});

document.querySelector('#login-form form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  try {
      const data = await login('USERNAME_PASSWORD', username, password);
      document.getElementById('login-message').innerText = `Login successful! Token: ${data.token}`;
      showAuthenticatedForms();
      JWT_TOKEN = data.token;
  } catch (error) {
      document.getElementById('login-message').innerText = `Error: ${error.message}`;
  }
});

document.querySelector('#register-form form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;
  const firstName = document.getElementById('register-first-name').value;
  const lastName = document.getElementById('register-last-name').value;

  try {
      const data = await register('USERNAME_PASSWORD', username, password, firstName, lastName);
      document.getElementById('register-message').innerText = `Registration successful! Token: ${data.token}`;
      showAuthenticatedForms();
  } catch (error) {
      document.getElementById('register-message').innerText = `Error: ${error.message}`;
  }
});

function showForm(formId) {
  document.querySelectorAll('.form').forEach(form => form.classList.remove('active'));
  document.getElementById(formId).classList.add('active');
  document.querySelectorAll('nav button').forEach(button => button.classList.remove('active'));
  document.querySelector(`#${formId.replace('-form', '-tab')}`).classList.add('active');
}

function showAuthenticatedForms() {
  document.querySelectorAll('.form').forEach(form => form.classList.add('active'));
}

document.querySelector('#add-contact-form form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const contact = {
      first_name: document.getElementById('contact-first-name').value,
      last_name: document.getElementById('contact-last-name').value,
      email_address: document.getElementById('contact-email').value,
      bio: document.getElementById('contact-bio').value,
      description: document.getElementById('contact-description').value
  };
  const token = JWT_TOKEN; // You should get this from the login response

  try {
      const data = await addContact(token, contact);
      console.log(data);
      document.getElementById('add-contact-message').innerText = `Contact Added: ${JSON.stringify(data)}`;
  } catch (error) {
      document.getElementById('add-contact-message').innerText = `Error: ${error.message}`;
  }
});

document.querySelector('#get-contact-form form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const contactId = document.getElementById('get-contact-id').value;
  const token = JWT_TOKEN;

  try {
      const contact = await getContact(token, contactId);
      console.log(contact);
      document.getElementById('get-contact-message').innerText = `Contact: ${JSON.stringify(contact)}`;
  } catch (error) {
      document.getElementById('get-contact-message').innerText = `Error: ${error.message}`;
  }
});

document.querySelector('#delete-contact-form form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const contactId = document.getElementById('delete-contact-id').value;
  const token = JWT_TOKEN;

  try {
      let contact = await deleteContact(token, contactId);
      console.log(contact);
      document.getElementById('delete-contact-message').innerText = `Contact Deleted: ${JSON.stringify(contact)}`;
  } catch (error) {
      document.getElementById('delete-contact-message').innerText = `Error: ${error.message}`;
  }
});

document.querySelector('#update-contact-form form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const contact = {
      id: document.getElementById('update-contact-id').value,
      first_name: document.getElementById('update-contact-first-name').value,
      last_name: document.getElementById('update-contact-last-name').value,
      email_address: document.getElementById('update-contact-email').value,
      bio: document.getElementById('update-contact-bio').value,
      description: document.getElementById('update-contact-description').value
  };
  const token = JWT_TOKEN;

  try {
      const updatedContact = await updateContact(token, contact);
      console.log(updatedContact);
      document.getElementById('update-contact-message').innerText = `Contact Updated: ${JSON.stringify(updatedContact)}`;
  } catch (error) {
      document.getElementById('update-contact-message').innerText = `Error: ${error.message}`;
  }
});

document.querySelector('#search-contacts-form form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const query = document.getElementById('search-query').value;
  const token = JWT_TOKEN;

  try {
      const contacts = await searchContacts(token, query);
      console.log(contacts);
      document.getElementById('search-contacts-message').innerText = `Contacts: ${JSON.stringify(contacts)}`;
  } catch (error) {
      document.getElementById('search-contacts-message').innerText = `Error: ${error.message}`;
  }
});
