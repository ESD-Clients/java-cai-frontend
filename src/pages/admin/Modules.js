import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ModuleController } from "../../controllers/_Controllers";
import { getErrorMessage } from "../../controllers/_Helper";
import { clearModal, showMessageBox } from "../../modals/Modal";

export default function Modules({ user }) {

  const navigate = useNavigate();

  const [modules, setModules] = useState([]);

  useEffect(() => {

    const unsubscribe = ModuleController.subscribeList(async (snapshot) => {    
      let docs = snapshot.docs;

      for(let doc of docs) {
        let topics = await ModuleController.getTopics(doc.id);
        doc.topics = topics;
      }
      setModules(docs);
    })

    return () => unsubscribe();
  }, [])

  function viewModule (item) {
    navigate('/admin/module?'+item)
  }

  async function approveModule(moduleId) {
    
    let result = await ModuleController.update(moduleId, {
      remarks: "approved"
    });

    clearModal();

    if (result && result.id) {
      showMessageBox({
        title: "Success",
        message: "Success",
        type: "success"
      })
    }
    else {
      
      showMessageBox({
        title: "Error",
        message: getErrorMessage(result),
        type: "danger",
        onPress: () => {
        }
      });
    }
    
  }

  async function disapproveModule(moduleId) {
    let result = await ModuleController.update(moduleId, {
      remarks: "disapproved"
    });

    clearModal();

    if (result && result.id) {
      showMessageBox({
        title: "Success",
        message: "Success",
        type: "success"
      })
    }
    else {
      
      showMessageBox({
        title: "Error",
        message: getErrorMessage(result),
        type: "danger",
        onPress: () => {
        }
      });
    }
  }


  return (
    <>
      <div className="w-full lg:pr-8 p-0">

        <div className="overflow-x-auto">
          <div>
            <div className="font-bold uppercase mb-4 text-center">Module List</div>
            <table className="table table-compact w-full">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Remarks</th>
                  <th>Topics</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  modules.map((item, i) => (
                    <tr key={i.toString()}>
                      <td>{item.data().title}</td>
                      <td>{item.data().remarks}</td>
                      <td>{item.topics.length}</td>
                      <td className="space-x-1">
                        <button className="btn btn-sm btn-primary" onClick={() => viewModule(item.id)}>
                          View
                        </button>
                        <button className="btn btn-sm btn-success" onClick={() => approveModule(item.id)}>
                          Approved
                        </button>
                        <button className="btn btn-sm btn-error" onClick={() => disapproveModule(item.id)}>
                          Disapproved
                        </button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>

            </table>
            {
              modules.length === 0 && (
                <div className="text-center text-gray-600 mt-8">(No modules yet.)</div>
              )
            }
          </div>
        </div>
      </div>
    </>
  )
}