import express, { json } from "express";
import cors from "cors";
import {
  fetchAllItems,
  insertIntoDB,
  updateItem,
  deleteItem,
} from "./databaseService.js";

// calling the constructor
const app = express();

// setting the app to use JSON objects for communication(Middleware)
app.use(json());

// // enabling CORS for all origins
app.use(cors());

// adding an validation middleware
app.use("/addTodo", function (req, res, next) {
  let { userID, taskName } = req.body;

  console.log(userID, taskName);

  if (userID && taskName) next();
  else res.status(422).send({ message: "invalid arguments" });
});

// Req: userID, taskName
// Res: ID
async function addTodoAPI(req, res) {
  let { userID, taskName } = req.body;

  let { data, error } = await insertIntoDB(taskName, userID);

  res.status(201).send({
    ID:
      data && data.insertId ? `${data.insertId} is successfully created` : null,
    errror: error,
  });
}

app.post("/addTodo", addTodoAPI);

// adding an validation middleware
app.use("/updatetodo", function (req, res, next) {
  let { taskID, taskName } = req.body;

  if (taskID && taskName) next();
  else res.status(422).send({ message: "invalid arguments" });
});

// Req: taskID, taskName
// Res: "message": "<taskID> successfully updated"
async function updateTodoAPI(req, res) {
  let { taskID, taskName } = req.body;

  let { data, error } = await updateItem(taskID, taskName);

  res.status(200).send({
    message: data ? `${taskID} successfully updated` : ``,
    error: error,
  });
}

app.patch("/updatetodo", updateTodoAPI);

// adding an validation middleware
app.use("/deletetodo", function (req, res, next) {
  let { taskID } = req.body;

  if (taskID) next();
  else res.status(422).send({ message: "invalid arguments" });
});

// Req:  taskID
// Res: <taskID> succesfully deleted
async function deleteTodoAPI(req, res) {
  let { taskID } = req.body;

  let { data, error } = await deleteItem(taskID);

  console.log("deleted");

  res.status(200).send({
    message: data ? `${taskID} successfully deleted` : ``,
    error: error,
  });
}

app.delete("/deletetodo", deleteTodoAPI);

// Res: [<todo items>]
async function getallTodosAPI(req, res) {
  let { data, error } = await fetchAllItems();

  res.status(200).send({
    tasks: data,
    message: data ? `successfully fetched` : ``,
    error: error,
  });
}

app.get("/getalltodos", getallTodosAPI);

app.use(function (err, req, res, next) {
  console.log("error");

  res.status(500).send({
    message: "something went wrong",
    errorDetails: err.stack,
  });
});

// port to use
const port = 3050;

// exposing the API to the specified port
app.listen(port, function () {
  console.log(`API is listening at port:${port}`);
});
