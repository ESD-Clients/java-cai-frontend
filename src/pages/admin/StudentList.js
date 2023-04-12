import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Helper, StudentController } from "../../controllers/_Controllers";
import Loading from "../../modals/Loading";


export default function StudentList({ user }) {

  const [loaded, setLoaded] = useState(false);

  const [students, setStudents] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let students = await StudentController.getList();
      setStudents(students);
      setLoaded(true);
    }

    if (!loaded) fetchData();
  }, [loaded])

  function viewItem() {

  }

  if (!loaded) return <Loading />

  return (
    <>
      <div className="flex xl:flex-row flex-col justify-between">
        <div className="w-full lg:pr-8 p-0">
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="font-bold uppercase mb-4">Student List</div>
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
          </div>
          <div className="divider"></div>
          <div className="overflow-x-auto">
            <div id="viewStudentInfo">
              {
                students.length > 0 ? (
                  <>
                    <table className="table table-compact w-full">
                      <thead>
                        <tr>
                          <th>Student No</th>
                          <th>Name</th>
                          <th>Email</th>
                          {/* <th>Current Module</th>
                                <th>Progress</th> */}
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          students.map((item, i) => (
                            <tr key={i.toString()}>
                              <td>{Helper.padIdNo(item.data().studentNo)}</td>
                              <td>{item.data().name}</td>
                              <td>{item.data().email}</td>
                              {/* <td>{item.current_module}</td>
                                    <td>{item.data().progress}</td> */}
                              <td>
                                <button className="btn btn-info" onClick={() => viewItem(item)}>
                                  View
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
      </div>
    </>
  )
}