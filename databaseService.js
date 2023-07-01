import mysql from "mysql";
import dotenv from "dotenv";

// calling config function which will read .env file
dotenv.config();

let pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB,
  connectionLimit: process.env.CONN_LIMIT,
});

function queryExecutor(query) {
  console.log("query", query);

  return new Promise((resolve, reject) => {
    pool.query(query, function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(result);
    });
  });
}

export function insertIntoDB(taskName, userID) {
  let query = `insert into todo values(NULL, '${taskName}', NOW(), ${userID});`;

  return queryExecutor(query).then((res) => res.insertId);
}

export function fetchAllItems() {
  let query = `select * from todo;`;

  return queryExecutor(query);
}

export function updateItem(itemId, taskName) {
  let query = `update todo set task_name = '${taskName}' where id = ${itemId};`;

  return queryExecutor(query);
}

export function deleteItem(itemID) {
  let query = `delete from todo where id=${itemID};`;

  return queryExecutor(query);
}
