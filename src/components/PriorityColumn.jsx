import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import TodoItem from './TodoItem';

const columnColors = {
  idea: 'bg-blue-100 dark:bg-blue-900',
  inProgress: 'bg-yellow-100 dark:bg-yellow-900',
  urgent: 'bg-red-100 dark:bg-red-900',
  done: 'bg-green-100 dark:bg-green-900'
};

const titleColors = {
  idea: 'text-blue-800 dark:text-blue-200',
  inProgress: 'text-yellow-800 dark:text-yellow-200',
  urgent: 'text-red-800 dark:text-red-200',
  done: 'text-green-800 dark:text-green-200'
};

function PriorityColumn({ column, toggleTodo, deleteTodo }) {
  return (
    <div className={`rounded-lg shadow-md overflow-hidden ${columnColors[column.id]}`}>
      <h2 className={`p-4 font-bold text-lg ${titleColors[column.id]}`}>
        {column.title} ({column.todos.length})
      </h2>
      
      <Droppable droppableId={column.id}>
        {(provide