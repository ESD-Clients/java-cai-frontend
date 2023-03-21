
import "@fortawesome/fontawesome-free/css/all.min.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import Admin from "./pages/Admin";
import Faculty from "./pages/Faculty";
import Home from "./pages/Home";
import Student from "./pages/Student";

export default function App () {

  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/faculty/*" element={<Faculty />} />
          <Route path="/student/*" element={<Student />} />
        </Routes>
      </HashRouter>
    </>
  )
}