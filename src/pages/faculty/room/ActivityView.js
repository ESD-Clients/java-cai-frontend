import moment from "moment/moment";
import { useEffect, useState } from "react";
import { Dots } from "react-activity";
import { useLocation, useNavigate } from "react-router-dom";
import HDivider from "../../../components/HDivider";
import RichText from "../../../components/RichText";
import { RoomController, StudentController } from "../../../controllers/_Controllers";
import { getDocData } from "../../../controllers/_Helper";
import { CLR_PRIMARY } from "../../../values/MyColor";


export default function ActivityView ({user}) {

  const navigate = useNavigate();
  const location = useLocation();

  function getIds() {
    let values = location.search.substring(1);
    if (values) {
      values = values.split("&");

      if (values.length === 2) {
        let roomId = values[0].split("=")[1] ? values[0].split("=")[1] : "";
        let activityId = values[1].split("=")[1] ? values[1].split("=")[1] : "";

        return { roomId, activityId };
      }
    }

    return { roomId: "", activityId: "" };
  }

  const { roomId, activityId } = getIds();

  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState(null);
  const [activity, setActivity] = useState(null);
  const [studentWorks, setStudentWorks] = useState([]);

  useEffect(() => {
    if (roomId && activityId) {
      const unsubscribe = RoomController.subscribeActivityWorks(roomId, activityId, async (snapshot) => {
        let studentWorks = [];

        for(let doc of snapshot.docs) {
          let student = await StudentController.get(doc.data().studentId);

          let data = getDocData(doc);
          data.student = student;

          studentWorks.push(data);
        }

        setStudentWorks(studentWorks)
      })

      return () => unsubscribe();
    }
    
  }, [roomId, activityId])

  useEffect(() => {

    async function fetchData() {
      let room = await RoomController.get(roomId);
      let activity = await RoomController.getActivity(roomId, activityId);

      setRoom(room);
      setActivity(activity);
      setLoading(false);
    }

    if (roomId && activityId) {
      fetchData();
    }

  }, [roomId, activityId])

  if(loading) {
    return (
      <div className="w-full flex flex-col h-[40vh] items-center justify-center">
        <p>
          Getting room and activity's information...
        </p>
        
        <Dots color={CLR_PRIMARY} />
      </div>
    )
  }
  return (
    <>

      <div className="flex justify-between">
        <div>
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>
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

      <div className="flex justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold">{activity.title}</h2>
        </div>
        <div className="">
          <div className="">Room Code :</div>
          <div className="text-xl font-bold">{room && room.code}</div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between">  
          <h6 className="uppercase font-bold">Instruction:</h6>
          <h6 className="uppercase font-bold">{activity.points} Points</h6>
        </div>
        <RichText
          value={activity.instruction}
        />
      </div>

      <div className="mt-8">
        <span className="uppercase font-bold">STUDENT WORKS : {(studentWorks.length)}</span>

        <table className="table table-compact w-full mt-4">
          <thead>
            <tr>
              <th>Studen No</th>
              <th>Name</th>
              <th>Remarks</th>
              <th>Submitted At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              studentWorks.map((item, i) => (
                <tr key={i.toString()}>
                  <td>{item.student.studentNo}</td>
                  <td>{item.student.name}</td>
                  {
                    item.score ? (
                      <td>{item.score}</td>
                    ) : (
                      <td className="italic text-gray-400">Unchecked</td>
                    )
                  }
                  <td>{moment(item.submittedAt).format('hh:mm A - DD/MM/yyyy')}</td>
                  <td className="flex gap-2">
                    <button 
                      className="btn btn-xs btn-info"
                      onClick={() => navigate(
                        '/faculty/activity/work',
                        {
                          state: {
                            room: room,
                            activity: activity,
                            work: item
                          }
                        }
                      )}
                    >
                      View
                    </button>
                    {/* <button 
                      className="btn btn-xs btn-error"
                      onClick={() => deleteRoom(item.id)}
                    >
                      Delete
                    </button> */}
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </>
  )
}