import { useEffect, useState } from "react"
import { ModuleController, RoomController, StudentController } from "../../../controllers/_Controllers";
import { getDocData } from "../../../controllers/_Helper";
import { showConfirmationBox, showLoading } from "../../../modals/Modal";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import ActivityList from "./ActivityList";
import ModuleList from "./ModuleList";

export default function RoomView({ student }) {

  const [room, setRoom] = useState(null);
  const [tab, setTab] = useState(0);
  const [activities, setActivities] = useState([]);
  const [modules, setModules] = useState([]);

  useEffect(() => {

    const unsubscribeRoom = RoomController.subscribeDoc(student.currentRoom, (snapshot) => {
      setRoom(getDocData(snapshot));
    })

    const unsubscribeActivities = RoomController.subscribeActivities(student.currentRoom, async (snapshot) => {

      let activities = snapshot.docs;
      for(let activity of activities) {
        let studentWork = await RoomController.getStudentWork(student.currentRoom, activity.id, student.id);
        activity.studentWork = studentWork;
      }
      setActivities(activities);
    })

    const unsubscribeModules = ModuleController.subscribeByRoom(student.currentRoom, async (snapshot) =>  {
      setModules(snapshot.docs);
    })

    return () => {
      unsubscribeActivities();
      unsubscribeRoom();
      unsubscribeModules();
    };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function leaveRoom () {

    showConfirmationBox({
      message: "Are you sure you want to leave this room?",
      type: "danger",
      onYes: async () => {

        showLoading({
          message: "Leaving room..."
        })

        //UPDATE STUDENT
        await StudentController.update(student.id, {
          currentRoom: ""
        })

        //UPDATE ROOM
        let students = room.students;
        let index = students.indexOf(student.id);
        students.splice(index, 1);

        await RoomController.update(room.id, {
          students: students
        });

        window.location.reload();
        // clearModal();
      }
    })
  }

  if (!room) return null;
  return (
    <>
      <div>
        <div className="flex justify-between">
          <div className="flex items-center">
            <div className="">Room Code :</div>
            <div className="ml-4 text-4xl font-bold">{room && room.code}</div>
          </div>
          <div>
            <button className="btn btn-error" onClick={leaveRoom}>
              LEAVE ROOM
            </button>
          </div>
        </div>


        <Tabs>
          <TabList  className="flex my-6 border-t-2">
            <Tab 
              className={"py-4 font-bold text-xl flex-1 outline-none text-center hover:bg-base-300 cursor-pointer " + (tab === 0 ? "border-b-2 border-primary" : "")}
              onClick={() => setTab(0)}
            >
              MODULES
            </Tab>
            <Tab 
              className={"py-4 font-bold text-xl flex-1 outline-none text-center hover:bg-base-300 cursor-pointer " + (tab === 1 ? "border-b-2 border-primary" : "")}
              onClick={() => setTab(1)}
            >
              ACTIVITIES
            </Tab>

          </TabList>

          <TabPanel>
            <ModuleList student={student} modules={modules} room={room} />
          </TabPanel>
          <TabPanel>
            <ActivityList activities={activities} room={room} />
          </TabPanel>
        </Tabs>
      </div>
    </>
  )
}