const express = require("express");
const uniqid = require("uniqid");
const {notes} = require("./db/db");
const path = require("path");
const fs = require('fs');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// API Routes
app.get('/api/notes', (req, res) =>
{
    fs.readFile('./db/db.json', (err, data) => 
    {
        if(err)
        {
            res.status(404).send(`Failed to read notes - Error: ${err}`);
        }
        else
        {
            const results = JSON.parse(data);
            res.json(results.notes);
        }
    });
});

app.post('/api/notes', (req, res) =>
{
    const {title, text} = req.body;
    req.body.id = uniqid();

    if(title && text)
    {
        fs.readFile('./db/db.json', (err, data) => 
        {
            if(err)
            {
                res.status(404).send(`Failed to read notes - Error: ${err}`);
            }
            else
            {
                const notesObj = JSON.parse(data);
                notesObj.notes.push(req.body);

                fs.writeFileSync('./db/db.json', JSON.stringify(notesObj));
                res.json(req.body);
            }
        });
    }
    else
    {
        res.status(404).send("Invalid Entry when submitting new note.");
    }
});
// End of API Routes

// HTML Routes
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);
// End of HTML Routes

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);