import { useEffect, useState } from "react";
import { Dots } from "react-activity";
import { useLocation, useNavigate } from "react-router-dom"
import HDivider from "../../../components/HDivider";
import RichText from "../../../components/RichText";
import RichTextEditor from "../../../components/RichTextEditor";
import { RoomController } from "../../../controllers/_Controllers";
import { clearModal, showConfirmationBox, showLoading, showMessageBox } from "../../../modals/Modal";
import { CLR_PRIMARY } from "../../../values/MyColor";

export default function Activity({ user }) {

  const navigate = useNavigate();
  const location = useLocation();

  function getIds() {
    let values = location.search.substring(1);
    if (values) {
      values = values.split("&");

      if (values.length === 2) {
        let roomId = values[0].split("=")[1] ? values[0].split("=")[1] : "";
        let activityId = values[1].split("=")[1] ? values[1].split("=")[1] : "";

        return { roomId, activityId };
      }
    }

    return { roomId: "", activityId: "" };
  }

  const { roomId, activityId } = getIds();

  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState(null);
  const [activity, setActivity] = useState(null);
  const [validUser, setValidUser] = useState(false);
  const [submittedWork, setSubmittedWork] = useState(null);

  const [work, setWork] = useState('');
  const [files, setFiles] = useState([]);


  useEffect(() => {

    async function fetchData() {
      let room = await RoomController.get(roomId);

      if (room.students.includes(user.id)) {
        setValidUser(true);

        let activity = await RoomController.getActivity(roomId, activityId);

        if (activity) {
          let studentWork = await RoomController.getStudentWork(roomId, activityId, user.id);
          setSubmittedWork(studentWork);
        }

        setRoom(room);
        setActivity(activity);
        setLoading(false);
      }
    }

    if (roomId && activityId) {
      fetchData();
    }

  }, [roomId, activityId])

  function removeFile(index) {
    let list = [...files];
    list.splice(index, 1);
    setFiles(list);
  }

  function submitWork() {
    showConfirmationBox({
      title: "Please check your work",
      message: "Are you sure you want to submit your work? You cannot edit your work once you submit it.",
      type: "warning",
      onYes: async () => {
        showLoading({
          message: "Submitting work..."
        })

        let fileUrls = [];

        for (let file of files) {
          let url = await RoomController.uploadFile(file, `room/activity/${activityId}/studentWork/${user.id}`);
          fileUrls.push(url);
        }

        let studentWork = {
          studentId: user.id,
          work: work,
          files: fileUrls
        }

        let result = await RoomController.submitWork(roomId, activityId, studentWork);
        let activity = await RoomController.getActivity(roomId, activityId);
        let studentSubmit = [...activity.submitted, user.id];
        await RoomController.updateActivity(roomId, activityId, {
          submitted: studentSubmit
        })

        clearModal();

        if (result && result.id) {
          setSubmittedWork(result);
          showMessageBox({
            title: "Success",
            message: "Your work has been submitted successfully!",
            type: "success"
          });
        }
        else {
          showMessageBox({
            title: "Error",
            message: "Something went wrong!",
            type: "danger"
          })
        }
      }
    })

  }

  function checkWork() {
    let regex = /(<([^>]+)>)/ig
    let hasText = !!work.replace(regex, "").length;
    if (hasText || files.length > 0) {
      return true;
    }

    return false;
  }

  if (loading) {
    return (
      <div className="w-full flex flex-col h-[40vh] items-center justify-center">
        <p>
          Getting room and activity's information...
        </p>

        <Dots color={CLR_PRIMARY} />
      </div>
    )
  }

  if (!validUser) return (
    <div className="flex justify-between items-center">
      <div>
        You have no writes to access this page.
      </div>
    </div>
  )

  return (
    <>
      <div className="flex justify-between gap-4">
        <div>
          <button className="btn btn-ghost" onClick={() => navigate('/student/room')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
              <path fill="currentColor" d="m12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2H7.825l5.6 5.6Z" />
            </svg>
            <p>Back</p>
          </button>
        </div>
        <div className="flex items-center">
          <div className="">Room Code :</div>
          <div className="ml-4 text-4xl font-bold">{room && room.code}</div>
        </div>

      </div>

      <HDivider />

      <div>
        <div className="flex justify-between">
          <h1 className="text-4xl font-bold">{activity.title}</h1>
          <div>
            <h2>Score:</h2>
            {
              submittedWork ? (
                <h6 className="uppercase text-2xl font-bold">
                  {submittedWork.score ? submittedWork.score : "-"} / {activity.points}
                </h6>
              ) : (
                <span className="italic text-red-400">No work/s submitted</span>
              )
            }
          </div>
          
        </div>

        {/* <h6 className="uppercase font-bold mt-8">{activity.points} Points</h6> */}
        <div className="my-8">
          <h6 className="uppercase font-bold text-xs">Instruction:</h6>
          <RichText
            value={activity.instruction}
          />
        </div>
        <div>
          <h6 className="uppercase font-bold text-xs mb-4">
            Your work:
          </h6>
          {
            submittedWork ? (
              <RichText
                value={submittedWork.work}
              />
            ) : (
              <RichTextEditor
                value={work}
                onChange={setWork}
              />
            )
          }
        </div>

        {
          !submittedWork && (
            <>
              <div className="my-4 flex justify-between">
                <div>
                  <input
                    id="file-input"
                    type="file"
                    className="hidden"
                    multiple
                    onChange={e => {
                      let selectedFiles = [];
                      for (let item of e.target.files) {
                        selectedFiles.push(item);
                      }
                      setFiles([...files, ...selectedFiles]);
                    }}
                  />
                  <label htmlFor="file-input" className="btn btn-primary">
                    <span className="mr-2">Attach Files</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current" width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                  </label>
                </div>
                <div>
                  <button className="btn btn-success" disabled={!checkWork()} onClick={submitWork}>
                    SUBMIT WORK
                  </button>
                </div>
              </div>
              <ul>
                {
                  files.map((item, index) => (
                    <li
                      key={index.toString()}
                      className="py-2"
                    >
                      <div className="border p-2 max-w-[20rem] flex items-center gap-4">
                        <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis block">
                          {item.name}
                        </span>
                        <span className="cursor-pointer" onClick={() => removeFile(index)}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-500 stroke-current" width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v18H3zM15 9l-6 6m0-6l6 6" /></svg>
                        </span>
                      </div>
                    </li>
                  ))
                }
              </ul>
            </>
          )
        }

        {
          submittedWork && (
            <>
              <h6 className="uppercase font-bold text-xs mb-4">
                Attachments
              </h6>
              <ul>
                {
                  submittedWork.files.map((item, index) => (
                    <li
                      key={index.toString()}
                      className="py-2"
                    >
                      <div className="border p-2 max-w-[20rem] flex items-center gap-4">
                        <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis block">
                          {`${activity.title}_${(index + 1)}`}
                        </span>
                        <a
                          className="cursor-pointer"
                          target='_blank'
                          href={item}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-500 stroke-current" width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5" /></svg>
                        </a>
                      </div>
                    </li>
                  ))
                }
              </ul>
            </>
          )
        }

      </div>
    </>
  )
}