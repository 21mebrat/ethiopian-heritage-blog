"use client";

import React, { useState, useEffect } from "react";
import AdvancedEditor from "@/app/components/editor/AdvancedEditor";
import axios from "axios";

export default function EditorSystemPage() {
  const [saveStatus, setSaveStatus] = useState<"Saved" | "Saving..." | "Waiting">("Waiting");
  
  // Debounced Save mechanism
  const handleEditorUpdate = async (jsonContent: any) => {
    setSaveStatus("Saving...");
    
    // Using a simple mock timeout for debounce visualization in production you'd use a robust debounce
    try {
      // Mocking the data structure based on the model since we are saving a new post
      // Normally you would fetch an existing post and update it via PUT, or create exactly once.
      // We will just console log it here for demo purposes avoiding DB spam on every keystroke
      console.log("Auto-saving to MongoDB (POST /api/posts):", jsonContent);
      
      // Simulate API call delay
      await new Promise(r => setTimeout(r, 600)); 
      
      setSaveStatus("Saved");
      
      setTimeout(() => setSaveStatus("Waiting"), 2000);
      
    } catch (e) {
      console.error(e);
      setSaveStatus("Waiting");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Document Editor</h1>
          <p className="mt-2 text-sm text-gray-500">
            A Notion-style block editor with Figma-style floating toolbar and robust media handling.
          </p>
        </div>
        <div>
           <span className={`text-xs px-2 py-1 rounded-full font-medium transition-colors ${
             saveStatus === 'Saved' ? 'bg-green-100 text-green-800' : 
             saveStatus === 'Saving...' ? 'bg-amber-100 text-amber-800' : 
             'bg-gray-100 text-gray-500'
           }`}>
             {saveStatus}
           </span>
        </div>
      </div>
      
      <AdvancedEditor onChange={handleEditorUpdate} />
    </div>
  );
}
