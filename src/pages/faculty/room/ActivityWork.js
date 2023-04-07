import moment from "moment/moment";
import { useEffect, useState } from "react";
import { Dots } from "react-activity";
import { useLocation, useNavigate } from "react-router-dom";
import HDivider from "../../../components/HDivider";
import RichText from "../../../components/RichText";
import { RoomController, StudentController } from "../../../controllers/_Controllers";
import { getDocData } from "../../../controllers/_Helper";
import { CLR_PRIMARY } from "../../../values/MyColor";


export default function ActivityWork ({user}) {

  const navigate = useNavigate();
  const location = useLocation();

  const room = location.state.room;
  const activity = location.state.activity;
  const work = location.state.work;


  return (
    <>
    
      <div className="flex justify-between">
        <div>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
              <path fill="currentColor" d="m12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2H7.825l5.6 5.6Z" />
            </svg>
            <p>Back</p>
          </button>
        </div>
        {/* <div>
          <button className="btn btn-error" type="submit">Delete</button>
        </div> */}
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
        <span className="uppercase font-bold">Instruction :</span>
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
                          <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-500 stroke-current" width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"/></svg>
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