const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Categoria");
const Categoria = mongoose.model("categorias");

router.get('/',(req,res)=>{
    res.render("admin/index");
});

router.get('/posts', (req,res)=>{
    res.send("Paginas de Posts");
});

router.get('/categorias', (req,res)=>{
    res.render("admin/categorias");
});

router.get('/categorias/add',(req,res)=>{
    res.render("admin/addcategorias");
});

router.post("/categorias/nova", (req,res)=>{
    //validação de formulários;
    var erros = []
    console.log(req.body.nome);
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"}); //push serve para colocar um novo dado dentro do array.
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"});
    }

    if(req.body.nome.length < 2){
        erros.push({texto: "Nome muito pequeno"});
    }

    if(erros.length > 0){
        res.render("admin/addcategorias",{erros: erros});
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        new Categoria(novaCategoria).save().then(()=>{
            req.flash("success_msg", "Categoria criada com sucesso!");
            res.redirect("/admin/categorias");
        }).catch((erro)=>{
            req.flash("error_msg", "Houve um erro ao salcar a categoria, tente novamnte!");
            res.redirect("/admin");
        });
    }//fim else  
}); //fim router categoria

module.exports = router;