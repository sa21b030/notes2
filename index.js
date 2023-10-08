var notes = [];

function createNote() {
    let title = document.getElementById("title");
    let text = document.getElementById("text");
    let color = document.getElementById("color");
    if (title.value != "" || text.value != "") {
        let article = createArticle(generateId(title.value, text.value), title.value, text.value, color.value);
        document.getElementById("notes").appendChild(article);
        notes.push({id: article.id, title: title.value, text: text.value, color: color.value});
        localStorage.setItem("notes", JSON.stringify(notes));
        title.value = "";
        text.value = "";
        title.focus();
    } else {
        alert("Bitte zumindest Text oder Titel angeben");
    }
}

function createArticle(idValue, titleValue, textValue, colorValue) {
    let title = document.createElement("h1");
    title.textContent = titleValue;
    let text = document.createElement("p");
    text.textContent = textValue;
    let article = document.createElement("article");
    article.setAttribute("id", idValue);
    article.setAttribute("style", "background-color:"+colorValue+";");
    article.setAttribute("data-color", colorValue);
    article.appendChild(title);
    article.appendChild(text);
    article.appendChild(createDeleteButton());
    return article;
}

function createDeleteButton() {
    let btn=document.createElement("button");
    btn.setAttribute("onclick", "deleteArticle(this)");
    btn.textContent = "Delete";
    return btn;   
}

function deleteArticle(button) {
    let thisArticle = button.parentNode;
    thisArticle.parentNode.removeChild(thisArticle);
    let index = notes.findIndex((element) => element.id === thisArticle.getAttribute("id"));
    if (index !== -1) {
       notes = notes.slice(0, index).concat(notes.slice(index+1));
    }
    localStorage.setItem("notes", JSON.stringify(notes));  
}

function init() {
    notes = JSON.parse(localStorage.getItem("notes"));
    const insert = document.getElementById("notes");
    notes.forEach(element => {
       insert.appendChild(createArticle(element.id, element.title, element.text, element.color));
    });
    const title = document.getElementById("title");
    title.addEventListener("keydown", handleKeyDown);
    const text = document.getElementById("text");
    text.addEventListener("keydown", handleKeyDown);
}

function handleKeyDown(event) {
    if (event.key === "Enter" && (event.target.id === "title" || event.ctrlKey) ) {
        createNote();
    }    
}

document.addEventListener("DOMContentLoaded", function () {
    init();
});

function generateId(title, text, length = 10) {
     return CryptoJS.SHA256(title + text + new Date()).toString().substring(0, length);
}