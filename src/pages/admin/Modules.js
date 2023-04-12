import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ModuleController } from "../../controllers/_Controllers";
import { getErrorMessage } from "../../controllers/_Helper";
import { clearModal, showMessageBox } from "../../modals/Modal";
import SearchField from "../../components/SearchField";
import { Dots } from "react-activity";
import { CLR_PRIMARY } from "../../values/MyColor";
import Select from "../../components/Select";

export default function Modules({ user }) {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [modules, setModules] = useState([]);
  const [filter, setFilter] = useState('');
  const [remarksFilter, setRemarksFilter] = useState('all')

  useEffect(() => {

    const unsubscribe = ModuleController.subscribeList(async (snapshot) => {
      let docs = snapshot.docs;

      for (let doc of docs) {
        let topics = await ModuleController.getTopics(doc.id);
        doc.topics = topics;
      }
      setModules(docs);
      setLoading(false);
    })

    return () => unsubscribe();
  }, [])

  function viewModule(item) {
    navigate('/admin/module?' + item)
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

  function checkFilter(item) {

    if(remarksFilter !== "all" && remarksFilter !== item.data().remarks) {
      return false;
    }

    if (filter) {
      let value = filter.toLowerCase();
      let title = item.data().title.toLowerCase();

      if (title.includes(value)) {
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
      <div className="w-full lg:pr-8 p-0">

        <div className="flex flex-col sm:flex-row justify-between mb-8">
          <div>
            <div className="font-bold uppercase mb-4">Module List</div>
            <div className="font-thin">Total Number of Modules:
              <span className="font-bold ml-2">
                {modules.length}
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-row justify-center">
            <div className="relative input">
              <select 
                type="text" 
                className="input input-bordered pr-10 lg:w-[20rem]" 
                value={remarksFilter}
                onChange={e => setRemarksFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="approved">Approved</option>
                <option value="unapproved">Unapproved</option>
              </select>
            </div>
            <SearchField
              setFilter={setFilter}
              placeholder="Search title..."
            />
          </div>
        </div>

        <div className="divider" />

        <div className="overflow-x-auto">
          <div>
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
                    checkFilter(item) && (
                      <tr key={i.toString()}>
                        <td>{item.data().title}</td>
                        <td>{item.data().remarks}</td>
                        <td>{item.topics.length}</td>
                        <td className="flex gap-2">
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
      </div>
    </>
  )
}