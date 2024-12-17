const express = require('express');
const simpleGit = require('simple-git');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

// Creăm o instanță de Express
const app = express();

// Setăm portul serverului
const PORT = 3000;

// Folosim body-parser pentru a procesa request-urile JSON
app.use(bodyParser.json());

// Rădăcina publică pentru fișierele statice (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint pentru a primi mesajul și link-ul și a le salva în fișier text
app.post('/pushToGitHub', (req, res) => {
    const { message, link } = req.body;

    // Validăm dacă mesajul și link-ul nu depășesc 100 de caractere
    if (message.length > 100 || link.length > 100) {
        return res.status(400).json({ error: 'Mesajul și link-ul nu pot depăși 100 de caractere fiecare.' });
    }

    // Salvăm mesajul și link-ul într-un fișier text
    const filePath = path.join(__dirname, 'messages.txt');
    const content = `${message}\n${link}\n`;

    fs.appendFile(filePath, content, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Eroare la salvarea fișierului.' });
        }

        // Utilizăm simple-git pentru a face commit și push pe GitHub
        const git = simpleGit();

        git.add(filePath)
            .commit('Adăugat mesaj și link')
            .push('origin', 'main', (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Eroare la push-ul pe GitHub.' });
                }
                res.status(200).json({ message: 'Fișierul a fost adăugat și push-uit pe GitHub.' });
            });
    });
});

// Pornim serverul pe portul 3000
app.listen(PORT, () => {
    console.log(`Serverul rulează pe http://localhost:${PORT}`);
});
