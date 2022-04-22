
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


const pool = mysql.createPool({
   host: "localhost",
   database: "blog",
   user: "root",
   password: "",
});

console.log(`Connection à ${pool.config.connectionConfig.database}`);

app.get('/', (req, res) => {
   pool.query('SELECT NickName, Contents, CreationTimestamp FROM comment', function (error, results, fields) {
      if (error) {
         throw Error;
      } else {
         console.log(results);
         res.render("layout", { template: "home", data: results})
      }
   });
});


app.get('/commentPage', (req, res) => {
   pool.query('SELECT * FROM comment', function (error, results, fields) {
      if (error) {
         throw Error;
      } else {
         res.render("layout", { template: "commentPage", data: results})
      }
   });
});





app.listen(PORT, () => {
   console.log(`Listening a http://localhost:${PORT}`);
})