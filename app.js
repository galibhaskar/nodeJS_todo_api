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

// Req: userID, taskName
// Res: ID
async function addTodoAPI(req, res) {
  let { userID, taskName } = req.body;

  let taskId = await insertIntoDB(taskName, userID);

  res.status(201).send({ ID: `${taskId} is successfully created` });
}

app.post("/addTodo", addTodoAPI);

// Req: taskID, taskName
// Res: "message": "<taskID> successfully updated"
async function updateTodoAPI(req, res) {
  let { taskID, taskName } = req.body;

  let taskId = await updateItem(taskID, taskName);

  res.status(200).send({
    message: `${taskID} successfully updated`,
  });
}

app.patch("/updatetodo", updateTodoAPI);

// Req:  taskID
// Res: <taskID> succesfully deleted
async function deleteTodoAPI(req, res) {
  let { taskID } = req.body;

  let taskId = await deleteItem(taskID);

  res.status(200).send({
    message: `${taskID} successfully deleted`,
  });
}

app.delete("/deletetodo", deleteTodoAPI);

// Res: [<todo items>]
async function getallTodosAPI(req, res) {
  let tasks = await fetchAllItems();

  res.status(200).send({
    tasks: tasks,
    message: `successfully fetched`,
  });
}

app.get("/getalltodos", getallTodosAPI);

// port to use
const port = 3050;

// exposing the API to the specified port
app.listen(port, function () {
  console.log(`API is listening at port:${port}`);
});
