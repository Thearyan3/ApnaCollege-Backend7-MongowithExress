const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError");

app.set("views", path.join(__dirname, "views"));
app.set("views engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

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

//Index Route
app.get("/chats", async (req, res, next) => {
    try {
        let chats = await Chat.find();
        // console.log(chats);
        res.render("index.ejs", { chats })
    } catch (err) {
        next(err);
    }

});

//New Route
app.get("/chats/new", (req, res, next) => {
    // try {
         res.render("new.ejs");
    //     throw new ExpressError(404, "Page Not Found!");
    // } catch (err) {
    //     next(err);
    // }
});

//Create Route
app.post("/chats", asyncWrap(async (req, res, next) => {
        let { from, to, msg } = req.body;
        let newChat = Chat({
            from: from,
            to: to,
            msg: msg,
            created_at: new Date()
        });

        await newChat.save();
        res.redirect("/chats");
})
);

function asyncWrap(fn){
    return function(req, res, next){
        fn(req, res, next).catch((err) => next(err));
    };
}

// New - Show Route 
app.get("/chats/:id", asyncWrap(async (req, res, next) => {
        let { id } = req.params;
        const chat = await Chat.findById(id);
        if (!chat) {
            next(new ExpressError(500, "Chat not found!"));
        }
        res.render("edit.ejs", { chat });
}));

//Edit Route
app.get("/chats/:id/edit", async (req, res, next) => {
    try {
        let { id } = req.params;
        let chat = await Chat.findById(id);
        res.render("edit.ejs", { chat });
    } catch (err) {
        next(err);
    }
});

//Update Route
app.put("/chats/:id", asyncWrap(async (req, res, next) => {
        let { id } = req.params;
        let { msg: newMsg } = req.body;
        let updatedChat = await Chat.findByIdAndUpdate(
            id,
            { msg: newMsg },
            { runValidators: true, new: true });
        console.log(updatedChat);
        res.redirect("/chats");
    })
);

//Delete Route
app.delete("/chats/:id", asyncWrap(async (req, res, next) => {
        let { id } = req.params;
        let deleteChat = await Chat.findByIdAndDelete(id);
        console.log(deleteChat);
        res.redirect("/chats");
})
);

const handleValidationerr = (err) => {
    console.log("This is a validation Error");
    console.dir(err.message);
    return err;
}

app.use((err, req, res, next) => {
    console.log(err.name);
    if(err.name === "ValidationError"){
        err = handleValidationerr(err);
    }
    next(err);
});

// Error Handling Middleware 
app.use((err, req, res, next) => {
    let { status = 500, message = "Some Error Occured" } = err;
    res.status(status).send(message);
})

app.get("/", (req, res) => {
    res.send("Root is working");
});

app.listen(8080, () => {
    console.log("Server is listening to the port 8080");
});