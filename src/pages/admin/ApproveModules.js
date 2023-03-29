import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminNavBar from "../../components/AdminNavBar";
import AdminSideBar from "../../components/AdminSideBar";
import AdminStatBar from "../../components/AdminStatBar";
import { ModuleController } from "../../controllers/_Controllers";
import Loading from "../../modals/Loading";

export default function ApprovedModules({ user }) {

  const [loaded, setLoaded] = useState(false);

  const [modules, setModules] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let modules = await ModuleController.getUnapprovedModules();
      setModules(modules);
      setLoaded(true)
    }

    if(!loaded) fetchData();

  }, [loaded])


  function viewItem (e) {

    e.preventDefault();

  }

  if(!loaded) return <Loading />

  return (
    <>
      <div className="drawer drawer-mobile">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">

          {/* <AdminNavBar user={user} /> */}

          {/* <!-- Page content here --> */}
          <div className="p-6">
            <div className="flex xl:flex-row flex-col justify-between">
              <div className="w-full lg:pr-8 p-0">
                <div className="flex flex-col items-center justify-center mb-8">
                  <div className="font-bold uppercase mb-4">Module List</div>
                  <div className="font-thin">
                    Total Number of Available Modules:
                    <span className="font-bold ml-2">
                      {modules.length}
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <div>
                    {
                      modules.length > 0 ? (
                        <>
                          <table className="table table-compact w-full">
                            <thead>
                              <tr>
                                <th>Module No.</th>
                                <th>Title</th>
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
                                      <Link 
                                        className="btn btn-sm btn-primary"
                                        to="/admin/view-approve-module"
                                        state={{
                                          module: item
                                        }}
                                      >
                                        View Content
                                      </Link>
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
  )
}