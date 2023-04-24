import { useEffect } from "react";
import { useState } from "react";
import PasswordField from "../../components/PasswordField";
import { FacultyController, Helper } from "../../controllers/_Controllers";
import { getErrorMessage } from "../../controllers/_Helper";
import { showConfirmationBox, showLoading, showMessageBox } from "../../modals/Modal";
import SearchField from "../../components/SearchField";
import { Dots } from "react-activity";
import { CLR_PRIMARY } from "../../values/MyColor";

export default function FacultyList({ user }) {

  const [loading, setLoading] = useState(true);
  const [faculties, setFaculties] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {

    let unsubscribe = FacultyController.subscribeActiveList(res => {
      setFaculties(res.docs);
      setLoading(false);
    })

    return () => unsubscribe();

  }, [])

  async function addItem(e) {
    e.preventDefault();
    document.getElementById("addFaculty").click();

    showLoading({
      message: "Saving..."
    })

    let result = await FacultyController.register({
      ...Helper.getEventFormData(e)
    });

    if (result && result.id) {
      showMessageBox({
        title: "Success",
        message: "Success",
        type: "success",
        onPress: () => {
          window.location.reload();
        }
      })
    }
    else {
      showMessageBox({
        title: "Error",
        message: getErrorMessage(result),
        type: "danger",
        onPress: () => {
          document.getElementById("addFaculty").click();
        }
      });
    }
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

        let result = await FacultyController.destroy(item.id);
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
      let facultyNo = Helper.padIdNo(item.data().facultyNo);

      if (name.includes(value) || email.includes(value) || facultyNo.includes(value)) {
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
      <input type="checkbox" id="addFaculty" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-center">Add Faculty</h3>
          <form id="addFacultyForm" onSubmit={addItem}>
            <div className="form-control py-1">
              <label className="input-group">
                <span>Name</span>
                <input type="text" name="name" className="input input-bordered w-full" required />
              </label>
            </div>
            <div className="form-control py-1">
              <label className="input-group">
                <span>Email</span>
                <input type="email" name="email" className="input input-bordered w-full" required />
              </label>
            </div>
            <div className="form-control py-1">
              <label className="input-group">
                <span>Password</span>
                <PasswordField
                  className="rounded-l-none"
                  name="password"
                  required
                />
              </label>
            </div>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">Add</button>
              <label htmlFor="addFaculty" className="btn btn-error">Close</label>
            </div>
          </form>
          <p id="errorPlaceholder"></p>
        </div>
      </div>

      <input type="checkbox" id="successModal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label htmlFor="successModal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
          <h3 className="text-lg font-bold">Success</h3>
          <p className="py-4">Faculty Added</p>
        </div>
      </div>

      <div className="flex xl:flex-row flex-col justify-between">
        <div className="w-full lg:pr-8 p-0">

          <div className="flex flex-col sm:flex-row justify-between mb-8">
            <div>
              <div className="font-bold uppercase mb-4">Faculty List</div>
              <div className="font-thin">Total Number of Available Faculties:
                <span className="font-bold ml-2">
                  {faculties.length}
                </span>
              </div>
            </div>
            <div className="mt-4 flex flex-row justify-center">
              <SearchField
                setFilter={setFilter}
                placeholder="Search faculty no, name or email"
              />
              <label htmlFor="addFaculty" className="btn btn-primary">Add Faculty</label>
            </div>
          </div>

          <div className="divider"></div>
          <div className="overflow-x-auto" id="tableDisplay">
            <div>
              <table className="table table-compact w-full">
                <thead>
                  <tr>
                    <th>Faculty No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    faculties.map((item, i) => (
                      checkFilter(item) && (
                        <tr key={i.toString()}>
                          <td>{Helper.padIdNo(item.data().facultyNo)}</td>
                          <td>{item.data().name}</td>
                          <td>{item.data().email}</td>
                          <td className="flex gap-2">
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