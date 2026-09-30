import { BrowserRouter, Routes, Route } from "react-router-dom";
import protectedRoutes from "./protectedRoutes";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<protectedRoutes><Dashboard /></protectedRoutes>} />
        <Route path="/expenses" element={<protectedRoutes><Expenses /></protectedRoutes>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;