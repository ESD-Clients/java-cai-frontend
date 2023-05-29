import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Helper, LearnerController } from "../../../controllers/_Controllers";
import { Dots } from "react-activity";
import { CLR_PRIMARY } from "../../../values/MyColor";
import SearchField from "../../../components/SearchField";
import { useNavigate } from "react-router-dom";
import { showConfirmationBox, showLoading, showMessageBox } from "../../../modals/Modal";


export default function LearnerList({ user }) {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [learners, setLearners] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    let unsubscribe = LearnerController.subscribeActiveList(snapshot => {
      setLearners(snapshot.docs);
      setLoading(false);
    })

    return () => unsubscribe();

  }, [])

  function viewItem(item) {
    navigate('/admin/learner?'+item.id)
  }

  async function deleteItem(item) {
    showConfirmationBox({
      title: "Confirmation",
      message: "Are you sure you want to delete this item?",
      type: "warning",
      onYes: async () => {
        showLoading({
          message: "Deleting..."
        })

        let result = await LearnerController.destroy(item.id);
        if (result) {
          showMessageBox({
            title: "Success",
            message: "Success",
            type: "success",
          })
        }
        else {
          showMessageBox({
            title: "Error",
            message: "Something went wrong",
            type: "danger",
          });
        }

      }
    })
  }

  function checkFilter(item) {
    if (filter) {
      let value = filter.toLowerCase();
      let name = item.data().name.toLowerCase();
      let email = item.data().email.toLowerCase();
      let learnerNo = Helper.padIdNo(item.data().learnerNo);

      if (name.includes(value) || email.includes(value) || learnerNo.includes(value)) {
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
      <div className="flex xl:flex-row flex-col justify-between">
        <div className="w-full lg:pr-8 p-0">
          
        <div className="flex flex-col sm:flex-row justify-between mb-8">
          <div>
            <div className="font-bold uppercase mb-4">Learner List</div>
            <div className="font-thin">Total Number of Learners:
              <span className="font-bold ml-2">
                {learners.length}
              </span>
            </div>
          </div>
          <div className="mt-4 flex flex-row justify-center">
            <SearchField
              setFilter={setFilter}
              placeholder="Search learner no, name or email"
            />
          </div>
        </div>

          <div className="divider"></div>
          <div className="overflow-x-auto">
            <div>
              <table className="table table-compact w-full">
                <thead>
                  <tr>
                    <th>Learner No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    learners.map((item, i) => (
                      checkFilter(item) && (
                        <tr key={i.toString()}>
                          <td>{Helper.padIdNo(item.data().learnerNo)}</td>
                          <td>{item.data().name}</td>
                          <td>{item.data().email}</td>
                          <td className="flex gap-2">
                            <button className="btn btn-info btn-sm" onClick={() => viewItem(item)}>
                              View
                            </button>
                            <button className="btn btn-sm btn-error" onClick={() => deleteItem(item)}>
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
        </div>
      </div>
    </>
  )
}