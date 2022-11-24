// const { application } = require("express");
const express = require("express");
let app = express();
app.use(express.json());
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
let mysql = require("mysql2");
let connData = {
  host: "localhost",
  user: "root",
  password: "manish",
  database: "data",
  insecureAuth: true,
};
let port = 2410;
// function showPersons() {
//   let connectin = mysql.createConnection(connData);
//   let sql = "SELECT * FROM purchases";
//   connectin.query(sql, function (err, result) {
//     if (err) console.log("error  in database", err.message);
//     else console.log(result);
//   });
// }

// showPersons();
app.get("/shops", function (req, res, next) {
  let connectin = mysql.createConnection(connData);
  console.log("Inside /users get api");
  const query = ` SELECT * FROM shops`;
  connectin.query(query, function (err, result) {
    if (err) {
      res.status(400).send(err);
    }
    res.send(result);
  });
});
app.get("/products", function (req, res, next) {
  let connectin = mysql.createConnection(connData);
  console.log("Inside /users get api");
  const query = ` SELECT * FROM products`;
  connectin.query(query, function (err, result) {
    if (err) {
      res.status(400).send(err);
    }
    res.send(result);
  });
});
app.post("/shops", function (req, res) {
  var values = Object.values(req.body);
  let connectin = mysql.createConnection(connData);
  console.log("Inside /users get api with brand");

  const query = `INSERT INTO shops(shopName,rent) VALUES (?,?)`;
  connectin.query(query, values, function (err, result) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.send(result);
    }
  });
});
app.post("/products", function (req, res) {
  var values = Object.values(req.body);
  let connectin = mysql.createConnection(connData);
  console.log("Inside /users get api with brand");

  const query = `INSERT INTO products(productName,category,description) VALUES (?,?,?)`;
  connectin.query(query, values, function (err, result) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.send(result);
    }
  });
});
app.get("/products/:id", function (req, res) {
  let id = +req.params.id;
  let connectin = mysql.createConnection(connData);
  console.log("Inside /users get api with id");
  const query = ` SELECT * FROM products where productId=?`;
  connectin.query(query, id, function (err, result) {
    if (err) {
      res.status(400).send(err);
    }
    let arr = result.find((n) => n.productId === id);
    if (arr) res.send(arr);
    else res.status(404).send("no product find");
  });
});
app.put("/products/:productId", function (req, res, next) {
  let productId = req.params.productId;
  let category = req.body.category;
  let description = req.body.description;
  let values = [category, description, productId];
  let connectin = mysql.createConnection(connData);
  console.log("Inside /users get api with brand");

  const query = `UPDATE products SET category=?, description=? WHERE productId=?`;
  connectin.query(query, values, function (err, result) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/purchases", function (req, res, next) {
  let sort = req.query.sort;
  let shopId = req.query.shopId;
  let product = req.query.productId;
  let connectin = mysql.createConnection(connData);
  console.log("Inside /users get api");
  const query = ` SELECT * FROM purchases`;
  connectin.query(query, sort || shopId || product, function (err, result) {
    if (err) {
      res.status(400).send(err);
    }
    if (sort === "QtyAsc")
      result = result.sort((st1, st2) => st1.quantity - st2.quantity);
    if (sort === "QtyDesc")
      result = result.sort((st1, st2) => st2.quantity - st1.quantity);
    if (sort === "ValueAsc")
      result = result.sort(
        (st1, st2) => st1.price * st1.quantity - st2.price * st2.quantity
      );
    if (sort === "ValueDesc")
      result = result.sort(
        (st1, st2) => st2.price * st2.quantity - st1.price * st1.quantity
      );
    if (shopId) {
      result = result.filter((n) => n.shopId === shopId);
    }
    // result = filterParam(result, "shop", shop);
    result = filterParam(result, "product", product);

    res.send(result);
    console.log(result);
  });
});

let filterParam = (arr, name, values) => {
  if (!values) return arr;
  let valuesArr = values.split(",");
  let arr1 = arr.filter((a1) => valuesArr.find((val) => val === a1[name]));
  return arr1;
};
app.get("/purchases/shops/:shopId", function (req, res, next) {
  let shopId = +req.params.shopId;
  let connectin = mysql.createConnection(connData);
  console.log("Inside /users get api with id");
  const query = ` SELECT * FROM purchases where shopId=?`;
  connectin.query(query, shopId, function (err, result) {
    if (err) {
      res.status(400).send(err);
    }
    let arr = result.filter((n) => n.shopId === shopId);
    console.log(arr);
    if (arr) res.send(arr);
    else res.status(404).send("no product find");
  });
});
app.get("/purchases/product/:productId", function (req, res, next) {
  let productId = +req.params.productId;
  let connectin = mysql.createConnection(connData);
  console.log("Inside /users get api with id");
  const query = ` SELECT * FROM purchases where productId=?`;
  connectin.query(query, productId, function (err, result) {
    if (err) {
      res.status(400).send(err);
    }
    let arr = result.filter((n) => n.productId === productId);
    console.log(arr);
    if (arr) res.send(arr);
    else res.status(404).send("no product find");
  });
});
app.post("/purchases", function (req, res) {
  var values = Object.values(req.body);
  let connectin = mysql.createConnection(connData);
  console.log("Inside /users get api with brand");

  const query = `INSERT INTO purchases(shopId, productId,quantity,price) VALUES (?,?,?,?)`;
  connectin.query(query, values, function (err, result) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.send(result);
    }
  });
});
// app.get("/purchases/:id", function (req, res) {
//   let id = +req.params.id;
//   let connectin = mysql.createConnection(connData);
//   console.log("Inside /users get api with id");
//   const query = ` SELECT * FROM purchases where purchaseId=?`;
//   connectin.query(query, id, function (err, result) {
//     if (err) {
//       res.status(400).send(err);
//     }
//     let arr = result.find((n) => n.purchaseId === id);
//     if (arr) res.send(arr);
//     else res.status(404).send("no product find");
//   });
// });
// app.get("/purchases/totalPurchases/shops/:shopId", function (req, res, next) {
//   let shopId = +req.params.shopId;
//   let connectin = mysql.createConnection(connData);
//   console.log("Inside /users get api with id");
//   const query = ` SELECT  Sum(price) as totalPurchases  FROM purchases where shopId=?`;
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
app.listen(port, () => console.log(`node app listening on port ${port}!`));
