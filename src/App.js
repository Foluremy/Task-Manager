import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // State variables
  const [input,setInput] = useState(""); // For the task input field
  const [todos,setTodos] = useState([]); // Array of tasks
  const [editIndex, setEditIndex] = useState(null); // Track index of task being edited
  const [editInput, setEditInput] = useState(""); // Input for the editing task


   // Load tasks from localStorage when the app starts
   useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      try {
        const parsedTodos = JSON.parse(storedTodos); // Parse the string back to an array
        if (Array.isArray(parsedTodos)) {
          setTodos(parsedTodos);  // Set the tasks if data is valid
        }
      } catch (error) {
        console.error("Error parsing todos:", error); // Handle parsing errors
      }
    }
  }, []); // Runs only once when the component is mounted
  
  
  // Save tasks to localStorage whenever `todos` changes
  useEffect(() => {
    if (todos.length > 0) {  // Avoid saving empty data initially
    console.log("Saving todos to localStorage:", todos);
    localStorage.setItem("todos", JSON.stringify(todos)); // Convert the array to a string
  }}, [todos]); // Runs whenever the `todos` array changes

  // Function to add a new task
  const addTodos = (input) => {
    if (input.trim() === "") { // Prevent adding empty tasks
      alert("Task cannot be empty!"); 
      return;
    }

  // Capitalize the first letter of the first word
  const formattedInput = input.charAt(0).toUpperCase() + input.slice(1);

  setTodos((prevTodos) => [...prevTodos, formattedInput]);
  setInput(""); // Clear the input field after adding the task
  };

  // Function to remove a task
  const removeTodo = (todo) => (
    setTodos(todos.filter((x) => x !== todo))  // Remove the selected task from the array
  )

  // Function to start editing a task
  const startEditing = (index, todo) => {
    setEditIndex(index); // Set the index of the task being edited
    setEditInput(todo); // Set the initial value of the edit input
  };

  // Function to save the edited task
  const saveEdit = (index) => {
    if (editInput.trim() === "") {  // Prevent saving an empty task
      alert("Task cannot be empty!");
      return;
    }
  
    // Capitalize the first letter of the first word for the edited task
    const formattedEdit = editInput.charAt(0).toUpperCase() + editInput.slice(1);
  
    // Update the task at the given index
    const updatedTodos = todos.map((todo, i) => (i === index ? formattedEdit : todo));
    setTodos(updatedTodos);
    setEditIndex(null); // Exit editing mode
    setEditInput(""); // Clear the edit input
  };  

  return (
    <div className="app">
      <div className="container">
        <h2>TO-DO LIST</h2>

        <div>
          <input value={input} onChange={(e) => setInput(e.target.value)} type="text" placeholder="Get things done! Add a task..." className="todo-input"></input>
          <button onClick={() => addTodos(input)} className="add-task-btn">Save Task</button>
        </div>

        
        {/* List of tasks */}
        <div>
          {todos.length > 0 ? (
            todos.map((todo, index) => (
              <div className="todo-item" key={index}>
                {/* Conditional rendering for editing */}
                {editIndex === index ? (
                  <div className="edit-container">
                    <input
                      value={editInput}
                      onChange={(e) => setEditInput(e.target.value)}
                      type="text"
                      className="edit-input"
                    />
                    <button onClick={() => saveEdit(index)} className="save-edit-btn">
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="todo-content">
                    <p>{todo}</p>
                    <div className="actions">
                      {/* Edit icon */}
                      <h4 onClick={() => startEditing(index, todo)} data-tooltip="Edit">O</h4>
                      {/* Delete icon */}
                      <h4 onClick={() => removeTodo(todo)} data-tooltip="Delete">X</h4>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            // Message to display if there are no tasks
            <p>No tasks yet!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App; 
