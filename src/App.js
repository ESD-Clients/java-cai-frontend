
import "@fortawesome/fontawesome-free/css/all.min.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import Admin from "./pages/Admin";
import Enroll from "./pages/Enroll";
import Faculty from "./pages/Faculty";
import Home from "./pages/Home";
import Student from "./pages/Student";

export default function App () {

  return (
    <>
      <div id="top"></div>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/enroll" element={<Enroll />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/faculty/*" element={<Faculty />} />
          <Route path="/student/*" element={<Student />} />
        </Routes>
      </HashRouter>
    </>
  )
}