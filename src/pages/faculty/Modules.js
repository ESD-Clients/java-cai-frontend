import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminStatBar from "../../components/AdminStatBar";
import FacultyNavBar from "../../components/FacultyNavBar";
import FacultySideBar from "../../components/FacultySideBar";
import { ModuleController } from "../../controllers/_Controllers";
import Loading from "../../modals/Loading";

export default function Modules({user}) {

  const navigate = useNavigate();

  const [loaded, setLoaded] = useState(false);

  const [modules, setModules] = useState([]);

  useEffect(() => {

    async function fetchData() {
      let modules = await ModuleController.getActiveList();
      setModules(modules);
      setLoaded(true)
    }

    if (!loaded) fetchData();
  }, [loaded])

  function viewItem (item) {
    navigate('/faculty/edit-module', {
      state: {
        item: item,
        type: "content"
      }
    })
  }

  function viewQuestions (item) {
    navigate('/faculty/edit-module', {
      state: {
        item: item,
        type: "question"
      }
    })
  }

  if(!loaded) return <Loading />

  return (
    <>
      <div className="drawer drawer-mobile">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* <!-- Navbar --> */}
          <FacultyNavBar user={user} />
          {/* <!-- Page content here --> */}
          <div>
            <div className="p-6">
              <div className="flex xl:flex-row flex-col justify-between">
                <div className="w-full lg:pr-8 p-0">
                  <div className="flex flex-col items-center justify-center mb-8">
                    <div className="font-bold uppercase mb-4">Module List</div>
                    <div className="font-thin">Total Number of Available Modules: <span className="font-bold">
                      {/* <?php echo mysqli_num_rows(mysqli_query($conn, 'SELECT * from tb_modules')) ?> */}
                    </span></div>
                  </div>
                  <div className="overflow-x-auto">
                    <div>

                      <table className="table table-compact w-full">
                        <thead>
                          <tr>
                            <th>Module No.</th>
                            <th>Name</th>
                            <th>Remarks</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            modules.map((item, i) => (
                              <tr key={i.toString()}>
                                <td>{item.number}</td>
                                <td>{item.title}</td>
                                <td>{item.remarks}</td>
                                <td>
                                  <button className="btn btn-sm btn-primary" onClick={() => viewItem(item)}>
                                    View Content
                                  </button>
                                  <button className="btn btn-sm btn-primary ml-1" onClick={() => viewQuestions(item)}>
                                    View Questions
                                  </button>
                                </td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-row justify-center">
                    <Link to="/faculty/add-module" className="btn btn-primary">
                      Add Module
                    </Link>
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
  )
}