
import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import LearnerNavBar from "../blocks/LearnerNavBar";
import { Helper, LearnerController, StudentController } from "../controllers/_Controllers";
import Footer from "../blocks/Footer";
import ContactUsForm from "../blocks/ContactUsForm";

import Dashboard from "../pages/learner/Dashboard";
import Module from "../pages/learner/Module";
import PlayGround from "../pages/learner/PlayGround";
import Settings from "../pages/learner/Settings";
import Quiz from "../pages/quiz/Quiz";

export default function Learner () {

  const navigate = useNavigate();
  const location = useLocation();

  const user = Helper.getCurrentUser();

  useEffect(() => {
    if(!user || user.type !== "learner") {
      navigate("/");
    }
    else {
      async function updateUser () {
        let newUser = await LearnerController.get(user.id);
        if(newUser && newUser.id) {
          newUser.type = "learner";
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
      <div className="flex min-h-[100vh] flex-1 flex-col">
        
        <div className="flex flex-1 flex-col items-center pt-24">
          <div className="lg:max-w-[100rem] w-full flex flex-col flex-1 lg:mt-4 m-0 lg:px-8 px-4 pb-8">
            <Routes>
              <Route path="/dashboard" element={<Dashboard user={user} />} />
              <Route path="/module" element={<Module user={user} />} />
              <Route path="/playground" element={<PlayGround user={user} />} />
              {/* <Route path="/room" element={<Room user={user} />} />
              <Route path="/activity" element={<Activity user={user} />} />
              */}
              <Route path="/quiz" element={<Quiz user={user} />} /> 
              <Route path="/contact" element={<ContactUsForm user={user} />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/" element={<Navigate to="/learner/dashboard" replace />} />
            </Routes>
          </div>
        </div>
        {
          !location.pathname.includes("learner/quiz") && (
            <div className="fixed w-full top-0">
              <LearnerNavBar user={user} />
            </div>
          )
        }
      <Footer />
      </div>
    </>
  )
}