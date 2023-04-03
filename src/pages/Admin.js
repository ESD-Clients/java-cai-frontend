
import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import AdminNavBar from "../components/AdminNavBar";
import AdminSideBar from "../components/AdminSideBar";
import AdminStatBar from "../components/AdminStatBar";
import { AdminController, Helper } from "../controllers/_Controllers";
import ApproveModules from "./admin/ApproveModules";
import Dashboard from "./admin/Dashboard";
import EditModules from "./admin/EditModules";
import FacultyList from "./admin/FacultyList";
import Modules from "./admin/Modules";
import Settings from "./admin/Settings";
import StudentList from "./admin/StudentList";
import ViewApproveModule from "./admin/ViewApproveModule";
import ViewEditModules from "./admin/ViewEditModules";
import ViewModule from "./admin/ViewModule";

export default function Admin () {

  const navigate = useNavigate();
  const location = useLocation();
  const user = Helper.getCurrentUser();

  console.log(location.pathname)

  useEffect(() => {
    if(!user || user.type !== "admin") {
      navigate("/");
    }
    else {
      async function updateUser () {
        let newUser = await AdminController.get(user.id);
        if(newUser && newUser.id) {
          newUser.type = "admin";
          Helper.setCurrentUser(newUser);
        }
        else {
          Helper.logout();
        }
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
          <div className="pt-8">
            <Routes>
              <Route path="/dashboard" element={<Dashboard user={user} />} />
              <Route path="/modules" element={<Modules user={user} />} />
              <Route path="/module" element={<ViewModule user={user} />} />
              {/* <Route path="/edit-modules" element={<EditModules user={user} />} /> */}
              <Route path="/faculty-list" element={<FacultyList user={user} />} />
              <Route path="/settings" element={<Settings user={user} />} />
              <Route path="/student-list" element={<StudentList user={user} />} />
              {/* <Route path="/view-approve-module" element={<ViewApproveModule user={user} />} /> */}
              {/* <Route path="/view-edit-module" element={<ViewEditModules user={user} />} /> */}
              <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
          </div>

        </div>
        {
          !location.pathname.includes('admin/dashboard') && (
            <div className="fixed right-0">
              <AdminStatBar />
            </div>
          )
        }
      </div>
    </>
  )
}