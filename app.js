import { fileURLToPath } from "url";
import session from "express-session";
import path from "path";
import express from 'express';
import mysql from 'mysql';
import bcrypt from 'bcrypt';
import 'dotenv/config';


const saltrounds = 10;

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const PORT = process.env.PORT || process.env.SERVER_LOCAL_PORT;
const { HOST_DB, DATABASE_NAME, USERNAME_DB, PASSWORD_DB } = process.env;


app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname + '/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({
   secret: "mot de passe",
   resave: false,
   saveUninitialized: false,
   cookie: {
      maAge: 24 * 60 * 60 * 1000,
   }
}));

app.use((req, res, next) => {

   if (!req.session.user) {
      req.session.user = null,
         req.session.islogged = false;

   }
   next();
});

const pool = mysql.createPool({
   connectionLimit: 10000,
   host: HOST_DB,
   database: DATABASE_NAME,
   user: USERNAME_DB,
   password: PASSWORD_DB,
});


// Home Page ************************************************************************************************ 
app.get('/', (req, res) => {
   pool.query(`
   SELECT post.Id, Title, Contents, CreationTimestamp, FirstName, LastName 
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
      (error1, resultsAuthor) => {
         if (error1) {
            throw Error;
         } else {
            pool.query("SELECT * FROM category", (error2, resultsCategory) => {
               if (error2) {
                  throw Error;
               } else {
                  res.render("layout", { template: "newPost", author: resultsAuthor, category: resultsCategory });
               }
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
            res.redirect('/admin');
         };
      });
});

// Edit Page ************************************************************************************************ 
app.get('/edit/:id', (req, res) => {
   let id = req.params.id;

   pool.query("SELECT * FROM author",
      (error1, resultsAuthor) => {
         if (error1) {
            throw Error;
         } else {
            pool.query("SELECT * FROM category", (error2, resultsCategory) => {
               if (error2) {
                  throw Error;
               } else {
                  pool.query('SELECT * FROM post WHERE post.Id = ?', [id], (error3, results) => {
                     if (error3) {
                        throw Error;
                     } else {
                        res.render("layout", { template: "edit", data: results, author: resultsAuthor, category: resultsCategory });
                     }
                  });
               }
            });
         }
      });


   app.post('/edit', (req, res) => {
      pool.query(`
         UPDATE post SET Title = ? , Contents = ?,  Author_Id = ?, Category_Id = ? WHERE post.Id = ?`,
         [req.body.title, req.body.contents, req.body.user, req.body.category, req.body.postId,], (error2, result) => {
            if (error2) {
               throw Error;
            } else {
               res.redirect('/admin');
            }
         });
   });
});

app.get('/delete/:id', (req, res) => {
   let id = req.params.id;
   pool.query('DELETE FROM post WHERE post.Id = ?', [id], (error, results) => {
      if (error) {
         throw Error;
      } else {
         res.redirect('/admin');
      }
   });
});

// Details Page ************************************************************************************************ 
app.get('/details/:id', (req, res) => {
   let postId = req.params.id;
   pool.query('SELECT * FROM post WHERE Id = ?', [postId], (error1, header) => {
      if (error1) {
         throw Error;
      } else {
         pool.query(`
         SELECT * FROM post 
         JOIN comment JOIN author 
         ON post.Id = comment.Post_Id 
         WHERE author.Id = 1 AND Post_Id = ?`, [postId], (error2, results) => {
            if (error2) {
               throw Error;
            } else {
               res.render("layout", { template: "details", headerData: header, comments: results, idData: postId });
            }
         });
      };
   });

   app.post('/details', (req, res) => {
      pool.query(`
      INSERT INTO comment (NickName, Contents, CreationTimestamp, Post_Id)
      VALUES (?,?,NOW(),?)`, [req.body.nickname, req.body.contents, req.body.postId], (error3, result) => {
         if (error3) {
            throw Error;
         } else {
            res.redirect(`/details/${req.body.postId}`);
         }
      });
   });
});

// Admin Page ************************************************************************************************ 
app.get('/admin', (req, res) => {
   pool.query(`

   SELECT Name, post.Id, Title, Contents, CreationTimestamp, FirstName, LastName, Category_Id 
   FROM post JOIN author ON post.Author_Id = author.Id
   INNER JOIN category ON category.Id = post.Category_Id`,

      (error, results) => {
         if (error) {
            throw Error;
         } else {
            res.render("layout", { template: "admin", data: results });
         }
      });
});


// User ************************************************************************************************ 
app.get('/login', (req, res) => {

   let badPass = false;

   pool.query('SELECT FirstName, Password FROM user', (error, results) => {

      res.render("layout", { template: "login", wrong : badPass });
      app.post('/login', (req, res) => {

         pool.query(`
         SELECT FirstName, Password
         FROM user WHERE user.Password = ?
         AND user.FirstName = ?`,
         [req.body.FirstName, req.body.Password],
         (e, r) => {

            let request = JSON.stringify(req.body);

            for (let i = 0; i < results.length; i++) {
               if (request === JSON.stringify(results[i])) {

                  req.session.islogged = true;
                  res.redirect('/admin');
                  res.end();
                  return;

               } else {
                  
                  badPass = true;
                  res.render("layout", { template: "login", wrong: badPass });
                  return;
               }
            };
         });
      });
   });
});


// NewUser ************************************************************************************************ 
app.get('/register', (req, res) => {
   res.render("layout", { template: "register" });
});

app.post('/register', (req, res) => {
   pool.query(`

   INSERT INTO user (Id, Email, Password, Role, FirstName, LastName) 
   VALUES(NULL, ?, ?, 'user', ?, ?)`,

      [req.body.mail, req.body.password, req.body.user, req.body.lastname],
      (error, result) => {
         if (error) {
            console.log(error);;
         } else {
            res.redirect('/admin');
         };
      });
});



app.listen(PORT, () => {
   console.log(`Listening a http://localhost:${PORT}`);
});

