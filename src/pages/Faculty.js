
import { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import FacultyNavBar from "../blocks/FacultyNavBar";
import FacultySideBar from "../blocks/FacultySideBar";
import { FacultyController, Helper } from "../controllers/_Controllers";

import Dashboard from "./faculty/Dashboard";

import StudentList from "./faculty/student/StudentList";
import StudentView from "./faculty/student/StudentView";

import ModuleList from "./faculty/ModuleList";
import ModuleAdd from "./faculty/ModuleAdd";
import ModuleView from "./faculty/ModuleView";
import ModuleQuestions from "./faculty/ModuleQuestions";

import RoomView from "./faculty/room/RoomView";
import RoomList from "./faculty/room/RoomList";

import ActivityView from "./faculty/room/ActivityView";
import ActivityWork from "./faculty/room/ActivityWork";

import FacultySettings from "./faculty/FacultySettings";
import Footer from "../blocks/Footer";

export default function Faculty() {

  const navigate = useNavigate();
  const user = Helper.getCurrentUser();


  useEffect(() => {

    if (!user || user.type !== "faculty") {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (user) {
    return (
      <>
        <div className="">
          <div className="w-80 bg-base-200 h-full absolute -left-80 lg:fixed lg:left-0">
            <FacultySideBar />
          </div>
          <div className="min-h-[100vh] flex flex-col lg:ml-80">
            <div className="sticky top-0 w-full" style={{zIndex: 1}}>
              <FacultyNavBar user={user} />
            </div>

            <div className="flex-1 pt-4 p-4 bg-base-100">
              <Routes>
                <Route path="/dashboard" element={<Dashboard user={user} />} />

                <Route path="/students" element={<StudentList user={user} />} />
                <Route path="/student" element={<StudentView user={user} />} />

                <Route path="/rooms" element={<RoomList user={user} />} />
                <Route path="/room" element={<RoomView user={user} />} />
                <Route path="/activity" element={<ActivityView user={user} />} />
                <Route path="/activity/work" element={<ActivityWork user={user} />} />

                <Route path="/modules" element={<ModuleList user={user} />} />
                <Route path="/module" element={<ModuleView user={user} />} />
                <Route path="/modules/add" element={<ModuleAdd user={user} />} />
                <Route path="/questions" element={<ModuleQuestions user={user} />} />

                <Route path="/settings" element={<FacultySettings />} />

                <Route path="/" element={<Navigate to="/faculty/dashboard" replace />} />
              </Routes>
            </div>

          
            <Footer />
          </div>
        </div>
      </>
    )
  }
  else {
    return null;
  }
}