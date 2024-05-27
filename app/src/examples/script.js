
document.getElementById('login-tab').addEventListener('click', () => {
    document.getElementById('login-form').classList.add('active');
    document.getElementById('register-form').classList.remove('active');
    document.getElementById('login-tab').classList.add('active');
    document.getElementById('register-tab').classList.remove('active');
  });
  
  document.getElementById('register-tab').addEventListener('click', () => {
    document.getElementById('register-form').classList.add('active');
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('register-tab').classList.add('active');
    document.getElementById('login-tab').classList.remove('active');
  });
  
  document.querySelector('#login-form form').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
  
    try {
      const data = await login('USERNAME_PASSWORD', username, password);
      document.getElementById('login-message').innerText = `Login successful! Token: ${data.token}`;
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
    } catch (error) {
      document.getElementById('register-message').innerText = `Error: ${error.message}`;
    }
  });