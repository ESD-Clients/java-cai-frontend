import { useNavigate } from "react-router-dom";
import { RoomController } from "../../../controllers/_Controllers";
import { clearModal, showConfirmationBox, showLoading, showMessageBox } from "../../../modals/Modal";
import { useState } from "react";
import ReactModal from "react-modal";
import TextField from "../../../components/TextField";
import Select from "../../../components/Select";
import { formatDateTime } from "../../../controllers/_Helper";

export default function ModuleList({ roomId, moduleList }) {

  const navigate = useNavigate();

  function removeModule(moduleId) {

    showConfirmationBox({
      message: "Are you sure you want to delete this activity?",
      type: "danger",
      onYes: async () => {

        showLoading({
          message: "Deleting activity..."
        })

        let res = await RoomController.destroyActivity(roomId, moduleId);

        clearModal();

        if (res !== true) {
          showMessageBox({
            title: "Error",
            message: "Something went wrong!",
            type: "danger"
          })
        }
      }
    })
  }

  async function addModule () {

  }

  return (
    <>
      <div className="flex items-center gap-12">
        <h1 className="text-2xl font-bold">
          Total Modules:
          <span className="ml-2">{moduleList.length}</span>
        </h1>
        <button
          className="btn btn-info"
          // type="submit"
          onClick={() => {
            navigate('/faculty/modules/add', {
              state: {
                room: roomId
              }
            })
          }}
        >
          ADD MODULE
        </button>
      </div>

      <div className="mt-8">
        {
          moduleList.length > 0 ? (
            <>
              <table className="table table-compact w-full">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Title</th>
                    <th>Close Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    moduleList.map((item, i) => (
                      <tr key={i.toString()}>
                        <td>{item.data().moduleNo}</td>
                        <td>{item.data().title}</td>
                        <td>{formatDateTime(item.data().closeDate)}</td>
                        <td className="flex gap-2">
                          <button
                            className="btn btn-sm btn-info"
                            onClick={() => navigate(`/faculty/module?${item.id}`)}
                          >
                            View
                          </button>
                          <button
                            className="btn btn-sm btn-error"
                            onClick={() => removeModule(item.id)}
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
            <div className="flex justify-center items-center">No modules yet</div>
          )
        }
      </div>
    </>
  )
}