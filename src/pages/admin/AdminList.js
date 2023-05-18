import { useEffect } from "react";
import { useState } from "react";
import PasswordField from "../../components/PasswordField";
import { AdminController, Helper } from "../../controllers/_Controllers";
import { getErrorMessage } from "../../controllers/_Helper";
import { showLoading, showMessageBox } from "../../modals/Modal";
import SearchField from "../../components/SearchField";
import { Dots } from "react-activity";
import { CLR_PRIMARY } from "../../values/MyColor";

export default function AdminList() {

  const [loading, setLoading] = useState(true);
  const [faculties, setFaculties] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {

    let unsubscribe = AdminController.subscribeActiveList(res => {
      setFaculties(res.docs);
      setLoading(false);
    })

    return () => unsubscribe();

  }, [])

  async function addItem(e) {
    e.preventDefault();
    document.getElementById("addAdmin").click();

    showLoading({
      message: "Saving..."
    })

    let result = await AdminController.register({
      ...Helper.getEventFormData(e)
    });

    if (result && result.id) {
      showMessageBox({
        title: "Success",
        message: "Success",
        type: "success",
      })
    }
    else {
      showMessageBox({
        title: "Error",
        message: getErrorMessage(result),
        type: "danger",
        onPress: () => {
          document.getElementById("addAdmin").click();
        }
      });
    }
  }

  function checkFilter(item) {
    if (filter) {
      let value = filter.toLowerCase();
      let name = item.data().name.toLowerCase();
      let email = item.data().email.toLowerCase();
      let adminNo = Helper.padIdNo(item.data().adminNo);

      if (name.includes(value) || email.includes(value) || adminNo.includes(value)) {
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
      <input type="checkbox" id="addAdmin" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-center">Add Administrator</h3>
          <form id="addAdminForm" onSubmit={addItem}>
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
              <label htmlFor="addAdmin" className="btn btn-error">Close</label>
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
          <p className="py-4">Administrator Added</p>
        </div>
      </div>

      <div className="flex xl:flex-row flex-col justify-between">
        <div className="w-full lg:pr-8 p-0">

          <div className="flex flex-col sm:flex-row justify-between mb-8">
            <div>
              <div className="font-bold uppercase mb-4">Administrator List</div>
              <div className="font-thin">Total Number of Available Administrator:
                <span className="font-bold ml-2">
                  {faculties.length}
                </span>
              </div>
            </div>
            <div className="mt-4 flex flex-row justify-center">
              <SearchField
                setFilter={setFilter}
                placeholder="Search admin no, name or email"
              />
              <label htmlFor="addAdmin" className="btn btn-primary">Add Admin</label>
            </div>
          </div>

          <div className="divider"></div>
          <div className="overflow-x-auto" id="tableDisplay">
            <div>
              <table className="table table-compact w-full">
                <thead>
                  <tr>
                    <th>Admin No</th>
                    <th>Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    faculties.map((item, i) => (
                      checkFilter(item) && (
                        <tr key={i.toString()}>
                          <td>{Helper.padIdNo(item.data().adminNo)}</td>
                          <td>{item.data().name}</td>
                          <td>{item.data().email}</td>
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