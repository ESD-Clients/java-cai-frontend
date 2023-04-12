import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FacultyController, ModuleController, StudentController } from "../../controllers/_Controllers";
import Loading from "../../modals/Loading";

export default function Dashboard({ user }) {

  const [loaded, setLoaded] = useState(false);

  const [students, setStudents] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [modules, setModules] = useState([]);
  const [rooms, setRooms] = useState([]);


  useEffect(() => {
    async function fetchData() {

      let students = await StudentController.getActiveList();
      setStudents(students);
      
      let faculties = await FacultyController.getActiveList();
      setFaculties(faculties);

      let modules = await ModuleController.getList();
      setModules(modules);
      
      setLoaded(true);
    }

    if(!loaded) fetchData();

  }, [loaded])

  if(!loaded) return <Loading />

  return (
    <>
      <div className="drawer drawer-mobile">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* <!-- Navbar --> */}
          {/* <AdminNavBar user={user} /> */}

          <div className="p-6">
            <div className="flex xl:flex-row flex-col justify-between">
              <div className="w-full lg:pr-8 p-0">
                <div className="flex flex-col items-center justify-center mb-8">
                  <div className="text-2xl font-thin">
                    Good Morning, {user.name}
                  </div>
                </div>
                <div className="flex flex-col items-center mb-8">
                  <span className="mb-2">Dashboard Menu</span>
                  <ul className="menu menu-horizontal bg-base-200 rounded-box p-2">
                    <li className="tooltip tooltip-bottom" data-tip="Approve Modules">
                      <Link to="/admin/approve-modules">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
                        </svg>
                      </Link>
                    </li>
                    <li className="tooltip tooltip-bottom" data-tip="Edit Modules">
                      <Link to="/admin/edit-modules">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM10 9h8v2h-8zm0 3h4v2h-4zm0-6h8v2h-8z" />
                        </svg>
                      </Link>
                    </li>
                    <li className="tooltip tooltip-bottom" data-tip="Faculty List">
                      <Link to="/admin/faculty-list">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 20">
                          <path fill="currentColor" d="M10 9.25c-2.27 0-2.73-3.44-2.73-3.44C7 4.02 7.82 2 9.97 2c2.16 0 2.98 2.02 2.71 3.81c0 0-.41 3.44-2.68 3.44zm0 2.57L12.72 10c2.39 0 4.52 2.33 4.52 4.53v2.49s-3.65 1.13-7.24 1.13c-3.65 0-7.24-1.13-7.24-1.13v-2.49c0-2.25 1.94-4.48 4.47-4.48z" />
                        </svg>
                      </Link>
                    </li>
                    <li className="tooltip tooltip-bottom" data-tip="Student List">
                      <Link to="/admin/student-list">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                          <path fill="currentColor" d="m16 7.78l-.313.095l-12.5 4.188L.345 13L2 13.53v8.75c-.597.347-1 .98-1 1.72a2 2 0 1 0 4 0c0-.74-.403-1.373-1-1.72v-8.06l2 .655V20c0 .82.5 1.5 1.094 1.97c.594.467 1.332.797 2.218 1.093c1.774.59 4.112.937 6.688.937c2.576 0 4.914-.346 6.688-.938c.886-.295 1.624-.625 2.218-1.093C25.5 21.5 26 20.82 26 20v-5.125l2.813-.938L31.655 13l-2.843-.938l-12.5-4.187L16 7.78zm0 2.095L25.375 13L16 16.125L6.625 13L16 9.875zm-8 5.688l7.688 2.562l.312.094l.313-.095L24 15.562V20c0 .01.004.126-.313.375c-.316.25-.883.565-1.625.813C20.58 21.681 18.395 22 16 22c-2.395 0-4.58-.318-6.063-.813c-.74-.247-1.308-.563-1.624-.812C7.995 20.125 8 20.01 8 20v-4.438z" />
                        </svg>
                      </Link>
                    </li>
                    <li className="tooltip tooltip-bottom" data-tip="Rooms">
                      <Link to="/admin/rooms">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                            <path d="M5 2h11a3 3 0 0 1 3 3v14a1 1 0 0 1-1 1h-3" />
                            <path d="m5 2l7.588 1.518A3 3 0 0 1 15 6.459V20.78a1 1 0 0 1-1.196.98l-7.196-1.438A2 2 0 0 1 5 18.36V2Zm7 10v2" />
                          </g>
                        </svg>
                      </Link>
                    </li>
                    <li className="tooltip tooltip-bottom" data-tip="Admin Settings">
                      <Link to="/admin/settings">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                            <path d="M13 2v4l-2 1l-3-3l-4 4l3 3l-1 2H2v6h4l1 2l-3 3l4 4l3-3l2 1v4h6v-4l2-1l3 3l4-4l-3-3l1-2h4v-6h-4l-1-2l3-3l-4-4l-3 3l-2-1V2Z" />
                            <circle cx="16" cy="16" r="4" />
                          </g>
                        </svg>
                      </Link>
                    </li>
                  </ul>
                </div>
                {/* <!--// TODO: ALL THE "NO NEW -- SHOULD BE CHANGED AS DATABASE PRODUCTS" --> */}
                <div className="grid lg:grid-cols-2 gap-x-14 gap-y-8 h-full">
                  <div className="flex flex-col">
                    <div className="text-center">Student List</div>
                    <Link to="/admin/student-list" className="border rounded-md h-full">
                      {
                        students.length > 0 ? (
                          <>
                            <table className="table w-full">
                              <thead>
                                <tr>
                                  <th></th>
                                  <th>Name</th>
                                  <th>Section</th>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                  students.map((item, i) => (
                                    <tr key={i.toString()}>
                                      <td>{item.id}</td>
                                      <td>{item.name}</td>
                                      <td>{item.section}</td>
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
                    </Link>
                  </div>

                  <div className="flex flex-col">
                    <div className="text-center">Faculty List</div>
                    <Link to="/admin/faculty-list" className="border rounded-md h-full w-full">
                      {
                        faculties.length > 0 ? (
                          <>
                            <table className="table w-full">
                              <thead>
                                <tr>
                                  {/* <th></th> */}
                                  <th>Name</th>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                  faculties.map((item, i) => (
                                    <tr key={i.toString()}>
                                      {/* <td>{item.id}</td> */}
                                      <td>{item.data().name}</td>
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
                    </Link>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-center">Modules List</div>
                    <Link to="/admin/approve-modules" className="border rounded-md h-full w-full">
                      {
                        modules.length > 0 ? (
                          <>
                            <table className="table w-full">
                              <thead>
                                <tr>
                                  <th></th>
                                  <th>Title</th>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                  modules.map((item, i) => (
                                    <tr key={i.toString()}>
                                      <td>{item.id}</td>
                                      <td>{item.title}</td>
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
                    </Link>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-center">Active Rooms</div>
                    <Link to="/admin/rooms" className="border rounded-md h-full w-full">
                      {
                        rooms.length > 0 ? (
                          <>
                            <table className="table w-full">
                              <thead>
                                <tr>
                                  <th></th>
                                  <th>Name</th>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                  rooms.map((item, i) => (
                                    <tr key={i.toString()}>
                                      <td>{item.id}</td>
                                      <td>{item.name}</td>
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
                    </Link>
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
  );
}