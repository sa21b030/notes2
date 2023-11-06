const fs = require('fs');
const {notesPage, notFoundPage} = require ('./pages.js');
const { createContext } = require('vm');
const { decode } = require('punycode');
const notesFile = 'notes.dat';
const replaceToken = 'XXXXREPLACEXXXX';
const { createHmac } = require('node:crypto');

function router(request, response) {
    const {url, method} = request;
    if (url === "/") {
        response.writeHead(301, {Location: '/index.html'});
        return response.end();
    } else if (url === '/index.html') {
        response.setHeader('Content-Type', 'text/html');
        let jsonText = '';
        let storedNotes = [];
        let notesHTML = '';
        try {
            jsonText = fs.readFileSync(notesFile, 'utf8');
            storedNotes = JSON.parse(jsonText);
            if (storedNotes.length != 0) {
                notesHTML += '<ul ref="list">';
                storedNotes.forEach(element => {
                    notesHTML += '<li><article>';
                    notesHTML += `<div id="${element.id}" style="background-color: ${element.color};">`;
                    notesHTML += `<header>${element.title}</header>`;
                    notesHTML += `<p>${element.text}</p>`;
                    notesHTML += '<div class="center">';
                    notesHTML += `<button type="submit" name="submit" value="${element.id}">Delete</button>`;
                    notesHTML += '</div></div></article></li>';
                });
                notesHTML += '</ul>';
            }
        }
        catch (err) {
            console.error('could not read notes.dat');
        }
        return response.end(notesPage.replace(replaceToken,notesHTML));
    } else if (url === '/index/action') {
        console.log('action');
        const data = [];
        request.on('data', chunk => data.push(chunk.toString()));
        request.on('end', () => {
            processNote(data);
            response.writeHead(302, {Location: '/'});
            return response.end();
        })        
    } else if (url === '/index.css') {
        fs.readFile('index.css', (err, data) => {
            if (!err) {
                response.setHeader('Content-Type', 'text/css');
                return response.end(data);
            }
            else console.error('Could not read index.css');
        });
    } else {
        response.statusCode = 404;
        response.end(notFoundPage);
    }
}

function processNote(data) {
    const decoded = decodeURIComponent(data)+'&';
    const action = getKeyValue(decoded, 'submit');
    if (action === 'create') {
        const title = getKeyValue(decoded, 'title');
        const text = getKeyValue(decoded, 'text');
        const color = getKeyValue(decoded, 'color');
        const note = {
            id: createHmac('sha256', title + text + new Date()).digest('hex'),
            title: title,
            text: text,
            color: color
        }
        let jsonText = '';
        let storedNotes = [];
        try {
            jsonText = fs.readFileSync(notesFile, 'utf8');
            storedNotes = JSON.parse(jsonText);
        }
        catch (err) {
            console.error(`Could not read ${notesFile}`);
        }
        storedNotes.push(note);
        try {
            fs.writeFileSync(notesFile, JSON.stringify(storedNotes), 'utf8');
        }
        catch (err) {
            console.error(`could not write to ${notesFile}`);
        }
    }
    else {
        const noteId = getKeyValue(decoded, 'submit');
        let jsonText = '';
        let storedNotes = [];
        try {
            jsonText = fs.readFileSync(notesFile, 'utf8');
            storedNotes = JSON.parse(jsonText);
        }
        catch (err) {
            console.error(`Could not read ${notesFile}`);
        }
        console.log('deleting: '+noteId);
        storedNotes = storedNotes.filter(element => element.id != noteId);
        try {
            fs.writeFileSync(notesFile, JSON.stringify(storedNotes), 'utf8');
        }
        catch (err) {
            console.error(`could not write to ${notesFile}`);
        }
    }
}

function getKeyValue(decoded, key) {
    return decoded.match(new RegExp(`${key}=(.*?)&`, 'i'))[1]
        .replace(/\+/g," ");
}

module.exports = {router};