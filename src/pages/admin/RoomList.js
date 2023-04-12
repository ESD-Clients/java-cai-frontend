import { useState } from "react"
import ReactModal from "react-modal";
import { useNavigate } from "react-router-dom";
import Select from "../../components/Select";
import { v1 as uuidv1 } from 'uuid';
import TextField from "../../components/TextField";
import { clearModal, showConfirmationBox, showLoading, showMessageBox } from "../../modals/Modal";
import { getCurrentTimestamp, getErrorMessage } from "../../controllers/_Helper";
import { useEffect } from "react";
import { FacultyController, RoomController, StudentController } from "../../controllers/_Controllers";
import SearchField from "../../components/SearchField";
import { Dots } from "react-activity";
import { CLR_PRIMARY } from "../../values/MyColor";

export default function RoomList({ user }) {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);

  const [filter, setFilter] = useState('');


  useEffect(() => {
    const unsubscribe = RoomController.subscribeList(async snapshot => {
      let rooms = [];
      for (let doc of snapshot.docs) {
        let faculty = await FacultyController.get(doc.data().createdBy);
        doc.faculty = faculty;

        rooms.push(doc);
      }

      setRooms(rooms);

      setLoading(false);
    })

    return () => unsubscribe();

  }, [])


  function deleteRoom(roomId) {
    showConfirmationBox({
      message: "Are you sure you want to delete this room?",
      type: "danger",
      onYes: async () => {

        showLoading({
          message: "Deleting Room..."
        })

        try {
          //REMOVE STUDENT CURRENT ROOM
          await StudentController.getStudentsByRoom(roomId)
            .then(async res => {
              for (let student of res) {
                await StudentController.update(student.id, {
                  currentRoom: ""
                })
              }
            })

          //REMOVE INVITES
          await StudentController.getStudentsByRoomInvites(roomId)
            .then(async res => {
              for (let student of res) {

                let roomInvites = student.data().roomInvites;
                let index = roomInvites.indexOf(roomId);
                roomInvites.splice(index, 1);

                await StudentController.update(student.id, {
                  roomInvites: roomInvites
                })
              }
            })

          //DELETE ROOM
          await RoomController.destroy(roomId);

          clearModal();

          showMessageBox({
            title: "Success",
            message: "Room deleted successfully!"
          })
        }
        catch (err) {
          console.error(err);
          clearModal();

          showMessageBox({
            title: "Error",
            message: "Something went wrong"
          })
        }

      }
    })
  }

  function checkFilter(item) {
    if (filter) {
      let value = filter.toLowerCase();
      let code = item.data().code.toLowerCase();
      let faculty = item.faculty.name.toLowerCase();
      let type = item.data().type.toLowerCase();

      if (code.includes(value) || faculty.includes(value) || type.includes(value)) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return true;
    }
  }


  return (
    <>

      <div>
        <div className="flex flex-col sm:flex-row justify-between mb-8">
          <div>
            <div className="font-bold uppercase mb-4">Room List</div>
            <div className="font-thin">Total Number of Rooms:
              <span className="font-bold ml-2">
                {rooms.length}
              </span>
            </div>
          </div>
          <div className="mt-4 flex flex-row justify-center">
            <SearchField
              setFilter={setFilter}
              placeholder="Search room code, faculty or type"
            />
          </div>
        </div>

        <div className="divider" />

        <div className="overflow-x-auto">
          <table className="table table-compact w-full">
            <thead>
              <tr>
                <th>Code</th>
                <th>Type</th>
                <th>Faculty</th>
                <th>Students</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                rooms.map((item, i) => (
                  checkFilter(item) && (
                    <tr key={i.toString()}>
                      <td>{item.data().code}</td>
                      <td className="uppercase">{item.data().type}</td>
                      <td>{item.faculty.name}</td>
                      <td>{item.data().students.length}</td>
                      <td className="flex gap-2">
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => navigate('/admin/room?' + item.id)}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-sm btn-error"
                          onClick={() => deleteRoom(item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                ))
              }
            </tbody>
          </table>
          {
            loading && (
              <div className="flex justify-center items-center mt-4">
                <Dots color={CLR_PRIMARY} />
              </div>
            )
          }
        </div>
      </div>
    </>
  )
}