import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import HDivider from "../../../components/HDivider";
import { RoomController, StudentController } from "../../../controllers/_Controllers";
import { getDocData } from "../../../controllers/_Helper";
import { clearModal, showConfirmationBox, showLoading } from "../../../modals/Modal";

export default function RoomView({ student }) {

  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [activities, setActivities] = useState([]);

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

    return () => {
      unsubscribeActivities();
      unsubscribeRoom();
    };

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

        clearModal();
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

        <HDivider />

        <div>
          <h2 className="font-bold text-lg">Activities</h2>

          <div className="mt-8">
            {
              activities.length > 0 ? (
                <>
                  <table className="table table-compact w-full">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Points</th>
                        <th>Remarks</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        activities.map((item, i) => (
                          <tr key={i.toString()}>
                            <td>{item.data().title}</td>
                            <td>{item.data().points}</td>
                            <td>
                              {
                                item.studentWork ? (
                                  item.studentWork.score ? (
                                    <span className="text-green-500">{item.studentWork.score}</span>
                                  ) : (
                                    <span className="italic text-blue-400">Submitted</span>
                                  )
                                ) : (
                                  <span className="italic text-red-400">No work/s submitted</span>
                                )
                              }
                            </td>
                            <td>
                              <button
                                className="btn btn-info btn-sm"
                                onClick={() => navigate(`/student/activity?room=${room.id}&activity=${item.id}`)}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </>
              ) : (
                <div className="flex justify-center items-center">No activities yet</div>
              )
            }
          </div>
        </div>
      </div>
    </>
  )
}