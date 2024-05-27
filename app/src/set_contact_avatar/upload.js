const url = new URL(window.location.href);
const hostname = url.hostname;
const port = url.port;
const urlBase = url.protocol + '//' + (port ? `${hostname}:${port}` : hostname);

document.getElementById('uploadForm').addEventListener('submit', function(e) {
    e.preventDefault();

    let formData = new FormData();
    let jwtField = document.querySelector('input[id="jwt"]');
    console.log("jwtField.value=" + jwtField.value);
    let contactIdField = document.querySelector('input[id="contact_id"]');
    console.log("contactIdField.value=" + contactIdField.value);

    let fileField = document.querySelector('input[type="file"]');

    formData.append('image', fileField.files[0]);

    // Adding JSON-encoded data
    let jsonData = {
        contact_id: contactIdField.value,
    };

    formData.append('json', JSON.stringify(jsonData));

    fetch(urlBase + '/api/set_contact_avatar.php', {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': 'Bearer ' + jwtField.value
        }
    })
    .then(response => response.json())
    .then(result => {
        console.log('Success:', result);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
