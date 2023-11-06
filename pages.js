let fs = require('fs');
let filename = 'index.html'
let notesPage;
try {
    notesPage = fs.readFileSync(filename, 'utf8');
}
catch (err) {
    console.error(`Could not read ${filename}`);
}

let notFoundPage = '404 Not found';
module.exports = {notesPage, notFoundPage};

/*
           <ul ref="list">
                <li v-for="(note, i) in notes" v-bind:key="i" :id="note.id">
                    <article>
                        <div id="note" :style="`background-color: ${note.color};`">
                            <header>{{ note.title }}</header>
                            <p>{{ note.text }}</p>
                            <div>
                                <button @click="del(note.id)">Delete</button>
                            </div>
                        </div>
                    </article>    
                </li>
            </ul>
 */