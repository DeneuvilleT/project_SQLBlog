import { fileURLToPath } from "url";
import session from "express-session";
import path from "path";
import express from 'express';
import mysql from 'mysql';
import bcrypt from 'bcrypt';
import parseurl from 'parseurl';
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
      maxAge: 24 * 60 * 60 * 1000,
   }
}));


const adminPath = ["/admin", "/newPost", "/edit", "/delete"];

app.use((req, res, next) => {

   const pathname = parseurl(req).pathname;
   res.locals.session = req.session;

   if (!req.session.user) {
      req.session.user = null;
      req.session.isLogged = false;
   }

   if (adminPath.includes(pathname) && req.session.user?.role === "user" ) {
      res.redirect('/');
   } else {  
      next();
   }
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
      [req.body.title, req.body.contents, req.body.user, req.body.category], (error, results) => {
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
   const postId = req.params.id;

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
               res.render("layout", { template: "details", headerData: header, comments: results, idData: postId, wrong: req.session.islogged });
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
            console.log(result)
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

   res.render("layout", { template: "login", error: null });
   app.post('/login', (req, res) => {

      const query = `SELECT * FROM user WHERE user.Email = ? `;
      pool.query(query, [req.body.Email], async (err, user) => {
         if (err) {
            res.render("layout",
            { template: "login", error: "Impossible d'acéder au serveur." });
         };

         if (!user.length) {
            res.render("layout",
            { template: "login", error: "Utilisateur inccorect." });
         } else {

            const comp = await bcrypt.compare(req.body.Password, user[0].Password);
            if (comp) {
               req.session.user = {
                  firstname: user[0].FirstName,
                  role: user[0].Role
               };
               req.session.isLogged = true;
               console.log(req.session)
               res.redirect('/admin');

            } else {
               res.render("layout", { template: "login", error: "Mot de passe inccorect." });
            };
         };
      });
   });
});

// NewUser ************************************************************************************************ 
app.get('/register', (req, res) => {
   res.render("layout", { template: "register" });
});

app.post('/register', async (req, res) => {

   const hash = await hash(req.body.password, saltrounds);
   pool.query(`
   INSERT INTO user (Id, Email, Password, Role, FirstName, LastName) 
   VALUES(NULL, ?, ?, 'user', ?, ?)`,

   [req.body.mail, hash, req.body.user, req.body.lastname],
   (error, result) => {

      if (error) {
            console.log(error);;
      } else {
            res.redirect('/admin');
      };
   });
});

app.get('/logout', (req, res) => {
   req.session.destroy();
   console.log(req.session)
   res.redirect("/");
});



app.listen(PORT, () => {
   console.log(`Listening a http://localhost:${PORT}`);
});

