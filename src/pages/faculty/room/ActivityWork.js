import moment from "moment/moment";
import { useEffect, useState } from "react";
import { Dots } from "react-activity";
import { useLocation, useNavigate } from "react-router-dom";
import HDivider from "../../../components/HDivider";
import RichText from "../../../components/RichText";
import { RoomController, StudentController } from "../../../controllers/_Controllers";
import { getDocData } from "../../../controllers/_Helper";
import { CLR_PRIMARY } from "../../../values/MyColor";
import ReactModal from "react-modal";
import TextField from "../../../components/TextField";
import { clearModal, showLoading, showMessageBox } from "../../../modals/Modal";


export default function ActivityWork({ user }) {

  const navigate = useNavigate();
  const location = useLocation();

  const room = location.state.room;
  const activity = location.state.activity;

  const [work, setWork] = useState(location.state.work);
  const [checkModal, setCheckModal] = useState(false);
  const [score, setScore] = useState('');

  async function checkActivity(e) {
    e.preventDefault();
    
    showLoading({
      message: "Updating..."
    })

    let intScore = parseInt(score);

    let res = await RoomController.checkWork(room.id, activity.id, work.id, intScore);

    clearModal();

    if(res === true) {

      let updatedWork = work;
      updatedWork.score = intScore;
      setWork(updatedWork);
      setCheckModal(false);
    }
    else {
      showMessageBox({
        title: "error",
        message: "Something went wrong!",
        type: "danger"
      })
    }
  }


  return (
    <>
      <ReactModal
        isOpen={checkModal}
        ariaHideApp={false}
        style={{ overlay: { zIndex: 49, background: "transparent" } }}
        className="bg-modal flex w-full h-full backdrop-blur-sm z-50 items-center justify-center overflow-y-auto"
      >
        <form className="bg-base-200 p-4 w-[20rem] rounded relative" onSubmit={checkActivity}>
          <div className="my-4">
            <h1 className="text-lg font-bold">Check Activity</h1>
          </div>
          <TextField
            label="Activity Score"
            type="number"
            required
            max={activity.points}
            min={0}
            value={score}
            onChange={setScore}
          />
          <div className="flex justify-end my-4 space-x-2">
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => setCheckModal(false)}
            >
              CANCEL
            </button>
            <button className="btn btn-success">SUBMIT</button>
          </div>
        </form>
      </ReactModal>

      <div className="flex justify-between">
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
            <path fill="currentColor" d="m12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2H7.825l5.6 5.6Z" />
          </svg>
          <p>Back</p>
        </button>

        {
          work.score ? (
            <div>
              <h2>Score:</h2>
              <h6 className="uppercase text-2xl font-bold">{work.score} / {activity.points}</h6>
            </div>
          ) : (
            <button className="btn btn-success" onClick={() => setCheckModal(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <p>Check</p>
            </button>
          )
        }
      </div>

      <HDivider />

      <div className="flex justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold">{activity.title}</h2>
        </div>
        <div className="">
          <div className="">Room Code :</div>
          <div className="text-xl font-bold">{room && room.code}</div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between">
          <h6 className="uppercase font-bold">Instruction:</h6>
          {
            !work.score && (
              <h6 className="uppercase font-bold">{activity.points} Points</h6>
            )
          }
        </div>
        <RichText
          value={activity.instruction}
        />
      </div>

      <div className="mb-8">

        <div className="text-2xl mb-2 flex items-center gap-4">
          <span className="uppercase text-sm w-[8rem]">Name : </span>
          <span className="font-bold">{work.student.name}</span>
        </div>

        <div className="text-xl mb-2 flex items-center gap-4">
          <span className="uppercase text-sm w-[8rem]">School : </span>
          <span className="font-bold">{work.student.school}</span>
        </div>

        <div className="text-xl mb-2 flex items-center gap-4">
          <span className="uppercase text-sm w-[8rem]">Email : </span>
          <span className="font-bold">{work.student.email}</span>
        </div>

        <div className="text-xl mb-2 flex items-center gap-4">
          <span className="uppercase text-sm w-[8rem]">Submitted At : </span>
          <span className="font-bold">{moment(work.submittedAt).format('hh:mm A - DD/MM/yyyy')}</span>
        </div>

        <div className="uppercase font-bold mt-8">STUDENT WORK :</div>
        <RichText value={work.work} />

        {
          work.files.length > 0 && (
            <>
              <span className="uppercase font-bold">ATTACHMENTS :</span>
              <ul>
                {
                  work.files.map((item, index) => (
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