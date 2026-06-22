import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { Dashboard } from "./pages/Dashboard";
import { ExperienceList } from "./pages/ExperienceList";
import { ExperienceAdd } from "./pages/ExperienceAdd";
import { AISession } from "./pages/AISession";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/experiences" element={<ExperienceList />} />
        <Route path="/experiences/add" element={<ExperienceAdd />} />
        <Route path="/ai-session" element={<AISession />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
