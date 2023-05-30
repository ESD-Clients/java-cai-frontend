
import "@fortawesome/fontawesome-free/css/all.min.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import Enroll from "./pages/Enroll";
import Home from "./pages/Home";
import ContactUs from "./pages/ContactUs";
import Admin from "./routes/Admin";
import Student from "./routes/Student";
import Faculty from "./routes/Faculty";
import Learner from "./routes/Learner";

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
          <Route path="/learner/*" element={<Learner />} />
          <Route path="/student/*" element={<Student />} />
        </Routes>
      </HashRouter>
    </>
  )
}