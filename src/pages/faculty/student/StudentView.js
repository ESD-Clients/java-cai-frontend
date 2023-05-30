import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { Helper, ModuleController, RoomController, SchoolController, StudentController } from "../../../controllers/_Controllers";
import { getDocData } from "../../../controllers/_Helper";
import HDivider from "../../../components/HDivider";
import Header2 from "../../../components/Header2";
import moment from "moment";
import StudentQuizResult from "./StudentQuizResult";
import StudentProgress from "../reports/StudentProgress";

export default function StudentView({user}) {

  const navigate = useNavigate();
  const location = useLocation();

  const studentId = location.search.substring(1);
  const [modules, setModules] = useState([]);
  const [student, setStudent] = useState(null);

  const [selectedModule, setSelectedModule] = useState(null);

  useEffect(() => {

    async function getModules() {
      let modules = await ModuleController.getModulesByRoom(student.currentRoom.id);
      setModules(modules);
    }

    if(student) {
      getModules();
    }

  }, [student])

  useEffect(() => {
    const unsubscribe = StudentController.subscribeDoc(studentId, async snapshot => {
      let student = getDocData(snapshot);
      let room = await RoomController.get(student.currentRoom);
      let finishedModules = [];
      let school = await SchoolController.get(student.school);

      for (let moduleId of student.finishedModules) {
        let module = await ModuleController.get(moduleId);
        let quiz = await ModuleController.getQuizResult(moduleId, student.id);

        module.quizResult = quiz;

        finishedModules.push(module);
      }

      student.currentRoom = room;
      student.modules = student.finishedModules;
      student.finishedModules = finishedModules;
      student.school = school;

      setStudent(student);
    });
    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // function computeProgress() {
  //   let finishedModules = student.finishedModules;

  //   let progress = (100 / modules.length) * finishedModules.length;

  //   return progress;
  // }

  if (!studentId || !student) return null;

  if(selectedModule) {
    return (
      <div className="relative w-full">
        <StudentQuizResult 
          student={student} 
          module={selectedModule} 
          result={selectedModule.quizResult} 
          setSelected={setSelectedModule}
        />
      </div>
    )
  }

  // function exportReport() {
  //   let doc = new jsPDF();

  //   // let toPrint = document.getElementById("toPrint")
  //   // return;
  //   doc.html(toPrint, {
  //     callback(doc) {
  //       doc.save('pdf_name');
  //     },
  //   })
  //   // doc.save('sample-file.pdf');
  // };

  function getQuizTakesCount (item) {
    let modulesTaken = student.modulesTaken;

    if(modulesTaken && modulesTaken.length > 0) {
      for(let module of modulesTaken) {
        if(item.id === module.id) {
          return module.takes;
        }
      }
    }
    return 1;
  }

  function computeModuleCompleteDuration (module) {

    let diff = module.quizResult.submittedAt - module.createdAt;

    // Convert milliseconds to seconds
    let seconds = Math.floor(diff / 1000);

    // Convert seconds to minutes
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;

    // Convert minutes to hours
    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;

    // Convert hours to days
    let days = Math.floor(hours / 24);
    hours = hours % 24;

    return `${days}d : ${hours}h : ${minutes}m`
  }

  
  return (
    <>
      <div>
        <div className="flex justify-between">
          <div className="flex w-full gap-4 items-center">
            <div className="flex gap-4 items-center flex-1">
              <button className="btn btn-ghost" onClick={() => navigate(-1)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                  <path fill="currentColor" d="m12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2H7.825l5.6 5.6Z" />
                </svg>
                <p>Back</p>
              </button>
              <Header2 value="Student Profile" />
            </div>
            {/* <button className="btn btn-info" onClick={exportReport}>
              <p>Export</p>
            </button> */}
          </div>

          {/* <button className="btn btn-primary" onClick={() => navigate('/faculty/questions?' + moduleId)}>
          <p>VIEW QUESTIONS</p>
        </button> */}
        </div>

        <HDivider />

        <div className="flex gap-10 items-center">
          {
            student.imageUri ? (
              <img
                className="h-[10rem] w-[10rem] rounded-full object-cover"
                src={student.imageUri}
                alt={student.name}
              />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-[10rem] text-gray-400" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                <path fill="currentColor" d="M16 8a5 5 0 1 0 5 5a5 5 0 0 0-5-5Z" />
                <path fill="currentColor" d="M16 2a14 14 0 1 0 14 14A14.016 14.016 0 0 0 16 2Zm7.992 22.926A5.002 5.002 0 0 0 19 20h-6a5.002 5.002 0 0 0-4.992 4.926a12 12 0 1 1 15.985 0Z" />
              </svg>
            )
          }
          <div className="">
            <h1 className="font-bold text-4xl">{student.name}</h1>
          </div>
        </div>

        <div className="mt-4">
          <StudentInfo
            label="Student No"
            value={Helper.padIdNo(student.studentNo)}
          />
          <StudentInfo
            label="Email"
            value={student.email}
          />
          <StudentInfo
            label="Date of Birth"
            value={moment(student.dateOfBirth).format("MMMM DD, yyyy")}
          />
          <StudentInfo
            label="School"
            value={student.school.schoolNo + " - " + student.school.name}
          />
        </div>

        <div className="mt-8">
          <div className="flex items-center gap-12">
            <Header2 value="Completed Modules" />
            {/* <progress className="progress progress-primary w-full lg:w-56" value={computeProgress()} max="100" /> */}
          </div>
          <table className="table table-compact w-full">
            <thead>
              <tr>
                <th>Module No</th>
                <th>Title</th>
                <th>Time Completed</th>
                <th>Duration</th>
                <th>Takes</th>
                <th>Quiz Result</th>
                {/* <th>Quiz Status</th> */}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                student.finishedModules.map((item, i) => (
                  <tr key={i.toString()}>
                    <td>{item.moduleNo}</td>
                    <td>{item.title}</td>
                    <td>{Helper.formatDateTime(item.quizResult.submittedAt)}</td>
                    <td>{computeModuleCompleteDuration(item)}</td>
                    <td>{getQuizTakesCount(item)}</td>
                    <td>{item.quizResult.studentScore}/{item.quizResult.totalScore}</td>
                    {/* <td className="italic">
                      {item.remarks === "for checking" ? "Coding Unchecked" : "Passed"} 
                    </td> */}
                    <td className="flex gap-2">
                      <button className="btn btn-info btn-sm" onClick={() => setSelectedModule(item)}>
                        View Quiz
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>

        </div>
        <HDivider />
        <div className="">
          <Header2 value="Student Reports" />
          <StudentProgress
            student={student}
            modules={modules}
          />
        </div>
      </div>
      <div id="editor"></div>
    </>
  )
}

const StudentInfo = ({ label, value }) => {

  return (
    <div className="flex items-center gap-4 py-2">
      <div className="uppercase mr-2 w-[10rem] text-right text-sm">{label}</div>
      <div className="divider divider-horizontal" />
      {
        value ? (
          <div className="font-bold text-lg">{value}</div>
        ) : (
          <div className="italic font-light text-lg">N/A</div>
        )
      }
    </div>
  )
}