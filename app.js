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
console.log(`Connection à ${pool.config.connectionConfig.database}`);




// ************************************************************************************************ Home
app.get('/', (req, res) => {
   pool.query(`
   SELECT post.Id,Title,Contents,CreationTimestamp,FirstName, LastName 
   FROM post JOIN author ON post.Author_Id = author.Id`, (error, results) => {
      if (error) {
         throw Error;
      } else {
         res.render("layout", { template: "home", data: results });
      };
   });
});


// ************************************************************************************************ Ajout d'un article
app.get('/newPost', (req, res) => {
   pool.query("SELECT * FROM category JOIN author GROUP BY category.Id", (error, results) => {
      if (error) {
         throw Error;
      } else {
         res.render("layout", { template: "newPost", data: results })
         // console.log(results)
      }
   });
   app.post('/newPost', (req, res) => {
      pool.query("INSERT INTO post (Id, Title, Contents, CreationTimestamp, Author_Id, Category_Id) VALUES(NULL, ?, ?, NOW(), 2, 1)",
         [req.body.title, req.body.contents, req.body.user], (error, results) => {
            if (error) {
               throw Error;
            } else {
               res.redirect('/newPost');
               // console.log(results);
            }
         });
   });
});




// ************************************************************************************************ Admin
app.get('/admin', (req, res) => {
   pool.query(`
   SELECT Name,post.Id,Title,Contents,CreationTimestamp,FirstName, LastName, Category_Id 
   FROM post JOIN author ON post.Author_Id = author.Id
   INNER JOIN category ON category.Id = post.Category_Id`,
      (error, results) => {
         res.render("layout", { template: "admin", data: results })
      });
});

app.get('/delete/:id', (req, res) => {
   let id = req.params.id;
   pool.query('DELETE FROM post WHERE post.Id = ?', [id], (error, results) => {
      res.redirect('/admin');
   });
});



// app.get('/edit/:id', (req, res) => {
//    let id = req.params.id;
//    pool.query('INSERT FROM post  ');
// });



// ************************************************************************************************ Details
app.get('/details/:id', (req, res) => {
   let id = req.params.id;
   pool.query('SELECT * FROM post WHERE Id = ?', [id], (error, commentOne) => {

      pool.query(`
      SELECT * FROM post 
      JOIN comment JOIN author 
      ON post.Id = comment.Post_Id 
      WHERE author.Id = 1 AND Post_Id = ?`, [id], (error, results) => {
         res.render("layout", { template: "details", comment: commentOne, data:results });
         console.log(commentOne,id); 
      });
   });
   

   app.post('/details', (req, res) => {
      pool.query(`
      INSERT INTO comment (NickName, Contents,CreationTimestamp, Post_Id)
      VALUES (?,?,NOW(),?)`, [req.body.nickname, req.body.contents, id], (err, result) => {
         if (err) {
            console.log(err);
         };
         res.redirect(`/details/${id}`);
      });
   });
});











app.listen(PORT, () => {
   console.log(`Listening a http://localhost:${PORT}`);
})