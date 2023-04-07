import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { useNavigate } from "react-router-dom";
import RichTextEditor from "../../../components/RichTextEditor";
import TextField from "../../../components/TextField";
import { Helper, RoomController } from "../../../controllers/_Controllers";
import { clearModal, showLoading, showMessageBox } from "../../../modals/Modal";

export default function ActivityList({ roomId, roomActivities }) {

  const navigate = useNavigate();

  /** CREATE */
  const [createModal, setCreateModal] = useState(false)
  const [createTitle, setCreateTitle] = useState('');
  const [createInstruction, setCreateInstruction] = useState('');

  useEffect(() => {
    setCreateTitle('');
    setCreateInstruction('');
  }, [createModal])

  async function createActivity(e) {

    e.preventDefault();

    showLoading({
      message: "Creating..."
    })

    let data = {
      ...Helper.getEventFormData(e),
      submitted: []
    }

    console.log(data);

    let res = await RoomController.createAcvitity(roomId, data);

    console.log("Activity", res);

    clearModal();

    if (!res) {
      showMessageBox({
        title: "Error",
        message: "Something went wrong!"
      })
    }
    else {
      setCreateModal(false)
    }

  }

  return (
    <>
      <ReactModal
        isOpen={createModal}
        ariaHideApp={false}
        style={{ overlay: { zIndex: 49, background: "transparent" } }}
        className="bg-modal flex w-full h-full backdrop-blur-sm z-50 items-center justify-center overflow-y-auto"
      >
        <form className="bg-base-200 p-4 max-w-[60rem] sm:w-2/3 rounded relative" onSubmit={createActivity}>
          <div className="my-4">
            <h1 className="text-lg font-bold">New Activity</h1>
          </div>
          <TextField
            label="Activity Title"
            name="title"
            value={createTitle}
            onChange={setCreateTitle}
            required
          />

          <div className="relative">
            <textarea
              required
              name="instruction"
              className="absolute bottom-0 opacity-0 z-0"
              value={createInstruction}
              onChange={e => { }}
            />
            <div className="z-10">
              <RichTextEditor
                label="Instruction"
                required
                value={createInstruction}
                onChange={setCreateInstruction}
              />
            </div>
          </div>

          <div className="flex justify-end my-4 space-x-2">
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => setCreateModal(false)}
            >
              CANCEL
            </button>
            <button className="btn btn-success">SAVE</button>
          </div>
        </form>
      </ReactModal>

      <div className="flex items-center gap-12">
        <h1 className="text-2xl font-bold">
          Total Activities:
          <span className="ml-2">{roomActivities.length}</span>
        </h1>
        <button
          className="btn btn-info"
          type="submit"
          onClick={() => setCreateModal(true)}
        >
          CREATE
        </button>
      </div>

      <div className="mt-8">
        {
          roomActivities.length > 0 ? (
            <>
              <table className="table table-compact w-full">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Submitted</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    roomActivities.map((item, i) => (
                      <tr key={i.toString()}>
                        <td>{item.data().title}</td>
                        <td>{item.data().submitted.length}</td>
                        <td className="flex gap-2">
                          <button 
                            className="btn btn-sm btn-info"
                            onClick={() => navigate(`/faculty/activity?room=${roomId}&activity=${item.id}`)}
                          >
                            View
                          </button>
                          <button 
                            className="btn btn-sm btn-error"
                          >
                            DELETE
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
    </>
  )
}