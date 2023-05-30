import { useState } from "react"
import ReactModal from "react-modal";
import { useNavigate } from "react-router-dom";
import { v1 as uuidv1 } from 'uuid';
import TextField from "../../../components/TextField";
import { clearModal, showConfirmationBox, showLoading, showMessageBox } from "../../../modals/Modal";
import { getCurrentTimestamp, getErrorMessage } from "../../../controllers/_Helper";
import { useEffect } from "react";
import { RoomController, StudentController } from "../../../controllers/_Controllers";
import SearchField from "../../../components/SearchField";
import { Dots } from "react-activity";
import { CLR_PRIMARY } from "../../../values/MyColor";

export default function RoomList({ user }) {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);

  const [filter, setFilter] = useState('');

  const [infoModal, setInfoModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [code, setCode] = useState('12345678');
  const [type, setType] = useState('close');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const unsubscribe = RoomController.subscribeFacultyRooms(user.id, (snapshot) => {
      setRooms(snapshot.docs);
      setLoading(false);
    })

    return () => unsubscribe();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (addModal) {
      setCode('');
      setType('close');
      setPassword('');
    }
  }, [addModal])

  async function createRoom() {
    let uuid = uuidv1();
    let code = uuid.substring(0, 8);

    showLoading({
      message: "Saving..."
    })

    let result = await RoomController.store({
      code: code,
      createdBy: user.id,
      school: user.school.id,
      createdAt: getCurrentTimestamp(),
      type: type,
      students: [],
      requests: [],
      password: type === "close" ? password : "",
    })

    clearModal();

    if (result && result.id) {
      clearModal();

      setCode(code);
      setAddModal(false);
      setInfoModal(true);
    }
    else {
      showMessageBox({
        title: "Error",
        type: "danger",
        message: getErrorMessage(result)
      })
    }
  }


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
      // let type = item.data().type.toLowerCase();

      if (code.includes(value)) {
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
      <ReactModal
        isOpen={infoModal}
        ariaHideApp={false}
        style={{ overlay: { zIndex: 49, background: "transparent" } }}
        className="bg-modal flex w-full h-full backdrop-blur-sm z-50 items-center justify-center overflow-y-scroll "
      >
        <div className="bg-base-200 p-4 max-w-[32rem] sm:w-2/3 rounded relative">
          <div className="text-center font-bold mb-4">ROOM CODE</div>
          <div className="text-4xl font-bold text-center p-4 bg-base-100 rounded-lg">{code}</div>

          <div className="flex justify-center gap-4 mt-4">
            <button className="btn btn-accent" onClick={() => setInfoModal(false)}>CLOSE</button>
            <button className="btn btn-primary">INVITE</button>
          </div>
        </div>
      </ReactModal>

      <ReactModal
        isOpen={addModal}
        ariaHideApp={false}
        style={{ overlay: { zIndex: 49, background: "transparent" } }}
        className="bg-modal flex w-full h-full backdrop-blur-sm z-50 items-center justify-center overflow-y-scroll "
      >
        <form
          className="bg-base-200 p-4 max-w-[32rem] sm:w-2/3 rounded relative"
          onSubmit={createRoom}
        >
          <div className="my-4">
            <h1 className="text-lg font-bold">Room Information</h1>
          </div>

          {/* <Select
            label="Type"
            value={type}
            onChange={setType}
            options={[
              {
                value: "open",
                label: "Open"
              },
              {
                value: "close",
                label: "Close"
              }
            ]}
          /> */}
          {/* <TextField
            label="Module Completion Time"
            value={password}
            onChange={setPassword}
            maxLength={8}
            required
          /> */}
          {
            type === "close" && (
              <TextField
                label="Room Password"
                value={password}
                onChange={setPassword}
                maxLength={8}
                required
              />
            )
          }
          <div className="flex justify-end my-4 space-x-2">
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => setAddModal(false)}
            >
              CANCEL
            </button>
            <button className="btn btn-success">CREATE</button>
          </div>
        </form>
      </ReactModal>

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
              placeholder="Search room code"
            />
            <button className="btn btn-primary" onClick={() => setAddModal(true)}>
              Create Room
            </button>
          </div>
        </div>

        <div className="divider" />

        <div className="overflow-x-auto">
          <table className="table table-compact w-full">
            <thead>
              <tr>
                <th>Code</th>
                {/* <th>Type</th> */}
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
                      {/* <td className="uppercase">{item.data().type}</td> */}
                      <td>{item.data().students.length}</td>
                      <td className="flex gap-2">
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => navigate('/faculty/room?' + item.id)}
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