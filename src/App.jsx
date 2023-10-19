import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Login />}></Route>
        <Route exact path="/register" element={<Register />}></Route>
        <Route exact path="/home" element={<Home />}></Route>
      </Routes>
    </>
  );
}

export default App;
