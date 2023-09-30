function createNote() {
    if (document.getElementById("title").value!="" || document.getElementById("text").value!="") {
        let article=createArticle();
        document.getElementById("notes").appendChild(article);
        localStorage.setItem("notes", document.getElementById("notes").innerHTML);
    } else {
        alert("Bitte zumindest Text oder Titel angeben");
    }
}

function createArticle() {
    let title=document.createElement("h1");
    title.innerHTML=document.getElementById("title").value;
    let text=document.createElement("p");
    text.innerHTML=document.getElementById("text").value;
    let article=document.createElement("article");
    article.setAttribute("style", "background-color:"+document.getElementById("color").value+";");
    article.appendChild(title);
    article.appendChild(text);
    article.appendChild(createDeleteButton());
    return article;
}

function createDeleteButton() {
    let btn=document.createElement("button");
    btn.setAttribute("onclick", "deleteArticle(this)");
    btn.innerHTML="Delete";
    return btn;   
}

function deleteArticle(button) {
    let thisArticle=button.parentNode;
    thisArticle.parentNode.removeChild(thisArticle);
}

window.onload=init;
function init() {
    document.getElementById("notes").innerHTML=localStorage.getItem("notes");
}