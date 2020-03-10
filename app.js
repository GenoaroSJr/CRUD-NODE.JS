//Carregando módulos
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const admin = require('./routes/admin');
const path = require('path'); // manipular pastas e diretorios
const mongoose = require('mongoose');
const session = require("express-session");
const flash = require("connect-flash");
require("./models/Postagem");
const Postagem = mongoose.model("postagens");

//Configurações
    // Sessão
        app.use(session({
            secret: "siteneidaunifei", // ele cria uma sessão
            resave: true,
            saveUninitialized: true
        }));
        app.use(flash());
    // Middleware
        app.use((req,res,next)=>{
            res.locals.success_msg = req.flash("success_msg");
            res.locals.error_msg = req.flash("error_msg");
            next();
        });
    //Body Parser
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
    //Handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}));
        app.set('view engine', 'handlebars');
    //Mongoose
        mongoose.connect('mongodb://localhost/nei').then(() => {
            console.log("Conectado com sucesso");
        }).catch((erro) => {
            console.log("Erro ao se conectar: "+erro);
        });
        //Em breve
    
    //Public
        app.use(express.static(path.join(__dirname,"public")));

//Rotas
    app.get('/', (req,res)=>{
        Postagem.find().populate("categoria").sort({data: 'desc'}).then((postagens)=>{
            res.render("index", {postagens: postagens});
        }).catch((error)=>{
            req.flash("error_msg", "Houve um erro interno!");
            res.redirect("/404");
        })
    })

    app.get("/postagem/:slug", (req,res)=>{
        Postagem.findOne({slug: req.params.slug}).then((postagem)=>{
            if(postagem){
                res.render("postagem/index", {postagem: postagem})
            }else{
                req.flash("error_msg", "Essa postagem não existe!");
                res.redirect('/');
            }
        }).catch((erro)=>{
            req.flash("error_msg", "Houve um error interno!");
            res.redirect("/")
        })
    })

    app.get("/404", (req,res)=>{
        res.send("ERRO 404!");
    })

    app.use('/admin', admin); 
//Outros
const PORT = 8081; 
app.listen(PORT, () =>{
    console.log("Servidor Rodando em http://localhost:8081");
});