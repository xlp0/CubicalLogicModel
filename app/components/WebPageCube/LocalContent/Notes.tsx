"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Notes() {
  const [notes, setNotes] = useState<string[]>([]);
  const [currentNote, setCurrentNote] = useState('');

  const addNote = () => {
    if (currentNote.trim()) {
      setNotes(prev => [...prev, currentNote]);
      setCurrentNote('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-yellow-400 to-orange-500 p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Quick Notes</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addNote()}
          className="flex-1 px-3 py-2 rounded-md"
          placeholder="Type a note..."
        />
        <Button onClick={addNote} variant="secondary">Add</Button>
      </div>
      <div className="flex-1 overflow-auto bg-white/10 rounded-lg p-4">
        {notes.map((note, index) => (
          <div 
            key={index}
            className="bg-white/90 p-3 rounded-md mb-2 shadow-sm"
          >
            {note}
          </div>
        ))}
      </div>
    </div>
  );
}