
import { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Helper, StudentController } from "../controllers/_Controllers";
import Dashboard from "./student/Dashboard";
import Module from "./student/Module";
import PlayGround from "./student/PlayGround";
import Quiz from "./student/Quiz";
import QuizResult from "./student/QuizResult";

export default function Student () {

  const navigate = useNavigate();
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
      <Routes>
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/module" element={<Module user={user} />} />
        <Route path="/playground" element={<PlayGround user={user} />} />
        <Route path="/quiz" element={<Quiz user={user} />} />
        <Route path="/result" element={<QuizResult user={user} />} />
        <Route path="/" element={<Navigate to="/student/dashboard" replace />} />
      </Routes>
    </>
  )
}