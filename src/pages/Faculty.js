
import { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { FacultyController, Helper } from "../controllers/_Controllers";
import AddModule from "./faculty/AddModule";
import Dashboard from "./faculty/Dashboard";
import EditModules from "./faculty/EditModules";
import FacultyList from "./faculty/FacultyList";
import Messages from "./faculty/Messages";
import Modules from "./faculty/Modules";
import StudentList from "./faculty/StudentList";

export default function Faculty () {

  const navigate = useNavigate();
  const user = Helper.getCurrentUser();
  

  useEffect(() => {

    console.log("USER",user);
    if(!user || user.type !== "faculty") {
      console.log("No User");
      navigate("/");
    }
    else {
      async function updateUser () {
        let newUser = await FacultyController.get(user.id);
        if(newUser && newUser.id) {
          newUser.type = "faculty";
          Helper.setCurrentUser(newUser);
        }
        else {
          Helper.logout();
        }
      }

      updateUser();
    }
  }, [])

  if(user) {
    return (
      <>
        <Routes>
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/add-module" element={<AddModule user={user} />} />
          <Route path="/edit-module" element={<EditModules user={user} />} />
          <Route path="/faculty-list" element={<FacultyList user={user} />} />
          <Route path="/messages" element={<Messages user={user} />} />
          <Route path="/modules" element={<Modules user={user} />} />
          <Route path="/student-list" element={<StudentList user={user} />} />
          <Route path="/" element={<Navigate to="/faculty/dashboard" replace />} />
        </Routes>
      </>
    )
  }
  else {
    return null;
  }
}