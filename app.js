import { fileURLToPath } from "url";
import path from "path";
import express from 'express';
import mysql from 'mysql';

const app = express();
const PORT = 9000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname + '/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const pool = mysql.createPool({
   host: "localhost",
   database: "blog",
   user: "root",
   password: "",
});


// Home Page ************************************************************************************************ 
app.get('/', (req, res) => {
   pool.query(`
   SELECT post.Id,Title,Contents,CreationTimestamp,FirstName, LastName 
   FROM post JOIN author ON post.Author_Id = author.Id`, (error, results) => {
      if (error) {
         throw Error;
      } else {
         res.render("layout", { template: "home", data: results });
      }
   });
});




// Add Page ************************************************************************************************ 
app.get('/newPost', (req, res) => {
   pool.query("SELECT * FROM author",
      (error, resultsAuthor) => {
         if (error) {
            throw Error;
         } else {
            pool.query("SELECT * FROM category", (error, resultsCategory) => {
               res.render("layout", { template: "newPost", author: resultsAuthor, category: resultsCategory })
            });
         }
      });
});


app.post('/newPost', (req, res) => {
   pool.query(`
   INSERT INTO post (Id, Title, Contents, CreationTimestamp, Author_Id, Category_Id) 
   VALUES(NULL, ?, ?, NOW(), ?, ?)`,
      [req.body.title, req.body.contents, req.body.user, req.body.category], (error, resultsSend) => {
         if (error) {
            throw Error;
         } else {
            res.redirect('/newPost');
         };
      });
});




// Admin Page ************************************************************************************************ 
app.get('/admin', (req, res) => {
   pool.query(`
   SELECT Name,post.Id,Title,Contents,CreationTimestamp,FirstName, LastName, Category_Id 
   FROM post JOIN author ON post.Author_Id = author.Id
   INNER JOIN category ON category.Id = post.Category_Id`,
      (error, results) => {
         res.render("layout", { template: "admin", data: results });
      });
});


app.get('/delete/:id', (req, res) => {
   let id = req.params.id;
   pool.query('DELETE FROM post WHERE post.Id = ?', [id], (error, results) => {
      res.redirect('/admin');
   });
});




// Edit Page ************************************************************************************************ 
app.get('/edit/:id', (req, res) => {
   let id = req.params.id;
   pool.query('SELECT * FROM post WHERE post.Id = ?', [id], (error, results) => {
      res.render("layout", { template: "edit", data: results });
   });

   app.post('/edit', (req, res) => {
      pool.query(`
      UPDATE post SET Title = ? , Contents = ? WHERE post.Id = ?`, [req.body.title, req.body.contents, req.body.postId], (err, result) => {
         if (err) {
            console.log(err);
         };
         res.redirect('/admin');
      });
   });
});




// Details Page ************************************************************************************************ 
app.get('/details/:id', (req, res) => {
   let postId = req.params.id;
   pool.query('SELECT * FROM post WHERE Id = ?', [postId], (error, header) => {

      pool.query(`
      SELECT * FROM post 
      JOIN comment JOIN author 
      ON post.Id = comment.Post_Id 
      WHERE author.Id = 1 AND Post_Id = ?`, [postId], (error, results) => {
         res.render("layout", { template: "details", headerData: header, comments: results, idData: postId });
      });
   });

   app.post('/details', (req, res) => {
      pool.query(`
      INSERT INTO comment (NickName, Contents, CreationTimestamp, Post_Id)
      VALUES (?,?,NOW(),?)`, [req.body.nickname, req.body.contents, req.body.postId], (err, result) => {
         if (err) {
            console.log(err);
         };
         res.redirect(`/details/${req.body.postId}`);
      });
   });
});




app.listen(PORT, () => {
   console.log(`Listening a http://localhost:${PORT}`)
})