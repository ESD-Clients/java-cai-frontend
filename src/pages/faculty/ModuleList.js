import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helper, ModuleController, RoomController } from "../../controllers/_Controllers";
import SearchField from "../../components/SearchField";
import { Dots } from "react-activity";
import { CLR_PRIMARY } from "../../values/MyColor";

export default function ModuleList({ user }) {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState([]);
  const [filter, setFilter] = useState('');


  useEffect(() => {

    async function fetchData () {
      const results = await ModuleController.getModulesByFaculty(user.id);
      for (let doc of results) {
        let topics = await ModuleController.getTopics(doc.id);
        doc.topics = topics;
        if(doc.data().room) {
          let room = await RoomController.get(doc.data().room);
          doc.room = room;
        }
      }
      setModules(results);
      setLoading(false);
    }

    fetchData();

    // const unsubscribe = ModuleController.getModulesByFaculty(async (results) => {

    //   for (let doc of results) {
    //     let topics = await ModuleController.getTopics(doc.id);
    //     doc.topics = topics;
    //   }
    //   setModules(results);
    //   setLoading(false);
    // })

    // return () => unsubscribe();
  }, [])

  function viewItem(item) {
    navigate('/faculty/module?' + item)
  }

  function viewQuestions(item) {
    navigate('/faculty/questions?' + item)
  }

  function checkFilter (item) {
    if(filter) {
      let value = filter.toLowerCase();
      let title = item.data().title.toLowerCase();
      let remarks = item.data().remarks.toLowerCase();

      if(title.includes(value) || remarks.includes(value)) {
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
              <div className="font-bold uppercase mb-4">Module List</div>
              <div className="font-thin">Total Number of Available Modules:
                <span className="font-bold ml-2">
                  {modules.length}
                </span>
              </div>
            </div>
            <div className="mt-4 flex flex-row justify-center">
              <SearchField
                setFilter={setFilter}
                placeholder="Search title or remarks"
              />
              <Link to="/faculty/modules/add" className="btn btn-primary">
                Create
              </Link>
            </div>
          </div>
          
          <div className="divider" />
          <div className="overflow-x-auto">
            <div>
              <table className="table table-compact w-full">
                <thead>
                  <tr>
                    <th>Module No</th>
                    <th>Title</th>
                    <th>Room</th>
                    <th>Close Date</th>
                    <th>Topics</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    modules.map((item, i) => (
                      checkFilter(item) && (
                        <tr key={i.toString()}>
                          <td>{item.data().moduleNo}</td>
                          <td>{item.data().title}</td>
                          <td>{item.room ? item.room.code : "-"}</td>
                          <td>{Helper.formatDateTime(item.data().closeDate)}</td>
                          <td>{item.topics.length}</td>
                          <td className="flex gap-2">
                            <button className="btn btn-sm btn-info" onClick={() => viewItem(item.id)}>
                              View Content
                            </button>
                            <button className="btn btn-sm btn-info" onClick={() => viewQuestions(item.id)}>
                              View Questions
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