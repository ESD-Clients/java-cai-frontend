import { useLocation, useNavigate } from "react-router-dom";
import HDivider from "../../components/HDivider";
import Select from "../../components/Select";
import TextField from "../../components/TextField";
import { v1 as uuidv1 } from 'uuid';
import { useEffect } from "react";
import { RoomController, StudentController } from "../../controllers/_Controllers";
import { useState } from "react";

export default function RoomView () {

  const navigate = useNavigate();
  const location = useLocation();

  const roomId = location.search.substring(1)

  const [room, setRoom] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const unsubscribe = RoomController.subscribeDoc(roomId, (snapshot) => {
      
      let room = {
        ...snapshot.data(),
        id: snapshot.id,
      }

      setRoom(room)
      getStudents();
    });

    return () => unsubscribe();
  }, [])

  async function getStudents () {
    let result = StudentController.getStudentsByRoom(roomId);
    setStudents(result);
  }


  return (
    <>
      <div className="flex justify-between">
        <div>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
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

      <div className="flex">
        <div className="">
          <div className="">Code:</div>
          <div className="text-4xl font-bold">{room && room.code}</div>
        </div>
      </div>

      <div className="flex justify-between">
      <button className="btn btn-primary" type="submit">Invite</button>
      </div>

    </>
  )
}