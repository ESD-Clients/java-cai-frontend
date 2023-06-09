import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import RichText from "../../components/RichText";
import { Helper, ModuleController } from "../../controllers/_Controllers";
import Loading from "../../modals/Loading";

export default function Dashboard() {

  const user = Helper.getCurrentUser();

  const [loaded, setLoaded] = useState(false);

  const [currentModule, setCurrentModule] = useState(null);
  const [modules, setModules] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const unsubscribeModules = ModuleController.subscribeLearnersModule(snapshot => {
      setModules(snapshot.docs)
      getCurrentModule(snapshot.docs);
      computeProgress(snapshot.docs);
      setModules(snapshot.docs)
    })

    return () => unsubscribeModules();
    
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

    if (modules.length > 0) {
      let progress = (100 / modules.length) * finishedModules.length;

      setProgress(progress);
    }
    else {
      setProgress(0)
    }
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
                  currentModule ? (
                    <div className="px-8 w-full">
                      <h1 className="text-lg mb-8 text-gray-600 font-semibold">Current Module: </h1>

                      <h1 className="text-5xl font-bold">
                        {currentModule.data().title}
                      </h1>
                      <RichText
                        value={currentModule.data().sypnosis}
                      />
                      {/* <p className="py-6 whitespace-pre-wrap">
                        {
                          currentModule.data().sypnosis
                        }
                      </p> */}
                      <div className="divider"></div>
                      <div className="flex flex-row justify-end">
                        <Link
                          className="btn btn-primary"
                          to={"/learner/module?" + currentModule.id}
                        >
                          Get Started
                        </Link>
                      </div>
                    </div>
                  ) : (
                    user.current_module ? (
                      modules.length > 0 ? (
                        <div className="px-8 w-full">
                          <h1 className="text-5xl font-bold">
                            Congratulations!
                          </h1>
                        </div>
                      ) : (
                        <div className="px-8 w-full">
                          <h1 className="text-2xl text-gray-600">
                            No modules yet
                          </h1>
                        </div>
                      )
                    ) : (
                      <div className="px-8 w-full">
                        <h1 className="text-2xl text-gray-600">
                          You don't have assigned modules yet.
                        </h1>
                      </div>
                    )
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
                        to={"/learner/module?" + item.id}
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