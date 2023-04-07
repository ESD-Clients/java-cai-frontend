import { useState } from "react";
import { Dots } from "react-activity";
import ReactModal from "react-modal";
import { RoomController, StudentController } from "../../../controllers/_Controllers";
import { padIdNo } from "../../../controllers/_Helper";
import { showConfirmationBox, clearModal, showMessageBox } from "../../../modals/Modal";
import { ROOM_MAX_STUDENT_COUNT } from "../../../values/Constants";

export default function RoomStudents({
  room,
  studentList,
  roomRequests,
  roomInvites,
  roomStudents,
}) {
  
  const [inviteModal, setInviteModal] = useState(false);
  const [filter, setFilter] = useState('');

  function checkFilter(student) {

    let subString = filter.toLowerCase();

    let studentNo = padIdNo(student.data().studentNo);
    let name = student.data().name.toLowerCase();
    let email = student.data().email.toLowerCase();

    if (room.id === student.data().currentRoom) {
      return false;
    }

    if (studentNo.includes(subString) || name.includes(subString) || email.includes(subString)) {
      return true;
    }

    return false;
  }

  return (
    <>
      <ReactModal
        isOpen={inviteModal}
        ariaHideApp={false}
        style={{ overlay: { zIndex: 49, background: "transparent" } }}
        className="bg-modal flex w-full h-full backdrop-blur-sm z-50 items-center justify-center overflow-y-auto "
      >
        <div className="bg-base-200 p-4 max-w-[40rem] sm:w-2/3 rounded relative">
          <div className="flex justify-between items-end">
            <h1 className="font-semibold mb-2">Search Students</h1>
            <div
              className="cursor-pointer mb-4 hover:bg-base-300 rounded-full p-1"
              onClick={() => setInviteModal(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
          </div>

          <div className="form-control">
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter name, email or student no..."
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

          <div className="h-96 mt-4 overflow-y-auto scrollbar-thin scrollbar-track-base-200 scrollbar-thumb-gray-400">
            {
              studentList.length > 0 ? (
                <>
                  <table className="table table-compact w-full">
                    <thead>
                      <tr>
                        <th className="text-xs font-semibold">Student No</th>
                        <th className="text-xs font-semibold">Name</th>
                        <th className="text-xs font-semibold">Email</th>
                        <th className="text-xs font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        studentList.map((item, i) => checkFilter(item) ? (
                          <InviteItem key={i.toString()} student={item} room={room} />
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
        </div>
      </ReactModal>

      <div className="flex items-center gap-12">
        <h1 className="text-2xl font-bold">
          Total Students: 
          <span className="ml-2">{roomStudents.length}</span>
        </h1>
        <button
          className="btn btn-primary"
          type="submit"
          onClick={() => setInviteModal(true)}
        >
          Invite
        </button>
      </div>

      <div className="mt-8">
        {
          roomStudents.length > 0 ? (
            <>
              <table className="table table-compact w-full">
                <thead>
                  <tr>
                    <th>Student No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Current Module</th>
                    <th>Progress</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    roomStudents.map((item, i) => (
                      <StudentItem student={item} room={room} key={i.toString()} />
                    ))
                  }
                </tbody>
              </table>
            </>
          ) : (
            <div className="flex justify-center items-center">No students yet</div>
          )
        }
      </div>

      {
        roomInvites.length > 0 && (
          <>
            <div className="mt-8">
              <h1 className="text-2xl font-bold">
                Invites
                <span className="ml-2">({roomInvites.length})</span>
              </h1>
              <table className="table table-compact w-full">
                <thead>
                  <tr>
                    <th>Student No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    roomInvites.map((item, i) => (
                      <InviteItem room={room.id} student={item} key={i.toString()} />
                    ))
                  }
                </tbody>
              </table>
            </div>
          </>
        )
      }

      {
        roomRequests.length > 0 && (
          <>
            <div className="mt-8">
              <h1 className="text-2xl font-bold">
                Requests
                <span className="ml-2">({roomRequests.length})</span>
              </h1>
              <table className="table table-compact w-full">
                <thead>
                  <tr>
                    <th>Student No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    roomRequests.map((item, i) => (
                      <RequestItem room={room} student={item} key={i.toString()} />
                    ))
                  }
                </tbody>
              </table>
            </div>
          </>
        )
      }

    </>
  )
}

function StudentItem({student, room}) {

  const [loading, setLoading] = useState(false);

  function removeStudent () {

    showConfirmationBox({
      message: "Are you sure you want to remove this student?",
      type: "danger",
      onYes: async () => {
        
        clearModal();
        setLoading(true);
        
        //UPDATE ROOM
        let students = room.students;
        let index = students.indexOf(student.id);
        students.splice(index, 1);

        await RoomController.update(room.id, {
          students: students
        })

        //UPDATE STUDENT
        await StudentController.update(student.id, {
          currentRoom: ""
        })

        setLoading(false);
        
      }
    })
  }

  function viewStudent (student) {

  }

  return (
    <tr>
      <td>{padIdNo(student.studentNo)}</td>
      <td>{student.name}</td>
      <td>{student.email}</td>
      <td>{student.current_module}</td>
      <td>{student.progress}</td>
      <td className="flex gap-2">
        {
          loading ? (
            <Dots size={8} color="#6219e2" />
          ) : (
            <>
              <button className="btn btn-sm btn-info" onClick={() => viewStudent(student)}>
                View
              </button>
              <button className="btn btn-sm btn-error" onClick={() => removeStudent(student)}>
                REMOVE
              </button>
            </>
          )
        }
      </td>
    </tr>
  )
}

function RequestItem({student, room}) {

  const [loading, setLoading] = useState(false);

  async function declineRequest () {
    setLoading(true);

    //UPDATE ROOM
    let requests = room.requests;

    let index = requests.indexOf(student.id);
    requests.splice(index, 1);

    await RoomController.update(room.id, {
      requests: requests
    })

    setLoading(false);
  }

  async function approveRequest () {

    if(room.students.length >= ROOM_MAX_STUDENT_COUNT) {
      showMessageBox({
        type: "danger",
        title: "Room is already full!",
        message: "This room has reached its maximum limit!"
      })
      return;
    }

    setLoading(true);

    //UPDATE ROOM
    let requests = room.requests;
    let students = room.students;

    let index = requests.indexOf(student.id);
    requests.splice(index, 1);

    if(!students.includes(student.id)) {
      students.push(student.id)
    }

    await RoomController.update(room.id, {
      requests: requests,
      students: students
    })

    //UPDATE STUDENT
    await StudentController.update(student.id, {
      currentRoom: room.id
    })
    setLoading(false);
  }

  return (
    <tr>
      <td>{padIdNo(student.studentNo)}</td>
      <td>{student.name}</td>
      <td>{student.email}</td>
      <td className="flex gap-2">
        {
          loading ? (
            <Dots size={8} color="#6219e2" />
          ) : (
            <>
              <button className="btn btn-xs btn-error" onClick={declineRequest}>
                DECLINE
              </button>
              <button className="btn btn-xs btn-success" onClick={approveRequest}>
                APPROVE
              </button>
            </>
          )
        }
      </td>
    </tr>
  )
}

function InviteItem({ student, room }) {

  const [loading, setLoading] = useState(false);

  async function sendInvite() {
    setLoading(true);

    let invites = student.data().roomInvites ? [...student.data().roomInvites, room.id] : [room.id];

    await StudentController.update(student.id, {
      roomInvites: invites
    })


    setLoading(false);
  }

  async function cancelInvite() {
    setLoading(true);

    let invites = student.data().roomInvites;
    let index = invites.indexOf(room.id);

    console.log("Before", invites);
    invites.splice(index, 1);
    console.log("After", invites);

    await StudentController.update(student.id, {
      roomInvites: invites
    })

    setLoading(false);
  }


  function isInvited() {
    if (student.data().roomInvites && student.data().roomInvites.length > 0) {
      if (student.data().roomInvites.includes(room.id)) {
        return true;
      }
    }
    return false;
  }

  return (
    <tr>
      <td>{padIdNo(student.data().studentNo)}</td>
      <td>{student.data().name}</td>
      <td>{student.data().email}</td>
      <td className="">
        {
          isInvited() ? (
            <button className="btn btn-xs btn-active" onClick={cancelInvite}>
              Cancel
            </button>
          ) : (
            loading ? (
              <Dots size={8} color="#6219e2" />
            ) : (
              <button className="btn btn-xs btn-primary" onClick={sendInvite}>
                Invite
              </button>
            )
          )

        }
      </td>
    </tr>
  )
}