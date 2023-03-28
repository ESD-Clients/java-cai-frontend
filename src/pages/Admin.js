
import { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Helper } from "../controllers/_Controllers";
import ApproveModules from "./admin/ApproveModules";
import Dashboard from "./admin/Dashboard";
import EditModules from "./admin/EditModules";
import FacultyList from "./admin/FacultyList";
import Settings from "./admin/Settings";
import StudentList from "./admin/StudentList";
import ViewApproveModule from "./admin/ViewApproveModule";
import ViewEditModules from "./admin/ViewEditModules";

export default function Admin () {

  const navigate = useNavigate();
  const user = Helper.getCurrentUser();

  useEffect(() => {
    if(!user || user.type !== "admin") {
      navigate("/");
    }
    else {
      async function updateUser () {
        // let newUser = await AdminController.get(user.id);
        // if(newUser && newUser.id) {
        //   newUser.type = "admin";
        //   Helper.setCurrentUser(newUser);
        // }
        // else {
        //   Helper.logout();
        // }
      }

      updateUser();
    }
  }, [user])

  return (
    <>
      <Routes>
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/approve-modules" element={<ApproveModules user={user} />} />
        <Route path="/edit-modules" element={<EditModules user={user} />} />
        <Route path="/faculty-list" element={<FacultyList user={user} />} />
        <Route path="/settings" element={<Settings user={user} />} />
        <Route path="/student-list" element={<StudentList user={user} />} />
        <Route path="/view-approve-module" element={<ViewApproveModule user={user} />} />
        <Route path="/view-edit-module" element={<ViewEditModules user={user} />} />
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </>
  )
}