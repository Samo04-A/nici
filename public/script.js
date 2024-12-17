document.getElementById('textForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const message = document.getElementById('message').value;
    const link = document.getElementById('link').value;

    if (message.length <= 100 && link.length <= 100) {
        const statusElement = document.getElementById('status');
        statusElement.textContent = 'Datele sunt trimise, te rog așteaptă...';

        // Trimitem datele către server pentru a le salva și face commit/push pe GitHub
        fetch('/pushToGitHub', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message, link: link })
        })
        .then(response => response.json())
        .then(data => {
            statusElement.textContent = data.message;
        })
        .catch(error => {
            statusElement.textContent = 'Eroare: ' + error.message;
        });
    } else {
        alert('Mesajul și link-ul nu pot depăși 100 de caractere fiecare.');
    }
});
