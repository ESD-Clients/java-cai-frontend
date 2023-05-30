import { useLocation, useNavigate } from "react-router-dom";
import HDivider from "../../../components/HDivider";
import { useEffect } from "react";
import { ModuleController, RoomController, StudentController } from "../../../controllers/_Controllers";
import { useState } from "react";
import { getDocData } from "../../../controllers/_Helper";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import RoomStudents from "./RoomStudents";
import ActivityList from "./ActivityList";
import ModuleList from "./ModuleList";

export default function RoomView({user}) {

  const navigate = useNavigate();
  const location = useLocation();

  const roomId = location.search.substring(1)


  const [tab, setTab] = useState(0);

  const [room, setRoom] = useState(null);
  
  const [studentList, setStudentList] = useState([]);
  const [roomStudents, setRoomStudents] = useState([]);
  const [roomInvites, setRoomInvites] = useState([]);
  const [roomRequests, setRoomRequests] = useState([]);

  const [roomActivities, setRoomActivities] = useState([]);
  const [roomModules, setRoomModules] = useState([]);

  useEffect(() => {
    async function fetchData () {
      const modules = await ModuleController.getModulesByRoom(roomId);
      setRoomModules(modules);
    }

    fetchData();
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    let unsubscribeRoom = RoomController.subscribeDoc(roomId, async (snapshot) => {

      let room = getDocData(snapshot)

      setRoom(room);
      getRoomStudents(room.students);
      getStudentRequests(room.requests);
    });

    let unsubscribeStudents = StudentController.subscribeBySchool(user.school.id, snapshot => {
      let result = snapshot.docs;
      setStudentList(result);
    });

    let unsubscribeActivities = RoomController.subscribeActivities(roomId, (snapshot) => {
      let result = snapshot.docs;
      setRoomActivities(result);
    })

    return () => {
      unsubscribeRoom();
      unsubscribeStudents();
      unsubscribeActivities();
    };
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function getRoomStudents(students) {
  

    let listStudents = [];
    for(let studentId of students) {
      let student = await StudentController.get(studentId);
      student && listStudents.push(student);
      
    }

    setRoomStudents(listStudents);

    let invites = await StudentController.getStudentsByRoomInvites(roomId);
    setRoomInvites(invites);
  }

  async function getStudentRequests(requests) {

    let students = [];
    for(let studentId of requests) {
      let student = await StudentController.get(studentId);
      students.push(student);
    }

    setRoomRequests(students);
  }

  return (
    <>
      <div className="flex justify-between">
        <div>
          <button className="btn btn-ghost" onClick={() => navigate("/faculty/rooms")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
              <path fill="currentColor" d="m12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2H7.825l5.6 5.6Z" />
            </svg>
            <p>Back</p>
          </button>
        </div>
        <div>
          <button className="btn btn-error" type="submit">Delete</button>
        </div>
      </div>

      <HDivider />

      <div className="flex gap-16">
        <div className="flex items-center">
          <div className="">Code :</div>
          <div className="ml-4 text-4xl font-bold">{room && room.code}</div>
        </div>
        {/* <div className="flex items-center">
          <div className="">Type :</div>
          <div className="ml-4 text-lg font-bold uppercase">{room && room.type}</div>
        </div> */}
      </div>

      <Tabs>
        <TabList  className="flex my-6 border-t-2">
          <Tab 
            className={"py-4 font-bold text-xl flex-1 outline-none text-center hover:bg-base-300 cursor-pointer " + (tab === 0 ? "border-b-2 border-primary" : "")}
            onClick={() => setTab(0)}
          >
            STUDENTS
          </Tab>
          <Tab 
            className={"py-4 font-bold text-xl flex-1 outline-none text-center hover:bg-base-300 cursor-pointer " + (tab === 1 ? "border-b-2 border-primary" : "")}
            onClick={() => setTab(1)}
          >
            MODULES
          </Tab>
          <Tab 
            className={"py-4 font-bold text-xl flex-1 outline-none text-center hover:bg-base-300 cursor-pointer " + (tab === 2 ? "border-b-2 border-primary" : "")}
            onClick={() => setTab(2)}
          >
            ACTIVITIES
          </Tab>

        </TabList>


        <TabPanel>
          <RoomStudents
            room={room}
            studentList={studentList}
            roomInvites={roomInvites}
            roomStudents={roomStudents}
            roomRequests={roomRequests}
          />
        </TabPanel>
        <TabPanel>
          <ModuleList
            roomId={roomId}
            moduleList={roomModules}
            studentList={roomStudents}
          />
        </TabPanel>
        <TabPanel>
          <ActivityList
            roomId={roomId}
            roomActivities={roomActivities}
          />
        </TabPanel>
      </Tabs>
    </>
  )
}