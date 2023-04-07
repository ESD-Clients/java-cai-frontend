
import { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import FacultyNavBar from "../components/FacultyNavBar";
import FacultySideBar from "../components/FacultySideBar";
import { FacultyController, Helper } from "../controllers/_Controllers";
import AddModule from "./faculty/AddModule";
import Dashboard from "./faculty/Dashboard";
import Messages from "./faculty/Messages";
import Modules from "./faculty/Modules";
import RoomView from "./faculty/room/RoomView";
import RoomList from "./faculty/room/RoomList";
import StudentList from "./faculty/StudentList";
import ViewModule from "./faculty/ViewModule";
import ViewQuestions from "./faculty/ViewQuestions";
import ActivityView from "./faculty/room/ActivityView";
import ActivityWork from "./faculty/room/ActivityWork";

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
          <div className="w-80 bg-base-200 h-full absolute -left-80 lg:fixed lg:left-0">
            <FacultySideBar />
          </div>
          <div className=" lg:ml-80">
            <div className="sticky top-0 w-full" style={{zIndex: 1}}>
              <FacultyNavBar user={user} />
            </div>

            <div className="pt-4 p-4 bg-base-100">
              <Routes>
                <Route path="/dashboard" element={<Dashboard user={user} />} />
                <Route path="/messages" element={<Messages user={user} />} />

                <Route path="/students" element={<StudentList user={user} />} />

                <Route path="/rooms" element={<RoomList user={user} />} />
                <Route path="/room" element={<RoomView user={user} />} />
                <Route path="/activity" element={<ActivityView user={user} />} />
                <Route path="/activity/work" element={<ActivityWork user={user} />} />

                <Route path="/modules" element={<Modules user={user} />} />
                <Route path="/modules/add" element={<AddModule user={user} />} />
                <Route path="/questions" element={<ViewQuestions user={user} />} />
                <Route path="/module" element={<ViewModule user={user} />} />

                {/* <Route path="/edit-module" element={<EditModules user={user} />} /> */}
                {/* <Route path="/faculty-list" element={<FacultyList user={user} />} /> */}
                <Route path="/" element={<Navigate to="/faculty/dashboard" replace />} />
              </Routes>
            </div>

          </div>
          {/* <div className="fixed h-full bg-base-200 right-0 top-0">
            <AdminStatBar />
          </div> */}
        </div>
      </>
    )
  }
  else {
    return null;
  }
}