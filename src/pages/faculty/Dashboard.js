import { useEffect, useState } from "react";
import { ModuleController, RoomController, StudentController } from "../../controllers/_Controllers";

export default function Dashboard({ user }) {

  const [students, setStudents] = useState([]);
  const [modules, setModules] = useState([]);
  const [rooms, setRooms] = useState([]);


  useEffect(() => {
    let unsubscribeStudents = StudentController.subscribeActiveList(snapshot => {
      setStudents(snapshot.docs);
    });

    let unsubscribeModules = ModuleController.subscribeList(snapshot => {
      setModules(snapshot.docs);
    });

    let unsubscribeRooms = RoomController.subscribeFacultyRooms(user.id, snapshot => {
      setRooms(snapshot.docs);
    });

    return () => {
      unsubscribeModules();
      unsubscribeRooms();
      unsubscribeStudents();
    }

  }, [])


  return (
    <>
      <div className="flex xl:flex-row flex-col justify-between">
        <div className="w-full grid grid-cols-1  md:grid-cols-2 xl:grid-cols-3 gap-4">

          <div className="shadow-lg px-4 py-8 flex gap-4 bg-primary rounded-lg text-white">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                <path fill="currentColor" d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM10 9h8v2h-8zm0 3h4v2h-4zm0-6h8v2h-8z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold uppercase text-lg">Total Modules :</h2>
              <h4 className="font-bold uppercase text-4xl">{modules.length}</h4>
            </div>
          </div>

          <div className="shadow-lg px-4 py-8 flex gap-4 bg-secondary rounded-lg text-white">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                <path fill="currentColor" d="m16 7.78l-.313.095l-12.5 4.188L.345 13L2 13.53v8.75c-.597.347-1 .98-1 1.72a2 2 0 1 0 4 0c0-.74-.403-1.373-1-1.72v-8.06l2 .655V20c0 .82.5 1.5 1.094 1.97c.594.467 1.332.797 2.218 1.093c1.774.59 4.112.937 6.688.937c2.576 0 4.914-.346 6.688-.938c.886-.295 1.624-.625 2.218-1.093C25.5 21.5 26 20.82 26 20v-5.125l2.813-.938L31.655 13l-2.843-.938l-12.5-4.187L16 7.78zm0 2.095L25.375 13L16 16.125L6.625 13L16 9.875zm-8 5.688l7.688 2.562l.312.094l.313-.095L24 15.562V20c0 .01.004.126-.313.375c-.316.25-.883.565-1.625.813C20.58 21.681 18.395 22 16 22c-2.395 0-4.58-.318-6.063-.813c-.74-.247-1.308-.563-1.624-.812C7.995 20.125 8 20.01 8 20v-4.438z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold uppercase text-lg">Total Students :</h2>
              <h4 className="font-bold uppercase text-4xl">{students.length}</h4>
            </div>
          </div>

          <div className="shadow-lg px-4 py-8 flex gap-4 bg-accent rounded-lg text-white">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                  <path d="M5 2h11a3 3 0 0 1 3 3v14a1 1 0 0 1-1 1h-3" />
                  <path d="m5 2l7.588 1.518A3 3 0 0 1 15 6.459V20.78a1 1 0 0 1-1.196.98l-7.196-1.438A2 2 0 0 1 5 18.36V2Zm7 10v2" />
                </g>
              </svg>
            </div>
            <div>
              <h2 className="font-semibold uppercase text-lg">Total Rooms :</h2>
              <h4 className="font-bold uppercase text-4xl">{rooms.length}</h4>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}