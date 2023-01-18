import { useEffect, useState } from "react";
import "./App.css";
//1 read
function App() {
  //2
  useEffect(() => {
    const todosUrl = "https://dummyjson.com/todos";

    //3
    fetch(todosUrl, { method: "GET" })
      .then((response) => response.json())
      .then((responseObj) => setTodos(responseObj.todos));
  }, []); 

  //4 create state
  const [todos, setTodos] = useState([]); //iterate this state after puttuing obj inside massive[]

  function delateTodo(id) {
    console.log(id, "smart");
    const deleteInd = todos.findIndex((todosObject) => todosObject?.id === id);
    if (deleteInd > -1) delete todos[deleteInd];

    setTodos([...todos]);
  }

  function createFunction(newobject) {
    const { todo, userId, completed } = newobject;
    if (!todo || !userId) return;

    fetch("https://dummyjson.com/todos/add", {
      method: "POST", //to create  data for backend

      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        todo,
        completed,
        userId,
      }),
    })
      .then((response) => response.json())
      .then((todo) => {
        console.log(todo);
        todos.unshift(todo);
        setTodos([...todos]);

      });
  }

  //5
  return (
    <div className="App">
      <AddTodo createTodo={createFunction} />
      <ol>
        {todos.map(
          (eachelement, index) =>
            eachelement && (
              <TodoItem
                dataObject={eachelement}
                key={index}
                delateTodo={delateTodo}
              />
            ) // dataObject key and delTD porops
        )}{" "}
        //todo is a key inside obj
      </ol>
    </div>
  );
}

export default App;

function AddTodo({ createTodo }) {
  const [inputValue, setInputValue] = useState("");
  const [complit, setComplit] = useState(false);

  const object = { todo: inputValue, completed: complit, userId: 32 };

  return (
    <div>
      <input
        onChange={(event) => setInputValue(event.target.value)}
        type="text"
        value={inputValue}
      />

      <input
        onChange={(event) => setComplit(event.target.checked)}
        type="checkbox"
        checked={complit}
      />

      <button
        onClick={() => {
          createTodo(object);
          setInputValue("");
          setComplit(false);
        }}
      >
        save
      </button>
    </div>
  );
}

//6 create second function formdoing render
function TodoItem({ dataObject, delateTodo }) {
  const [disables, setDisables] = useState(true); //for doing edit
  const [todoText, setTodoText] = useState(dataObject?.todo); //edit
  const [completed, setCompleted] = useState(dataObject?.completed); //edit

  // 12 createvfunction edit

  function handleEdit() {
    setDisables(!disables); //reverse inside disablesd we have true false
  }

  // 13
  function handeleCancel() {
    setTodoText(dataObject.todo); //todo {} inside we get todo key
    setCompleted(dataObject.completed); //todo{} inside todo key we have true, false
    setDisables(!disables);
  }

  //17 update data to send backend

  function handleSave(id) {
    fetch(`https://dummyjson.com/todos/${id}`, {
      method: "PUT", //to send updata data  to backend
      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({
        completed: completed,
        todo: todoText,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setDisables(!disables);
      });
  }

  function handleDelate(id) {
    console.log(id);
    fetch(`https://dummyjson.com/todos/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json)
      .then((data) => delateTodo(id));
  }
  //7
  return (
    <li className="Todo">
      <h2>
        Todo:{""}
        <input
          disabled={disables} //atribute disabled input we can't write
          value={todoText} //ecaht string one by one
          onChange={(e) => setTodoText(e.target.value)}
        />
      </h2>

      {/* 8 */}

      <h2>
        Completed:{""}
        <input
          disabled={disables}
          type="checkbox" //disabled?
          checked={completed}
          //  14
          onChange={(e) => setCompleted(e.target.checked)} //input text we can write
        />
      </h2>

      {/* 9 */}

      <h2>User ID:{dataObject?.userId}</h2>

      {/* 15 create */}
      <button onClick={disables ? handleEdit : handeleCancel}>
        {disables ? "Edit" : "Cancel"}
      </button>

      {/* 16 */}
      {disables || (
        <button onClick={() => handleSave(dataObject?.id)}>save</button>
      )}

      <button onClick={() => handleDelate(dataObject?.id)}>delate</button>
    </li>
  );
}
