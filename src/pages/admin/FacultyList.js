import { useEffect } from "react";
import { useState } from "react";
import { FacultyController, Helper } from "../../controllers/_Controllers";
import { getErrorMessage } from "../../controllers/_Helper";
import { showConfirmationBox, showLoading, showMessageBox } from "../../modals/Modal";

export default function FacultyList({ user }) {

  const [faculties, setFaculties] = useState([]);

  useEffect(() => {

    let unsubscribe = FacultyController.subscribeActiveList(res => {
      setFaculties(res.docs);
    })

    return () => unsubscribe();
    
  }, [])

  // useEffect(() => {
  //   async function fetchData() {
  //     console.log("Fetching...");
  //     let faculties = await FacultyController.getActiveList();
  //     setFaculties(faculties);
  //     setLoaded(true);
  //   }

  //   if (!loaded) {
  //     fetchData();
  //   }
  // }, [loaded])

  async function addItem(e) {
    e.preventDefault();
    document.getElementById("addFaculty").click();

    showLoading({
      message: "Saving..."
    })

    let result = await FacultyController.register({
      ...Helper.getEventFormData(e)
    });

    if(result && result.id) {
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
        if(result) {
          showMessageBox({
            title: "Success",
            message: "Success",
            type: "success",
            onPress: () => {
              // window.location.reload();
            }
          })
          // setLoaded(false);
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

  // if(!loaded) return <Loading />

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
                <input type="password" name="password" className="input input-bordered w-full" required />
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

      <div className="drawer drawer-mobile">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <div className="px-6">
            <div className="flex xl:flex-row flex-col justify-between">
              <div className="w-full lg:pr-8 p-0">
                <div className="flex flex-col items-center justify-center mb-8">
                  <div className="font-bold uppercase mb-4">Faculty List</div>
                  <div className="flex flex-row">
                    <div>
                      <label htmlFor="addFaculty" className="btn btn-primary">Add Faculty</label>
                    </div>
                    <div className="divider divider-horizontal"></div>
                    <form className="form-control" id="searchForm">
                      <div className="input-group">
                        <input type="text" name="faculty" placeholder="Search…" className="input input-bordered" />
                        <button className="btn btn-square" type="submit">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="divider"></div>
                <div className="overflow-x-auto" id="tableDisplay">
                  <div>
                    {
                      faculties.length > 0 ? (
                        <>
                          <table className="table table-compact w-full">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                faculties.map((item, i) => (
                                  <tr key={i.toString()}>
                                    <td>{item.data().name}</td>
                                    <td>{item.data().email}</td>
                                    <td>
                                      <button className="btn btn-error" onClick={() => deleteItem(item)}>
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
                        <div className="flex justify-center items-center">No Data Available</div>
                      )
                    }
                  </div>
                </div>
              </div>
              {/* <AdminStatBar /> */}
            </div>
          </div>
        </div>
        {/* <AdminSideBar /> */}
      </div>
    </>
    // TODO: SCRIPT
  )
}