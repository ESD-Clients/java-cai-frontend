
import { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import AdminNavBar from "../components/AdminNavBar";
import AdminSideBar from "../components/AdminSideBar";
import AdminStatBar from "../components/AdminStatBar";
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
      <div className="flex">
        <div className="fixed w-80 h-full">
          <AdminSideBar />
        </div>

        <div className="flex-1 ml-80 mr-56">
          <div className="sticky top-0 w-full" style={{zIndex: 1}}>
            <AdminNavBar user={user}/>
          </div>
          <div className="pt-20">
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
          </div>

        </div>
        <div className="fixed right-0">
          <AdminStatBar />
        </div>
      </div>
    </>
  )
}