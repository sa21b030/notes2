const { createApp } = Vue;
createApp({
     data() {
         return {
            notes: [],
            title: null,
            text: null,
         };
     },
     created() {
        this.notes = JSON.parse(localStorage.getItem("notes")) || [];
    },
     methods: {
        add() {
            if (this.text || this.title) {
                this.notes.push(createNote(this.title, this.text, document.getElementById("color").value));
                this.title = "";
                this.text = "";
                this.$refs.title.focus();
            }
        },
        del(id) {
            const position = this.notes.findIndex((note) => note.id === id);
            this.notes.splice(position, 1);
        }
     },
    watch: {
        notes: {
            handler(val) {
                localStorage.setItem("notes", JSON.stringify(val));
            },
            deep: true
        }    
    }
}).mount("#app");

function createNote(title, text, color) {
    const id = generateId(title, text);
    return { id, title, text, color };
}
    
function generateId(title, text, length = 10) {
    return CryptoJS.SHA256(title + text + new Date())
    .toString()
    .substring(0, length);
}    