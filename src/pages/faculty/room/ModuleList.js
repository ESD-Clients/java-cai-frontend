import { useNavigate } from "react-router-dom";
import { Helper, ModuleController, RoomController, StudentController } from "../../../controllers/_Controllers";
import { clearModal, showConfirmationBox, showLoading, showMessageBox } from "../../../modals/Modal";
import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { formatDateTime, getDocData } from "../../../controllers/_Helper";
import StudentQuizResult from "../student/StudentQuizResult";
import RoomModuleStudents from "../reports/RoomModuleStudents";

export default function ModuleList({ roomId, moduleList, studentList }) {

  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [quizModal, setQuizModal] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {

    async function fetchData () {
      let result = await ModuleController.getModuleWorks(module.id);
      let quizzes = [];
      for(let doc of result) {
        let quiz = getDocData(doc);
        let student = await StudentController.get(doc.data().studentId);
        quiz.student = student;
        quizzes.push(quiz);
      }

      setQuizzes(quizzes);
    }

    if(module) {
      fetchData();
    }
  }, [module])

  function removeModule(moduleId) {

    showConfirmationBox({
      message: "Are you sure you want to delete this activity?",
      type: "danger",
      onYes: async () => {

        showLoading({
          message: "Deleting activity..."
        })

        let res = await RoomController.destroyActivity(roomId, moduleId);

        clearModal();

        if (res !== true) {
          showMessageBox({
            title: "Error",
            message: "Something went wrong!",
            type: "danger"
          })
        }
      }
    })
  }

  if(module && quiz) {
    return (
      <div className="relative w-full">
        <StudentQuizResult 
          student={quiz.student} 
          module={module} 
          result={quiz} 
          setSelected={() => {
            setQuizModal(false);
            setModule(null);
            setQuiz(null);
          }}
        />
      </div>
    )
  }
  return (
    <>
      <ReactModal
        isOpen={quizModal}
        ariaHideApp={false}
        style={{ overlay: { zIndex: 49, background: "transparent" } }}
        className="bg-modal flex w-full h-full backdrop-blur-sm z-50 items-center justify-center overflow-y-scroll "
      >
        <div className="bg-base-200 p-4 sm:w-2/3 rounded relative">
          <div className="flex justify-end">
            <button className="btn btn-ghost" onClick={() => setQuizModal(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            </button>
          </div>
          <table className="table table-compact w-full">
            <thead>
              <tr>
                <th>Student No</th>
                <th>Name</th>
                <th>Submitted At</th>
                <th>Status</th>
                <th>Score</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                quizzes.map((item, i) => (
                  <tr key={i.toString()}>
                    
                    <td>{item.student.studentNo}</td>
                    <td>{item.student.name}</td>
                    <td>{Helper.formatDateTime(item.submittedAt)}</td>
                    <td>{item.remarks}</td>
                    <td>{item.studentScore}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => {
                          setQuiz(item)
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </ReactModal>
      <div className="flex items-center gap-12">
        <h1 className="text-2xl font-bold">
          Total Modules:
          <span className="ml-2">{moduleList.length}</span>
        </h1>
        <button
          className="btn btn-info"
          // type="submit"
          onClick={() => {
            navigate('/faculty/modules/add', {
              state: {
                room: roomId
              }
            })
          }}
        >
          ADD MODULE
        </button>
      </div>

      <div className="mt-8">
        <RoomModuleStudents
          students={studentList}
          modules={moduleList}
        />
      </div>

      <div className="mt-8">
        {
          moduleList.length > 0 ? (
            <>
              <table className="table table-compact w-full">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Title</th>
                    <th>Close Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    moduleList.map((item, i) => (
                      <tr key={i.toString()}>
                        <td>{item.data().moduleNo}</td>
                        <td>{item.data().title}</td>
                        <td>{formatDateTime(item.data().closeDate)}</td>
                        <td className="flex gap-2">
                          <button
                            className="btn btn-sm btn-info"
                            onClick={() => navigate(`/faculty/module?${item.id}`)}
                          >
                            View
                          </button>
                          <button
                            className="btn btn-sm btn-info"
                            onClick={() => {
                              setModule(getDocData(item));
                              setQuizModal(true);
                            }}
                          >
                            View Quizzes
                          </button>
                          <button
                            className="btn btn-sm btn-error"
                            onClick={() => removeModule(item.id)}
                          >
                            DELETE
                          </button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </>
          ) : (
            <div className="flex justify-center items-center">No modules yet</div>
          )
        }
      </div>
    </>
  )
}