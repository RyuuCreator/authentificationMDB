const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

let corsOptions = {
	origin: "your_ip:8080",
};

app.use(cors(corsOptions));


// PARSE REQ OF CONTENT-TYPE - APPLICATION/JSON
app.use(bodyParser.json());

// PARSE REQ OF CONTENT-TYPE - APPLICATION/X-WWW-FORM-URLENCODED
app.use(bodyParser.urlencoded({ extended: true }));

// SIMPLE ROUTE
app.get("/", (req, res) => {
    res.render("index.ejs");
});
app.set("view engine", "ejs");

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

// SET PORT, LISTEN FOR REQ
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
	console.log(`Le server est démarrer sur le port: ${PORT}`);
});

// CONNECTION DB 

const db = require("./models");
const dbConfig = require("./config/db.config");
const Role = db.role;

db.mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connexion à MongDB réussi !");
    initial();
}).catch(err => {
    console.error("Échec de la connexion", err);
    process.exit();
});

// FUNCTION

function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if(!err && count === 0) {
            new Role({
                name: "user"
            }).save(err => {
                if(err) {
                    console.log("erreur", err);
                }
                console.log("Ajout du role 'user' a la collection.");
            });

            new Role({
                name: "moderator"
            }).save(err => {
                if(err) {
                    console.log("erreur", err);
                }

                console.log("Ajout du role 'moderateur' a la collection.");
            });

            new Role({
                name: "admin"
            }).save(err => {
                if(err) {
                    console.log("erreur", err);
                }

                console.log("Ajout du role 'admin' a la collection.");
            })
        }
    });
}
