
import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import StudentNavBar from "../blocks/StudentNavBar";
import { Helper, StudentController } from "../controllers/_Controllers";
import Dashboard from "./student/Dashboard";
import Module from "./student/Module";
import PlayGround from "./student/PlayGround";
import Quiz from "./student/quiz/Quiz";
import Room from "./student/room/Room";
import Activity from "./student/room/Activity";
import Settings from "./student/Settings";
import Footer from "../blocks/Footer";

export default function Student () {

  const navigate = useNavigate();
  const location = useLocation();

  const user = Helper.getCurrentUser();

  useEffect(() => {
    if(!user || user.type !== "student") {
      navigate("/");
    }
    else {
      async function updateUser () {
        let newUser = await StudentController.get(user.id);
        if(newUser && newUser.id) {
          newUser.type = "student";
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
      <div className="flex min-h-[100vh] flex-1 flex-col">
        
        <div className="flex flex-1 flex-col items-center py-24">
          <div className="lg:max-w-[100rem] w-full flex flex-col flex-1 lg:mt-4 m-0 lg:px-8 px-4 pb-8">
            <Routes>
              <Route path="/dashboard" element={<Dashboard user={user} />} />
              <Route path="/module" element={<Module user={user} />} />
              <Route path="/playground" element={<PlayGround user={user} />} />
              <Route path="/room" element={<Room user={user} />} />
              <Route path="/activity" element={<Activity user={user} />} />
              <Route path="/quiz" element={<Quiz user={user} />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/" element={<Navigate to="/student/dashboard" replace />} />
            </Routes>
          </div>
        </div>
        {
          !location.pathname.includes("student/quiz") && (
            <div className="fixed w-full top-0">
              <StudentNavBar user={user} />
            </div>
          )
        }
        
      <Footer />
      </div>
    </>
  )
}