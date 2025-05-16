import React, { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm';
import { FaSun, FaMoon } from 'react-icons/fa';
import { DragDropContext } from 'react-beautiful-dnd';
import PriorityColumn from './components/PriorityColumn';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [columns, setColumns] = useState({
    idea: {
      id: 'idea',
      title: 'Idea',
      todos: []
    },
    inProgress: {
      id: 'inProgress',
      title: 'In Progress',
      todos: []
    },
    urgent: {
      id: 'urgent',
      title: 'Urgent',
      todos: []
    },
    done: {
      id: 'done',
      title: 'Done',
      todos: []
    }
  });

  // Load todos and dark mode from localStorage on initial render
  useEffect(() => {
    const savedColumns = localStorage.getItem('todoColumns');
    if (savedColumns) {
      setColumns(JSON.parse(savedColumns));
    }

    // Check for user's preferred color scheme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedMode = localStorage.getItem('darkMode');
    
    if (savedMode !== null) {
      setDarkMode(JSON.parse(savedMode));
    } else {
      setDarkMode(prefersDark);
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todoColumns', JSON.stringify(columns));
  }, [columns]);

  // Update body class and save preference when dark mode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const addTodo = (text) => {
    if (text.trim() !== '') {
      const newTodo = {
        id: Date.now().toString(),
        text,
        completed: false
      };
      
      // Add new todos to the Idea column by default
      const updatedIdea = {
        ...columns.idea,
        todos: [...columns.idea.todos, newTodo]
      };
      
      setColumns({
        ...columns,
        idea: updatedIdea
      });
    }
  };

  const toggleTodo = (id, columnId) => {
    const column = columns[columnId];
    const updatedTodos = column.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    
    setColumns({
      ...columns,
      [columnId]: {
        ...column,
        todos: updatedTodos
      }
    });
  };

  const deleteTodo = (id, columnId) => {
    const column = columns[columnId];
    const updatedTodos = column.todos.filter(todo => todo.id !== id);
    
    setColumns({
      ...columns,
      [columnId]: {
        ...column,
        todos: updatedTodos
      }
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // If there's no destination or if the item was dropped back in its original position
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    
    if (sourceColumn === destColumn) {
      // Reordering within the same column
      const newTodos = Array.from(sourceColumn.todos);
      const [movedTodo] = newTodos.splice(source.index, 1);
      newTodos.splice(destination.index, 0, movedTodo);

      const newColumn = {
        ...sourceColumn,
        todos: newTodos
      };

      setColumns({
        ...columns,
        [newColumn.id]: newColumn
      });
    } else {
      // Moving from one column to another
      const sourceTodos = Array.from(sourceColumn.todos);
      const destTodos = Array.from(destColumn.todos);
      const [movedTodo] = sourceTodos.splice(source.index, 1);
      
      // If moving to Done column, mark as completed
      if (destination.droppableId === 'done') {
        movedTodo.completed = true;
      }
      
      // If moving from Done column to another, mark as not completed
      if (source.droppableId === 'done' && destination.droppableId !== 'done') {
        movedTodo.completed = false;
      }
      
      destTodos.splice(destination.index, 0, movedTodo);

      setColumns({
        ...columns,
        [sourceColumn.id]: {
          ...sourceColumn,
          todos: sourceTodos
        },
        [destColumn.id]: {
          ...destColumn,
          todos: destTodos
        }
      });
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 transition-colors duration-200 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Todo App</h1>
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <FaSun className="text-yellow-300" /> : <FaMoon className="text-gray-700" />}
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <TodoForm addTodo={addTodo} />
        </div>
        
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.values(columns).map(column => (
              <PriorityColumn
                key={column.id}
                column={column}
                toggleTodo={(id) => toggleTodo(id, column.id)}
                deleteTodo={(id) => deleteTodo(id, column.id)}
              />
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
