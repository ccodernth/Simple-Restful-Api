//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://root:<password>@cluster0.yulz1tg.mongodb.net/DB?retryWrites=true&w=majority", {
  useNewUrlParser: true
});


const articleSchema = {
    title: String,
    content: String
  };
  
  const Article = mongoose.model("Article", articleSchema);
  

  app.route("/articles")


  .get(function(req, res){
    Article.find(function(err, articles){
      if (articles) {
        const jsonArticles = JSON.stringify(articles);
        res.send(jsonArticles);
      } else {
        res.send("No articles currently in wikiDB.");
      }
    });
  })
  
  .post(function(req, res){
    const newArticle = Article({
      title: req.body.title,
      content: req.body.content
    });
  
    newArticle.save(function(err){
      if (!err){
        res.send("Successfully added a new article.");
      } else {
        res.send(err);
      }
    });
  })
  
  .delete(function(req, res){
  
    Article.deleteMany(function(err){
      if (!err){
        res.send("Successfully deleted all the articles in wikiDB.");
      } else {
        res.send(err);
      }
    });
  
  });
  
  

//spesifik id
app.route("/articles/:articleTitle").get(function(req, res){
  
  Article.findOne({title:req.params.articleTitle}, function(err, foundArticle){
    if(foundArticle)
    {
      res.send(foundArticle);

    }else{
      res.send("No article found");
    }

  });
  
 

})

.patch(function(req, res){
  const articleTitle = req.params.articleTitle;
  Article.update(
    {title: articleTitle},
    {content: req.body.newContent},
    function(err){
      if (!err){
        res.send("Successfully updated selected article.");
      } else {
        res.send(err);
      }
    });
})

.put(function(req, res){

  const articleTitle = req.params.articleTitle;

  Article.update(
    {title: articleTitle},
    {content: req.body.newContent},
    {overwrite: true},
    function(err){
      if (!err){
        res.send("Successfully updated the content of the selected article.");
      } else {
        res.send(err);
      }
    });
})
.delete(function(req, res){
  const articleTitle = req.params.articleTitle;
  Article.deleteOne(
    {title: articleTitle},
    function(err){
      if(!err){
        res.send("deleted data");
      }
      else {
        res.send(err);
      }
    }

  );

})




;


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
