import { useState } from "react"
import ReactModal from "react-modal";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PasswordField from "../../../components/PasswordField";
import Select from "../../../components/Select";
import { v1 as uuidv1 } from 'uuid';
import TextField from "../../../components/TextField";
import { clearModal, showConfirmationBox, showLoading, showMessageBox } from "../../../modals/Modal";
import { getCurrentTimestamp, getErrorMessage } from "../../../controllers/_Helper";
import { useEffect } from "react";
import { RoomController, StudentController } from "../../../controllers/_Controllers";

export default function RoomList ({user}) {

  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);

  const [infoModal, setInfoModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [code, setCode] = useState('12345678');
  const [type, setType] = useState('open');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const unsubscribe = RoomController.subscribeFacultyRooms(user.id, (snapshot) => {
      setRooms(snapshot.docs)
    })

    return () => unsubscribe();

  }, [])

  useEffect(() => {
    if(addModal) {
      setCode('');
      setType('open');
      setPassword('');
    }
  }, [addModal])

  async function createRoom () {
    let uuid = uuidv1();
    let code = uuid.substring(0, 8);

    showLoading({
      message: "Saving..."
    })

    let result = await RoomController.store({
      code: code,
      createdBy: user.id,
      createdAt: getCurrentTimestamp(),
      type: type,
      students: [],
      requests: [],
      password: type === "close" ? password : "",
    })

    clearModal();

    if(result && result.id) {
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

  
  function deleteRoom (roomId) {
    showConfirmationBox({
      message: "Are you sure you want to delete this room?",
      type: "danger",
      onYes: async () => {

        showLoading({
          message: "Deleting Room..."
        })

        try{
          //REMOVE STUDENT CURRENT ROOM
          await StudentController.getStudentsByRoom(roomId)
          .then(async res => {
            for(let student of res) {
              await StudentController.update(student.id, {
                currentRoom: ""
              })
            }
          })
        
          //REMOVE INVITES
          await StudentController.getStudentsByRoomInvites(roomId)
            .then(async res => {
              for(let student of res) {

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
        catch(err) {
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


  return (
    <>
      <ReactModal
        isOpen={infoModal}
        ariaHideApp={false}
        style={{overlay: {zIndex: 49, background: "transparent"}}}
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
        style={{overlay: {zIndex: 49, background: "transparent"}}}
        className="bg-modal flex w-full h-full backdrop-blur-sm z-50 items-center justify-center overflow-y-scroll "
      >
        <form 
          className="bg-base-200 p-4 max-w-[32rem] sm:w-2/3 rounded relative"
          onSubmit={createRoom}
        >
          <div className="my-4">
            <h1 className="text-lg font-bold">Room Information</h1>
          </div>

          <Select
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
          />
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
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="font-bold uppercase mb-4">Rooms</div>
          <div className="form-control">
            <div className="input-group">
              <input type="text" placeholder="Search…" className="input input-bordered" />
              <button className="btn btn-square">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="mt-8 flex flex-row justify-center">
            <button className="btn btn-primary" onClick={() => setAddModal(true)}>
              Create Room
            </button>
          </div>
        </div>

        <div className="divider" />

        <div className="overflow-x-auto">
          {
            rooms.length > 0 ? (
              <>
                <table className="table table-compact w-full">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Type</th>
                      <th>Students</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      rooms.map((item, i) => (
                        <tr key={i.toString()}>
                          {/* <td>{item.id}</td> */}
                          <td>{item.data().code}</td>
                          <td className="uppercase">{item.data().type}</td>
                          <td>{item.data().students.length}</td>
                          <td className="flex gap-2">
                            <button 
                              className="btn btn-xs btn-info"
                              onClick={() => navigate('/faculty/room?' + item.id)}
                            >
                              View
                            </button>
                            <button 
                              className="btn btn-xs btn-error"
                              onClick={() => deleteRoom(item.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </>
            ) : (
              <div className="flex justify-center items-center">
                No Rooms Yet.
              </div>
            )
          }
        </div>
      </div>
    </>
  )
}