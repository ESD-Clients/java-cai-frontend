import { useEffect } from "react";
import { useState } from "react";
import AdminStatBar from "../../components/AdminStatBar";
import FacultySideBar from "../../components/FacultySideBar";
import { FacultyController } from "../../controllers/_Controllers";
import Loading from "../../modals/Loading";

export default function FacultyList() {

  const [loaded, setLoaded] = useState(false);
  const [faculties, setFaculties] = useState([]);

  useEffect(() => {

    async function fetchData () {
      let faculties = await FacultyController.getActiveList();
      setFaculties(faculties);

      setLoaded(true);
    }

    if (!loaded) fetchData();
  }, [loaded])

  if(!loaded) return <Loading />

  return (
    <>
      <input type="checkbox" id="addFaculty" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-center">Add Faculty</h3>
          <form id="addFacultyForm">
            <div className="form-control py-1">
              <label className="input-group">
                <span>Name</span>
                <input type="text" name="name" className="input input-bordered w-full" />
              </label>
            </div>
            <div className="form-control py-1">
              <label className="input-group">
                <span>Email</span>
                <input type="text" name="email" className="input input-bordered w-full" />
              </label>
            </div>
            <div className="form-control py-1">
              <label className="input-group">
                <span>Password</span>
                <input type="text" name="password" className="input input-bordered w-full" />
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


      <div className="drawer drawer-mobile">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* <!-- Navbar --> */}
          <div className="sticky top-0 backdrop-blur-sm">
            <div className="navbar w-full bg-base-100 px-6">
              <div className="flex-1 lg:hidden">
                <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                </label>
              </div>
              <div className="navbar-center px-2 mx-2 uppercase">Faculty List</div>
              <div className="flex justify-end flex-1">
                <div className="flex items-stretch">
                  <div className="dropdown dropdown-end">
                    <label tabIndex="0" className="btn btn-ghost rounded-btn lg:gap-4 p-0 lg:px-4">
                      <div className="avatar">
                        {/* <!-- <div className=" h-10 rounded-full">
                          <img src="" alt="" />

                        </div> --> */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                          <path fill="currentColor" d="M16 8a5 5 0 1 0 5 5a5 5 0 0 0-5-5Z" />
                          <path fill="currentColor" d="M16 2a14 14 0 1 0 14 14A14.016 14.016 0 0 0 16 2Zm7.992 22.926A5.002 5.002 0 0 0 19 20h-6a5.002 5.002 0 0 0-4.992 4.926a12 12 0 1 1 15.985 0Z" />
                        </svg>
                      </div>
                      <div className="lg:flex flex-col items-start hidden">
                        <div className="font-bold">
                          {/* <?php echo ($_SESSION['facultyName']) ?> */}
                        </div>
                        <div className="text-xs font-thin">Faculty</div>
                      </div>
                      <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                          <path fill="currentColor" d="m7 10l5 5l5-5z" />
                        </svg>
                      </div>
                    </label>
                    <ul tabIndex="0" className="menu menu-compact dropdown-content p-2 shadow bg-base-200 rounded-box w-52 mt-4 sticky">
                      <li><a href="/faculty/settings">Faculty Settings</a></li>
                      <li><a href="/src/api/faculty/logout.php">Logout</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- Page content here --> */}
          <div>
            <div className="p-6">
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
                    <form>

                      {
                        faculties.length > 0 ? (
                          <table className="table w-full">
                            <thead>
                              <tr>
                                <th></th>
                                <th>Name</th>
                                <th>Email</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                faculties.map((item, i) => (
                                  <tr key={i.toString()}>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                  </tr>
                                ))
                              }
                            </tbody>
                          </table>
                        ) : (
                          <div className="flex justify-center items-center">No Data Available</div>
                        )
                      }
                    </form>
                  </div>
                </div>
                
                <AdminStatBar />

              </div>
            </div>
          </div>
        </div>
        <FacultySideBar />
      </div>
    </>

    //TODO: Scripts
  )
}