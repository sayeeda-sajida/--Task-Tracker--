import { Routes, Route } from "react-router-dom";
import React from "react";
import HomePage from "./homePage";
import NewTask from "./newTask";
import ViewTask from "./viewTask";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/newTask" element={<NewTask />} />
        
       
        <Route path="/viewTask/:id" element={<ViewTask />} />
      </Routes>
    </div>
  );
};

export default App;
