import { useNavigate } from "react-router-dom"
import { Helper } from "../../../controllers/_Controllers";

export default function ModuleList({student, room, modules}) {

  const navigate = useNavigate();

  console.log(student);

  return (
    <div>
      <h2 className="font-bold text-lg">Modules</h2>

      <div className="mt-8">
        {
          modules.length > 0 ? (
            <>
              <table className="table table-compact w-full">
                <thead>
                  <tr>
                    <th>Module No</th>
                    <th>Title</th>
                    <th>Topics</th>
                    <th>Close Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    modules.map((item, i) => (
                      <tr 
                        key={i.toString()}
                        className={i > 0 && !student.finishedModules.includes(modules[i-1].id) ? "text-gray-400" : ""}
                      >
                        <td>{item.data().moduleNo}</td>
                        <td>{item.data().title}</td>
                        <td>{item.data().topics}</td>
                        <td>{Helper.formatDateTime(item.data().closeDate)}</td>
                        <td>
                          <button
                            className="btn btn-info btn-sm"
                            onClick={() => navigate(`/student/module?${item.id}`)}
                            disabled={i > 0 && !student.finishedModules.includes(modules[i-1].id)}
                          >
                            View
                          </button>
                          {/* <button
                            className="btn btn-info btn-sm"
                            onClick={() => navigate(`/student/module?${item.id}`)}
                            disabled={i > 0 && !student.finishedModules.includes(modules[i-1])}
                          >
                            Take Quiz
                          </button> */}
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </>
          ) : (
            <div className="flex justify-center items-center">No activities yet</div>
          )
        }
      </div>
    </div>
  )
}