
import { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import AdminStatBar from "../components/AdminStatBar";
import FacultyNavBar from "../components/FacultyNavBar";
import FacultySideBar from "../components/FacultySideBar";
import { FacultyController, Helper } from "../controllers/_Controllers";
import AddModule from "./faculty/AddModule";
import Dashboard from "./faculty/Dashboard";
import EditModules from "./faculty/EditModules";
import FacultyList from "./faculty/FacultyList";
import Messages from "./faculty/Messages";
import Modules from "./faculty/Modules";
import StudentList from "./faculty/StudentList";
import ViewModule from "./faculty/ViewModule";
import ViewQuestions from "./faculty/ViewQuestions";

export default function Faculty() {

  const navigate = useNavigate();
  const user = Helper.getCurrentUser();


  useEffect(() => {

    // console.log("USER", user);
    if (!user || user.type !== "faculty") {
      console.log("No User");
      navigate("/");
    }
    else {
      async function updateUser() {
        let newUser = await FacultyController.get(user.id);
        if (newUser && newUser.id) {
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

  if (user) {
    return (
      <>
        <div className="">
          <div className="fixed w-80 bg-base-200 h-full">
            <FacultySideBar />
          </div>
          <div className=" ml-80 mr-56">
            <div className="sticky top-0 w-full" style={{zIndex: 1}}>
              <FacultyNavBar user={user} />
            </div>
            <div className="pt-4">
              <Routes>
                <Route path="/dashboard" element={<Dashboard user={user} />} />
                <Route path="/module" element={<ViewModule user={user} />} />
                <Route path="/questions" element={<ViewQuestions user={user} />} />
                <Route path="/add-module" element={<AddModule user={user} />} />
                <Route path="/edit-module" element={<EditModules user={user} />} />
                <Route path="/faculty-list" element={<FacultyList user={user} />} />
                <Route path="/messages" element={<Messages user={user} />} />
                <Route path="/modules" element={<Modules user={user} />} />
                <Route path="/student-list" element={<StudentList user={user} />} />
                <Route path="/" element={<Navigate to="/faculty/dashboard" replace />} />
              </Routes>
            </div>

          </div>
          <div className="fixed h-full bg-base-200 right-0 top-0">
            <AdminStatBar />
          </div>
        </div>
      </>
    )
  }
  else {
    return null;
  }
}