const mongoose = require('mongoose');
const Chat = require("./models/chat.js");

main()
    .then((res) => {
        console.log("connection is successful");
    })
    .catch(err =>
        console.log(err)
    );

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');
}


let allchats = [
    {
        from: "Aryan",
        to: "God",
        msg: "Give me strength",
        created_at: new Date()
    },
    {
        from: "Aryan",
        to: "Barfi",
        msg: "Bhaag le thoda",
        created_at: new Date()
    },
    {
        from: "Aryan",
        to: "Mammy",
        msg: "Khana bna do",
        created_at: new Date()
    },
    {
        from: "Aryan",
        to: "itself",
        msg: "m lajwaab hu",
        created_at: new Date()
    },
];
Chat.insertMany(allchats); 