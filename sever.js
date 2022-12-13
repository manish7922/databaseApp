let express = require("express");
let app = express();
app.use(express.json());
let { Client } = require("pg");

const client = new Client({
  user: "postgres",
  password: "Manish@79834",
  database: "postgres",
  port: 5432,
  host: "db.wopbctvhsjxrljomvuhi.supabase.co",
  // ssl: { rejectUnauthorized: false },
  //   idleTimeoutMillis: 0,
  //   connectionTimeoutMillis: 0,
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,OPTIONS,POST,PATCH,DELETE,HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  next();
});
var port = process.env.PORT || 3001;

client.connect(function (res, error) {
  console.log(`Connected!!!`);
});
// connect();
app.listen(port, () => console.log(`node app listening on port ${port}!`));

app.get("/shops", function (req, res) {
  console.log("Inside /users get api");
  const query = "SELECT * FROM shops";
  client.query(query, function (err, result) {
    if (err) {
      res.status(400).send(err);
    }
    res.send(result.rows);
    console.log(result.rows);
  });
});
app.get("/products", function (req, res) {
  console.log("Inside /users get api");
  const query = "SELECT * FROM products";
  client.query(query, function (err, result) {
    if (err) {
      res.status(400).send(err);
    }
    res.send(result.rows);
    console.log(result.rows);
  });
});
app.get("/purchases", function (req, res) {
  let sort = req.query.sort;
  let values = [sort];
  console.log("Inside /users get api");
  const query = "SELECT * FROM purchases";
  client.query(query, function (err, result) {
    if (err) {
      res.status(400).send(err);
    }
    let results = result.rows;
    // if (sort === "QtyAsc")
    //   results = results.sort((st1, st2) => st1.quantity - st2.quantity);
    // if (sort === "QtyDesc")
    //   results = results.sort((st1, st2) => st2.quantity - st1.quantity);
    // if (sort === "ValueAsc")
    //   results = results.sort(
    //     (st1, st2) => st1.price * st1.quantity - st2.price * st2.quantity
    //   );
    // if (sort === "ValueDesc")
    //   results = results.sort(
    //     (st1, st2) => st2.price * st2.quantity - st1.price * st1.quantity
    //   );
    res.send(result.rows);
    console.log(result);
  });
});
app.post("/shops", function (req, res) {
  var values = Object.values(req.body);

  console.log("Inside /users get api with brand");

  const query = `INSERT INTO shops(shopName,rent) VALUES ($1,$2)`;
  client.query(query, values, function (err, result) {
    if (err) {
      res.status(400).send(err);
    }
    console.log(result);
    res.send(`${result.rows} insertion successful`);
  });
});
app.post("/products", function (req, res) {
  var values = Object.values(req.body);

  console.log("Inside /users get api with brand");

  const query = `INSERT INTO products(productName,category,description) VALUES ($1,$2,$3)`;
  client.query(query, values, function (err, result) {
    if (err) {
      res.status(400).send(err);
    }
    console.log(result);
    res.send(`${result.rows} insertion successful`);
  });
});
app.get("/products/:id", function (req, res) {
  let id = +req.params.id;
  let values = [id];

  console.log("Inside /users get api with id");
  const query = ` SELECT * FROM products WHERE productid=$1`;
  client.query(query, values, function (err, result) {
    if (err) {
      res.status(400).send(err);
    }

    let results = result.rows;
    let arr = results.find((n) => n.productid === id);
    console.log(arr);
    if (arr) res.send(arr);
    else res.status(404).send("no student find");
  });
});
app.put("/products/:productid", function (req, res, next) {
  let productid = req.params.productid;
  let productname = req.body.productname;
  let category = req.body.category;
  let description = req.body.description;
  let values = [productname, category, description, productid];

  console.log("Inside /users edit");

  const query = `UPDATE products SETproductname=$1 category=$2, description=$3 WHERE productid=$4`;
  client.query(query, values, function (err, result) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.send(`${result.rowCount} updation successful`);
      console.log(result.rowCount);
    }
    // client.end();
  });
});
// app.get("/purchases/shops/:shopId", function (req, res, next) {
//   let shopId = +req.params.shopId;
//   let connectin = mysql.createConnection(connData);
//   console.log("Inside /users get api with id");
//   const query = ` SELECT * FROM purchases where shopId=?`;
//   connectin.query(query, shopId, function (err, result) {
//     if (err) {
//       res.status(400).send(err);
//     }
//     let arr = result.filter((n) => n.shopId === shopId);
//     console.log(arr);
//     if (arr) res.send(arr);
//     else res.status(404).send("no product find");
//   });
// });
app.get("/purchases/shops/:shopid", function (req, res) {
  let shopid = +req.params.shopid;
  let values = [shopid];

  console.log("Inside /users get api with id");
  const query = ` SELECT * FROM purchases WHERE shopid=$1`;
  client.query(query, values, function (err, result) {
    if (err) {
      res.status(400).send(err);
    }

    let results = result.rows;
    let arr = results.filter((n) => n.shopid === shopid);
    console.log(arr);
    if (arr) res.send(arr);
    else res.status(404).send("no student find");
  });
});
app.get("/purchases/product/:productid", function (req, res) {
  let productid = +req.params.productid;
  let values = [productid];

  console.log("Inside /users get api with id");
  const query = ` SELECT * FROM purchases WHERE productid=$1`;
  client.query(query, values, function (err, result) {
    if (err) {
      res.status(400).send(err);
    }

    let results = result.rows;
    let arr = results.filter((n) => n.productid === productid);
    console.log(arr);
    if (arr) res.send(arr);
    else res.status(404).send("no student find");
  });
});

app.post("/purchases", function (req, res) {
  var values = Object.values(req.body);

  console.log("Inside /users get api with brand");

  const query = `INSERT INTO purchases(shopId, productId,quantity,price) VALUES ($1,$2,$3,$4)`;
  client.query(query, values, function (err, result) {
    if (err) {
      res.status(400).send(err);
    }
    console.log(result);
    res.send(`${result.rows} insertion successful`);
  });
});
