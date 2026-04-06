import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateUser from "./pages/CreateUser";
import EditUser from "./pages/EditUser";
import GetUser from "./pages/GetUser";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to={'/login'} replace/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/create-user" element={<CreateUser/>} />
        <Route path="/edit-user/:username?" element={<EditUser/>} />
        <Route path="/get-user" element={<GetUser/>} />
      </Routes>
    </Router>
  );
}

export default App;
