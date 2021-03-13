const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(400).json({ error: "User not found" });
  }

  request.user = user;

  return next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;
  const alreadyExistsUser = users.some((item) => item.username === username);

  if (alreadyExistsUser) {
    return response.status(400).json({ error: "User already exists" });
  }

  const user = {
    name,
    username,
    id: uuidv4(),
    todos: [],
  };

  users.push(user);

  return response.status(201).send(user);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;

  const todo = {
    id: uuidv4(),
    title: title,
    done: false,
    deadline: deadline,
    created_at: "2021-02-22T00:00:00.000Z",
  };

  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { title, deadline } = request.body;
  const { user } = request;
  const verifyIfExistsTodo = user.todos.filter((item) => item.id === id);

  if (!verifyIfExistsTodo.length) {
    return response.status(404).json({ error: "Todo not found" });
  }

  let todo = user.todos.filter((item) => item.id === id);
  todo[0].title = title;
  todo[0].deadline = deadline;
  delete todo[0].id;
  delete todo[0].created_at;

  response.json(...todo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;
  let todo = user.todos.filter((item) => item.id === id);

  if (!todo.length) {
    return response.status(404).json({ error: "Todo not found" });
  }
  todo[0].done = true

  return response.json(...todo);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
