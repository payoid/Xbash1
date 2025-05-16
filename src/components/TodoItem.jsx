import React from 'react';
import { FaTrash } from 'react-icons/fa';

function TodoItem({ todo, toggleTodo, deleteTodo }) {
  return (
    <li className="py-3 flex items-center justify-between group">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
          className="h-5 w-5 text-blue-500 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        />
        <span 
          className={`ml-3 ${
            todo.completed 
              ? 'line-through text-gray-400 dark:text-gray-500' 
              : 'text-gray-800 dark:text-gray-200'
          }`}
        >
          {todo.text}
        </span>
      </div>
      <button
        onClick={() => deleteTodo(todo.id)}
        className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors duration-200 opacity-0 group-hover:opacity-100"
        aria-label="Delete todo"
      >
        <FaTrash />
      </button>
    </li>
  );
}

export default TodoItem;
