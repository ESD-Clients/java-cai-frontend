
import "@fortawesome/fontawesome-free/css/all.min.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import Admin from "./pages/Admin";
import Enroll from "./pages/Enroll";
import Faculty from "./pages/Faculty";
import Home from "./pages/Home";
import Student from "./pages/Student";
import ContactUs from "./pages/ContactUs";

export default function App () {

  return (
    <>
      <div id="top"></div>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/enroll" element={<Enroll />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/faculty/*" element={<Faculty />} />
          <Route path="/learner/*" element={<Student />} />
          <Route path="/student/*" element={<Student />} />
        </Routes>
      </HashRouter>
    </>
  )
}