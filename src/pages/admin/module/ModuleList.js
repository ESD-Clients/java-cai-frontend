import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helper, LearnerController, ModuleController } from "../../../controllers/_Controllers";
import { getDocData, getErrorMessage } from "../../../controllers/_Helper";
import { clearModal, showMessageBox } from "../../../modals/Modal";
import SearchField from "../../../components/SearchField";
import { Dots } from "react-activity";
import { CLR_PRIMARY } from "../../../values/MyColor";
import ReactModal from "react-modal";
import StudentQuizResult from "../../faculty/student/StudentQuizResult";

export default function ModuleList({ user }) {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [modules, setModules] = useState([]);
  const [filter, setFilter] = useState('');
  const [learnerAnswers, setLearnerAnswers] = useState([]);
  const [quizModal, setQuizModal] = useState(false);

  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedWork, setSelectedWork] = useState(null);

  useEffect(() => {

    const unsubscribe = ModuleController.subscribeLearnersModule(async (snapshot) => {
      let docs = snapshot.docs;

      for (let doc of docs) {
        let topics = await ModuleController.getTopics(doc.id);
        doc.topics = topics;

        let learnerAnswers = await ModuleController.getQuizAnswers(doc.id);
        let answers = [];
        for(let doc of learnerAnswers) {
          let result = getDocData(doc);
          let learner = await LearnerController.get(result.studentId);
          
          result.learner = learner;
          answers.push(result);
        }
        doc.learnerAnswers = answers;
      }
      setModules(docs);
      setLoading(false);
    })

    return () => unsubscribe();
  }, [])

  function viewItem(item) {
    navigate('/admin/module?' + item)
  }

  function viewQuestions(item) {
    navigate('/admin/questions?' + item)
  }

  function checkFilter(item) {

    if (filter) {
      let value = filter.toLowerCase();
      let title = item.data().title.toLowerCase();

      if (title.includes(value)) {
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

  if(selectedWork) {
    return (
      <div className="relative w-full">
        <StudentQuizResult 
          student={selectedWork.learner} 
          module={selectedModule} 
          result={selectedWork} 
          setSelected={setSelectedWork}
          user={user}
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
          <div className="flex justify-between">
            <div className="font-bold">
              Learners Answers
            </div>
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
                <th>Learner No</th>
                <th>Name</th>
                <th>Submitted At</th>
                <th>Status</th>
                <th>Score</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                learnerAnswers.map((item, i) => (
                  <tr key={i.toString()}>
                    
                    <td>{item.learner.learnerNo}</td>
                    <td>{item.learner.name}</td>
                    <td>{Helper.formatDateTime(item.submittedAt)}</td>
                    <td>{item.remarks}</td>
                    <td>{item.studentScore}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => {
                          setSelectedWork(item);
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
      <div className="w-full lg:pr-8 p-0">

        <div className="flex flex-col sm:flex-row justify-between mb-8">
          <div>
            <div className="font-bold uppercase mb-4">Module List</div>
            <div className="font-thin">Total Number of Modules:
              <span className="font-bold ml-2">
                {modules.length}
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-row justify-center">
            <SearchField
              setFilter={setFilter}
              placeholder="Search title..."
            />
            <Link to="/admin/modules/add" className="btn btn-primary">
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
                  <th>No</th>
                  <th>Title</th>
                  <th>Topics</th>
                  <th>Quiz Taker</th>
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
                        <td>{item.topics.length}</td>
                        <td>{item.learnerAnswers.length}</td>
                        <td className="flex gap-2">
                          <button className="btn btn-sm btn-info" onClick={() => viewItem(item.id)}>
                            Content
                          </button>
                          <button className="btn btn-sm btn-info" onClick={() => viewQuestions(item.id)}>
                            Questions
                          </button>
                          <button className="btn btn-sm btn-info" onClick={() => {
                            setQuizModal(true);
                            setLearnerAnswers(item.learnerAnswers);
                            setSelectedModule(item)
                          }}>
                            Learners Answers
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
    </>
  )
}