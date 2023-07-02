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
        // console.log("error at executor function", err.stack);
        reject(err.stack);
      }
      resolve(result);
    });
  });
}

export async function insertIntoDB(taskName, userID) {
  let query = `insert into todo values(NULL, '${taskName}', NOW(), ${userID});`;

  try {
    const res = await queryExecutor(query);
    return { data: res, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function fetchAllItems() {
  let query = `select * from todo;`;

  try {
    const res = await queryExecutor(query);
    return { data: res, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function updateItem(itemId, taskName) {
  let query = `update todo set task_name = '${taskName}' where id = ${itemId};`;

  try {
    const res = await queryExecutor(query);
    return { data: res, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function deleteItem(itemID) {
  let query = `delete from todo where id=${itemID};`;

  try {
    const res = await queryExecutor(query);
    return { data: res, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}
