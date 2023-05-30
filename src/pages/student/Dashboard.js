import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import RichText from "../../components/RichText";
import { Helper, ModuleController, RoomController } from "../../controllers/_Controllers";
import Loading from "../../modals/Loading";
import { getDocData } from "../../controllers/_Helper";

export default function Dashboard() {

  const user = Helper.getCurrentUser();

  const [loaded, setLoaded] = useState(false);

  const [currentModule, setCurrentModule] = useState(null);
  const [room, setRoom] = useState(null);
  const [modules, setModules] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if(user.currentRoom) {
      const unsubscribeRoom = RoomController.subscribeDoc(user.currentRoom, async (snapshot) => {
        if (snapshot.exists) {
          setRoom(getDocData(snapshot));
  
          let modules = await ModuleController.getModulesByRoom(snapshot.id);
          setModules(modules);
  
          getCurrentModule(modules);
          computeProgress(modules);
        }
      })
  
      return () => unsubscribeRoom();
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    async function fetchData() {
      setLoaded(true);
    }

    if (!loaded && user) fetchData();
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded])

  function getCurrentModule(modules) {

    let current = modules.length > 0 ? modules[0] : null;

    for (let i = 1; i < modules.length; i++) {
      if (ModuleController.isModuleUnlocked({
        student: user,
        lastId: i > 0 ? modules[i - 1].id : ''
      })) {
        current = modules[i];
      }
    }

    setCurrentModule(current);
  }

  function computeProgress(modules) {
    let finishedModules = user.finishedModules;

    let progress = (100 / modules.length) * finishedModules.length;

    setProgress(progress);
  }

  if (!loaded) return <Loading />

  return (
    <>

      <div className="flex flex-row justify-center">
        <div className="w-full lg:px-8 p-0 m-0">
          <div className="rounded-lg ">
            <div className="flex gap-6 items-center bg-base-100 w-full">
              {
                user.imageUri ? (
                  <img
                    src={user.imageUri}
                    className="avatar h-28 w-28 object-cover"
                    alt="Student Profile"
                  />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-28" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                    <path fill="currentColor" d="M16 8a5 5 0 1 0 5 5a5 5 0 0 0-5-5Z" />
                    <path fill="currentColor" d="M16 2a14 14 0 1 0 14 14A14.016 14.016 0 0 0 16 2Zm7.992 22.926A5.002 5.002 0 0 0 19 20h-6a5.002 5.002 0 0 0-4.992 4.926a12 12 0 1 1 15.985 0Z" />
                  </svg>
                )
              }
              <div>
                <div className="font-bold text-2xl">{user.name}</div>
                <div>
                  <span className="text-sm">Student No: </span>
                  <span className="ml-2 font-semibold text-lg">{Helper.padIdNo(user.studentNo)}</span>
                </div>
              </div>
              <div className="ml-4">
                <div>
                  <span className="text-sm">Email:</span>
                  <span className="ml-2 font-semibold text-lg">{user.email}</span>
                </div>
                <div>
                  <span className="text-sm">School</span>
                  <span className="ml-2 font-semibold text-lg">{user.school.name}</span>
                </div>
              </div>
              {/* <div className="stat">
                <div className="flex flex-row items-center">
                  <div className="">
                    <span className="stat-title">Good Morning,</span>
                    <span className="font-bold text-xl ml-2">{user.name}</span>
                  </div>
                </div>
              </div>
              <div className="stat">
                <div>
                <div className="stat-title">
                    Progress:
                  <span className="font-semibold ml-2 text-primary">{progress.toFixed(2)}%</span>
                </div>
                </div>
                <div className="stat-desc">
                  <progress className="progress progress-primary w-full lg:w-56" value={progress} max="100"></progress>
                </div>
              </div> */}
            </div>
            <div className="flex items-center gap-4 mt-8 px-4">
              <div className="text-lg font-bold">
                Progress:
              </div>
              <div className="flex-1 flex items-center">
                <progress className="progress progress-primary w-full h-4" value={progress} max="100"></progress>
              </div>
              <div>
                <span className="font-bold ml-2 text-2xl text-primary">{progress.toFixed(2)}%</span>
              </div>
            </div>
          </div>

          <div className="w-full mt-8">
            <div className="hero bg-base-200 rounded-lg">
              <div className="hero-content w-full">
                {
                  room ? (
                    <div className="w-full">
                      <div>
                        <div className="text-gray-500">
                          Room Code:
                        </div>
                        <div className="text-2xl font-bold">
                          {room.code}
                        </div>
                      </div>
                      <div className="mt-8 mb-2 text-gray-500">
                        Current Module:
                      </div>
                      {
                        currentModule ? (
                          <div className="px-8 w-full">
                            <h1 className="text-2xl font-bold">
                              {currentModule.data().title}
                            </h1>
                            <RichText
                              value={currentModule.data().sypnosis}
                            />
                            <div className="divider"></div>
                            <div className="flex flex-row justify-end">
                              <Link
                                className="btn btn-primary"
                                to={"/student/module?" + currentModule.id}
                              >
                                Get Started
                              </Link>
                            </div>
                          </div>
                        ) : (
                          <div className="px-8 w-full">
                            <h1 className="text-2xl text-gray-600">
                              No available modules yet.
                            </h1>
                          </div>
                        )
                      }
                    </div>
                  ) : (
                    <div className="px-8 w-full">
                      <h1 className="text-2xl text-gray-600">
                        You need to join a room first.
                      </h1>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block  min-w-[16rem]">
          <ul className="menu pl-2 pt-4 bg-base-200 rounded-box">
            <li className="menu-title">
              <span className="uppercase">Module List</span>
            </li>
            {
              modules.length > 0 ? (
                modules.map((item, i) => (
                  ModuleController.isModuleUnlocked({
                    student: user,
                    lastId: i > 0 ? modules[i - 1].id : ''
                  }) ? (
                    <li key={i.toString()} className="relative">
                      <Link
                        to={"/student/module?" + item.id}
                        className="overflow-hidden text-ellipsis block w-[13rem] whitespace-nowrap hover:whitespace-normal transition-all"
                      >
                        {item.data().title}
                      </Link>
                    </li>
                  ) : (
                    <li className="disabled" key={i.toString()}>
                      <span>
                        <span
                          className="overflow-hidden text-ellipsis block w-[10rem] whitespace-nowrap"
                        >{item.data().title}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M20 12c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5S7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7z" />
                        </svg>
                      </span>
                    </li>
                  )
                ))
              ) : (
                <li className="text-gray-400 m-4">(No modules yet.)</li>
              )
            }
          </ul>
        </div>
      </div>
    </>
  )
}