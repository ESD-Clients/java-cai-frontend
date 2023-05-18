
import { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import AdminNavBar from "../blocks/AdminNavBar";
import AdminSideBar from "../blocks/AdminSideBar";
import { AdminController, Helper } from "../controllers/_Controllers";
import Dashboard from "./admin/Dashboard";
import FacultyList from "./admin/FacultyList";
import Modules from "./admin/Modules";
import StudentList from "./admin/student/StudentList";
import ViewModule from "./admin/ViewModule";
import AdminSettings from "./admin/AdminSettings";
import Footer from "../blocks/Footer";
import RoomList from "./admin/RoomList";
import Feedbacks from "./admin/Feedbacks";
import StudentView from "./admin/student/StudentView";
import AdminList from "./admin/AdminList";

export default function Admin() {

  const navigate = useNavigate();
  const user = Helper.getCurrentUser();

  useEffect(() => {
    if (!user || user.type !== "admin") {
      navigate("/");
    }
    else {
      async function updateUser() {
        let newUser = await AdminController.get(user.id);
        if (newUser && newUser.id) {
          newUser.type = "admin";
          Helper.setCurrentUser(newUser);
        }
        else {
          Helper.logout();
        }
      }

      updateUser();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return (
    <>
      <div className="">
        <div className="w-80 bg-base-200 h-full absolute -left-80 lg:fixed lg:left-0">
          <AdminSideBar />
        </div>
        <div className="min-h-[100vh] flex flex-col lg:ml-80">
          <div className="sticky top-0 w-full" style={{ zIndex: 1 }}>
            <AdminNavBar user={user} />
          </div>
          <div className="flex-1 pt-4 p-4 bg-base-100">
            <Routes>
              <Route path="/dashboard" element={<Dashboard user={user} />} />

              <Route path="/administrators" element={<AdminList user={user} />} />
              <Route path="/faculties" element={<FacultyList user={user} />} />

              <Route path="/students" element={<StudentList user={user} />} />
              <Route path="/student" element={<StudentView user={user} />} />

              <Route path="/modules" element={<Modules user={user} />} />
              <Route path="/module" element={<ViewModule user={user} />} />

              <Route path="/rooms" element={<RoomList user={user} />} />
              
              
              <Route path="/feedbacks" element={<Feedbacks />} />
              <Route path="/settings" element={<AdminSettings />} />
              <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
          </div>
          
          <Footer />
        </div>
        {/* {
          !location.pathname.includes('admin/dashboard') && (
            <div className="fixed right-0">
              <AdminStatBar />
            </div>
          )
        } */}
      </div>
    </>
  )
}