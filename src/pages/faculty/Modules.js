import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ModuleController } from "../../controllers/_Controllers";
import SearchField from "../../components/SearchField";
import { Dots } from "react-activity";
import { CLR_PRIMARY } from "../../values/MyColor";

export default function Modules({ user }) {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState([]);
  const [filter, setFilter] = useState('');


  useEffect(() => {

    const unsubscribe = ModuleController.subscribeList(async (snapshot) => {
      let docs = snapshot.docs;

      for (let doc of docs) {
        let topics = await ModuleController.getTopics(doc.id);
        doc.topics = topics;
      }
      setModules(docs);
      setLoading(false);
    })

    return () => unsubscribe();
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
                    <th>Title</th>
                    <th>Remarks</th>
                    <th>Topics</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    modules.map((item, i) => (
                      checkFilter(item) && (
                        <tr key={i.toString()}>
                          <td>{item.data().title}</td>
                          <td>{item.data().remarks}</td>
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