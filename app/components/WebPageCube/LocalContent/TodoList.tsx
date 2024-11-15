"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim()) {
      setTodos(prev => [...prev, { id: Date.now(), text: input, completed: false }]);
      setInput('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-pink-500 to-purple-600 p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Todo List</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          className="flex-1 px-3 py-2 rounded-md"
          placeholder="Add a task..."
        />
        <Button onClick={addTodo} variant="secondary">Add</Button>
      </div>
      <div className="flex-1 overflow-auto bg-white/10 rounded-lg p-4">
        {todos.map(todo => (
          <div 
            key={todo.id}
            className="flex items-center gap-3 bg-white/90 p-3 rounded-md mb-2"
          >
            <Checkbox
              checked={todo.completed}
              onCheckedChange={() => toggleTodo(todo.id)}
            />
            <span className={todo.completed ? 'line-through text-gray-500' : ''}>
              {todo.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}