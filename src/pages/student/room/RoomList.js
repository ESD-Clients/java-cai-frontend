import { useEffect, useState } from "react"
import ReactModal from "react-modal";
import { FacultyController, RoomController, StudentController } from "../../../controllers/_Controllers";
import PasswordField from "../../../components/PasswordField";
import { Dots } from "react-activity";
import { clearModal, showLoading, showMessageBox } from "../../../modals/Modal";
import { ROOM_MAX_STUDENT_COUNT } from "../../../values/Constants";

export default function RoomList ({student}) {

  const [filter, setFilter] = useState('');

  const [roomList, setRoomList] = useState([]);

  const [joinModal, setJoinModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    if(student.school && student.school.id) {
      const unsubscribe = RoomController.subscribeListBySchool( student.school.id, async (snapshot) => {

        let docs = snapshot.docs;
  
        for(let doc of docs) {
          let faculty = await FacultyController.get(doc.data().createdBy);
          doc.faculty = faculty;
        }
  
        setRoomList(docs);
      });
  
      return () => unsubscribe();
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function checkFilter (item) {

    let subString = filter.toLowerCase();
    let code = item.data().code.toLowerCase();
    let faculty = item.faculty.name.toLowerCase();

    if (code.includes(subString) || faculty.includes(subString)) {
      return true;
    }

    return false;
  }

  
  async function joinCloseRoom (e) {
    e.preventDefault();
    
    let roomPassword = selectedRoom.data().password;
    let password = e.target.password.value;
    
    if(roomPassword === password) {
      setJoinModal(false);
      
      let roomStudents = selectedRoom.data().students; 
      
      if(roomStudents.length >= ROOM_MAX_STUDENT_COUNT) {
        showMessageBox({
          type: "danger",
          title: "Room is already full!",
          message: "This room has reached its maximum limit!"
        })
        return;
      }

      showLoading({
        message: "Joining room..."
      });

      //UPDATE ROOM
      if(!roomStudents.includes(student.id)) {
        roomStudents.push(student.id);

        await RoomController.update(selectedRoom.id, {
          students: roomStudents
        })
      }
      //UPDATE STUDENT
      await StudentController.update(student.id, {
        currentRoom: selectedRoom.id
      })

      clearModal();
    }
    else {
      showMessageBox({
        title: "Incorrect Password!",
        type: "danger",
        message: "The password that you have entered doesn't match on room's password. Please try other password!"
      })
    }
  }

  return (
    <>
      <ReactModal
        isOpen={joinModal}
        ariaHideApp={false}
        style={{ overlay: { zIndex: 49, background: "transparent" } }}
        className="bg-modal flex w-full h-full backdrop-blur-sm z-50 items-center justify-center overflow-y-auto "
      >
        <form 
          className="bg-base-200 p-4 w-[20rem] rounded relative"
          onSubmit={joinCloseRoom}
        >
          <div className="flex justify-between items-end">
            <h1 className="font-semibold mb-2">Enter Room Password</h1>
          </div>

          <PasswordField
            maxLength={8}
            name="password"
            required
          />
          <div className="flex justify-end mt-4">
            <button 
              className="btn btn-ghost"
              type="button"
              onClick={() => setJoinModal(false)}
            >
              CANCEL
            </button>
            <button className="btn btn-primary">
              Join
            </button>
          </div>
        </form>
      </ReactModal>
      <div>
        <div className="form-control">
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter room code or faculty name"
              className="input input-bordered w-full"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            />
            <div className="btn btn-disabled">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="h-96 mt-4 scrollbar-thin scrollbar-track-base-200 scrollbar-thumb-gray-400">
        {
          roomList.length > 0 ? (
            <>
              <table className="table w-full">
                <thead>
                  <tr>
                    <th className="text-xs font-semibold">Room Code</th>
                    <th className="text-xs font-semibold">Faculty</th>
                    <th className="text-xs font-semibold">Students</th>
                    <th className="text-xs font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    roomList.map((item, i) => checkFilter(item) ? (
                      <RoomItem 
                        key={i.toString()} 
                        student={student}
                        room={item} 
                        setJoinModal={setJoinModal}
                        setSelectedRoom={setSelectedRoom}
                      />
                    ) : null)
                  }
                </tbody>
              </table>
            </>
          ) : (
            <div className="flex justify-center items-center">No Data Available</div>
          )
        }
      </div>
    </>
  )
}

function RoomItem ({student, room, setSelectedRoom, setJoinModal}) {

  const [loading, setLoading] = useState(false);

  function hasInvite () {
    
    if(student.roomInvites && student.roomInvites.includes(room.id)) {
      return true;
    }

    return false;
  }

  function hasRequest () {
    if(room.data().requests && room.data().requests.includes(student.id)) {
      return true;
    }

    return false;
  }

  function isRoomFull () {
    if(room.data().students.length >= ROOM_MAX_STUDENT_COUNT) {
      return true;
    }

    return false;
  }

  async function joinOpenRoom () {


    let requests = room.data().requests;

    if(room.data().students.includes(student.id)) {
      showMessageBox({
        title: "Error",
        message: "You have already joined in this room."
      })
    }
    else if(requests.includes(student.id)) {
      showMessageBox({
        title: "Error",
        message: "You have already requested to join in this room."
      })
    }
    else {

      requests = [...requests, student.id]

      setLoading(true);

      await RoomController.update(room.id, {
        requests: requests
      })
      

      setLoading(false);
    }
  }

  async function cancelRequest () {

    let requests = room.data().requests;
    let index = requests.indexOf(student.id);

    requests.splice(index, 1);

    setLoading(true);

    await RoomController.update(room.id, {
      requests: requests
    })

    setLoading(false);
  }

  async function declineInvite () {
    
    let roomInvites = student.roomInvites;
    let index = roomInvites.indexOf(room.id);

    roomInvites.splice(index, 1);

    setLoading(true);

    await StudentController.update(student.id, {
      roomInvites: roomInvites
    })

    setLoading(false);
  }

  async function acceptInvite () {


    let students = [...room.data().students];

    if(students.length >= ROOM_MAX_STUDENT_COUNT) {
      showMessageBox({
        type: "danger",
        title: "Room is already full!",
        message: "This room has reached its maximum limit!"
      })
      return;
    }
    
    students.push(student.id);

    setLoading(true);

    let roomInvites = student.roomInvites;
    let index = roomInvites.indexOf(room.id);
    roomInvites.splice(index, 1);

    await StudentController.update(student.id, {
      currentRoom: room.id,
      roomInvites: roomInvites
    })

    await RoomController.update(room.id, {
      students: students
    })

    setLoading(false);
  }

  return (
    <tr>
      <td className="flex items-center">
        {room.data().code}
        {
          room.data().type === "close" && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 text-gray-500" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
              <path fill="currentColor" d="M20 12c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5S7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7z" />
            </svg>
          )
        }
      </td>
      <td>{room.faculty.name}</td>
      <td>{room.data().students.length} / 60</td>
      <td className="flex gap-2">
        {
          loading ? (
            <Dots size={8} color="#6219e2" />
          ) : 
          hasInvite() ? (
            <>
              <button 
                className="btn btn-sm btn-error"
                onClick={declineInvite}
              >
                DECLINE
              </button>
              <button 
                className="btn btn-sm btn-success"
                onClick={acceptInvite}
              >
                ACCEPT
              </button>
            </>
          ) :

          hasRequest() ? (
            <button 
              className="btn btn-sm"
              onClick={cancelRequest}
            >
              CANCEL REQUEST
            </button>
          ) : 

          isRoomFull() ? (
            <button 
              className="btn btn-sm btn-disabled"
            >
              FULL
            </button>
          ) : (
            <button 
              className="btn btn-sm btn-primary"
              onClick={ () => {
                if(room.data().type === "close") {
                  setJoinModal(true)
                  setSelectedRoom(room)
                }
                else {
                  joinOpenRoom();
                }
              }}
            >
              Join Room
            </button>
          )
        }

      </td>
    </tr>
  )
}