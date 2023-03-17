import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import UserNavbar from "../../components/UserNavBar";
import { Helper, ModuleController } from "../../controllers/_Controllers";
import Loading from "../../modals/Loading";

export default function Dashboard() {

  const user = Helper.getCurrentUser();

  const [loaded, setLoaded] = useState(false);

  const [currentModules, setCurrentModules] = useState([]);
  const [modules, setModules] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    async function fetchData () {

      let currentModules = await ModuleController.getModulesByNumber(user.current_module);
      setCurrentModules(currentModules);

      let modules = await ModuleController.getActiveList();
      setModules(modules);
      computeProgress(modules);

      setLoaded(true);
    }

    if(!loaded && user) fetchData();
  }, [loaded])

  function computeProgress (modules) {
    let doneModules = 0;

    for(let module of modules) {
      if(user.current_module > module.number) {
        doneModules++;
      }
    }

    let progress = (100 / modules.length) * doneModules;
    console.log(doneModules, progress);
    setProgress(progress);
  }

  if(!loaded) return <Loading />

  return (
    <>
      <UserNavbar user={user} />

      <div className="w-screen flex flex-row justify-center ">
        <div className="lg:w-[70vw] w-full lg:mt-4 m-0 lg:px-8 px-4">
          <div className="flex flex-row justify-center">
            <div className="w-full lg:px-8 p-0 lg:mr-8 m-0">
              <div className="mb-10">
                <div className="stats shadow bg-base-100 border border-slate-600 w-full">
                  <div className="stat">
                    <div className="flex flex-row items-center">
                      <div className="stat-title">
                        Good Morning, <span className="ml-2">{user.name}</span>
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
                <div className="hero bg-base-200 py-10 rounded-lg">
                  <div className="hero-content w-full">
                    {
                      currentModules.length > 0 ? (
                        <div className="px-8 w-full">
                          <h1 className="text-5xl font-bold">
                            {"Module " + user.current_module}
                          </h1>
                          <h1 className="text-xl">Current Module</h1>
                          <p className="py-6">
                            {
                              currentModules.length > 0 ? (
                                currentModules.map((item) => item.content)
                              ) : null
                            }
                          </p>
                          <div className="divider"></div>
                          <div className="flex flex-row justify-end">
                            <Link
                              className="btn btn-primary"
                              to={"/student/module?" + user.current_module}
                            >
                              Get Started
                            </Link>
                          </div>
                        </div>
                      ) : (
                        modules.length > 0 ? (
                          <div className="px-8 w-full">
                            <h1 className="text-5xl font-bold">
                              Congratulations!
                            </h1>
                          </div>
                        ) : (
                          <div className="px-8 w-full">
                            <h1 className="text-2xl">
                              No modules yet
                            </h1>
                          </div>
                        )
                      )
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <ul className="menu bg-base-200 w-56 p-4 rounded-box">
                <li className="menu-title">
                  <span className="uppercase">Module List</span>
                </li>
                <div>
                  {
                    modules.length > 0 ? (
                      modules.map((item, i) => {
                        if(item.remarks === "approved") {
                          if(item.number <= user.current_module) {
                            return (
                              <li key={i.toString()}>
                                <Link to={"/student/module?" + item.number} >
                                  Module {item.number}
                                </Link>
                              </li>
                            )
                          }
                          else {
                            return (
                              <li className="disabled" key={i.toString()}>
                                <span>Module {item.number}
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M20 12c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5S7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7z" />
                                  </svg>
                                </span>
                              </li>
                            )
                          }
                        }
                      })
                    ) : (
                      <li>No Module Available</li>
                    )
                  }
                  {/* <?php
                        $result = mysqli_query($conn, 'SELECT * from tb_modules ORDER BY number');

                        if (mysqli_num_rows($result) > 0) {
                            while ($row = mysqli_fetch_assoc($result)) {
                                if ($row['remarks'] == 'Approved') {
                                    if ($row['number'] <= $_SESSION['userCurrentmodule']) {
                                        echo '<li><button type="submit" name="viewItem" value="' . $row['number'] . '">Module ' . $row['number'] . '</button`></li>';
                                    } else {
                                        echo '<li className="disabled"><span>Module ' . $row['number'] . ' <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                <path fill="currentColor" d="M20 12c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5S7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7z" />
                </svg></span></li>';
                                    }
                                }
                            }
                        } else {
                            echo '<li>No Module Available</li>';
                        }
                        ?> */}
                </div>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}