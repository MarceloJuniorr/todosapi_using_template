const express = require('express');
const cors = require('cors');

const  { v4 } = require("uuid")

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
      const {username} = request.headers;
    const user = users.find((user) => user.username === username);
    if (!user) {
       return response.status(404).json({error: "User not found!"});     
    }
 
    request.user = user;
    return next();
}

app.post('/users', (request, response) => {
     const { username, name } = request.body;
 
    const userAlreadyExists = users.some(
       (user)=>user.username === username
    );
 
    if (userAlreadyExists) {
       return response.status(400).json({error: "User already Exists!"});     
    }
 
    const user = {
       username,
       name,
       id: v4(),
       todos: []
    }

    users.push(user)
 
    return response.status(201).json({ user });
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
    const {user} = request;

    return response.status(201).json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {user} = request;
    const {title, deadline} = request.body;
    
    
    const todo = {
        id: v4(),
        title,
        done: false,
        deadline: new Date(deadline),
        created_at: new Date()
    }

    user.todos.push(todo);
    return response.status(201).json(todo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
    const {user} = request;
    const { id } = request.params;

    
    const todo = user.todos.find(
        (todo) => id === todo.id 
    )

    if(todo) {

    if (request.body.title){
        const {title } = request.body;
        todo.title = title}
    
    if (request.body.deadline){
        const  { deadline } = request.body;
        todo.deadline =  new Date(deadline)
    }

    if (request.body.title || request.body.deadline) {
        return response.status(201).json(todo)
    } else {
        return response.status(400).json({"error": "title or deadline parameter not found in the body" })
    }
    } else {
        return response.status(400).json({"error": "id not found for user" })

    }
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
      const {user} = request;
    const {id} = request.query;

    const todo = user.todos.find(
        (todo) => id === todo.id 
    ) 
    if (title){
        todo.title = title
    };
    if (deadline) {
        todo.deadline =  new Date(deadline)
    };
    if (title || deadline) {
        return response.status(201).json(todo)
    } else {
        return response.status(400).json({"error": "title or deadline parameter not found in the body" })
    }
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
      const { id } = request.params;
    const { user } = request


    const todo = user.todos.find(
        (todo) => id === todo.id 
    ) 

    if (todo){        
        const indexTodo = user.todos.findIndex(
            todoIndex => todoIndex.id === todo.id);
        user.todos.splice(indexTodo,1);
        
        return response.status(200).json({ message: "Todo deleted successfully" })
        
    }else{
        
        return response.status(400).json({ message: "Todo id not found" })
    }
});

module.exports = app;
