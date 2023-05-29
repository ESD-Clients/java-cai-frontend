import { useNavigate } from "react-router-dom"

export default function ActivityList({room, activities}) {

  const navigate = useNavigate();

  return (
    <div>
      <h2 className="font-bold text-lg">Activities</h2>

      <div className="mt-8">
        {
          activities.length > 0 ? (
            <>
              <table className="table table-compact w-full">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Points</th>
                    <th>Remarks</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    activities.map((item, i) => (
                      <tr key={i.toString()}>
                        <td>{item.data().title}</td>
                        <td>{item.data().points}</td>
                        <td>
                          {
                            item.studentWork ? (
                              item.studentWork.score ? (
                                <span className="text-green-500">{item.studentWork.score}</span>
                              ) : (
                                <span className="italic text-blue-400">Submitted</span>
                              )
                            ) : (
                              <span className="italic text-red-400">No work/s submitted</span>
                            )
                          }
                        </td>
                        <td>
                          <button
                            className="btn btn-info btn-sm"
                            onClick={() => navigate(`/student/activity?room=${room.id}&activity=${item.id}`)}
                          >
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
            <div className="flex justify-center items-center">No activities yet</div>
          )
        }
      </div>
    </div>
  )
}