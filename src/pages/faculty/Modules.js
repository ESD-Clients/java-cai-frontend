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

  const [modules, setModules] = useState([]);

  useEffect(() => {

    const unsubscribe = ModuleController.subscribeList((snapshot) => {
      setModules(snapshot.docs);
    })

    return () => unsubscribe();
  }, [])

  function viewItem (item) {
    navigate('/faculty/module?'+item)
  }

  function viewQuestions (item) {
    navigate('/faculty/questions?'+item)
    // navigate('/faculty/edit-module', {
    //   state: {
    //     item: item,
    //     type: "question"
    //   }
    // })
  }


  return (
    <>
      <div className="drawer drawer-mobile">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
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
                            <th>Title</th>
                            <th>Remarks</th>
                            <th>Topics</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            modules.map((item, i) => (
                              <tr key={i.toString()}>
                                <td>{item.data().title}</td>
                                <td>{item.data().remarks}</td>
                                <td>{item.data().topics.length}</td>
                                <td>
                                  <button className="btn btn-sm btn-primary" onClick={() => viewItem(item.id)}>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}