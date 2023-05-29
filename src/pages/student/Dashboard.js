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
    const unsubscribeRoom = RoomController.subscribeDoc(user.currentRoom, async (snapshot) => {
      if (snapshot) {
        setRoom(getDocData(snapshot));

        let modules = await ModuleController.getModulesByRoom(snapshot.id);
        setModules(modules);

        getCurrentModule(modules);
        computeProgress(modules);
      }
    })

    return () => unsubscribeRoom();
  }, [])

  useEffect(() => {
    async function fetchData() {
      setLoaded(true);
    }

    if (!loaded && user) fetchData();
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
          <div className="mb-10">
            <div className="stats shadow bg-base-100 border border-slate-600 w-full">
              <div className="stat">
                <div className="flex flex-row items-center">
                  <div className="">
                    <span className="stat-title">Good Morning,</span>
                    <span className="font-bold text-xl ml-2">{user.name}</span>
                  </div>
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Progress</div>
                <div className="stat-desc">
                  <progress className="progress progress-primary w-full lg:w-56" value={progress} max="100"></progress>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
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