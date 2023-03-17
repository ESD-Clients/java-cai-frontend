import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UserNavbar from "../../components/UserNavBar";
import { Helper, ModuleController } from "../../controllers/_Controllers";
import Loading from "../../modals/Loading";
import config from "../../config.json";

export default function Module () {
  const location = useLocation();
  const navigate = useNavigate();

  const user = Helper.getCurrentUser();
  const module = location.search.substring(1);

  const [loaded, setLoaded] = useState(false);
  const [modules, setModules] = useState([]);
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    if(module === "") navigate("/student")
  }, [module])

  useEffect(() => {
    async function fetchData () {
      let modules = await ModuleController.getModulesByNumber(module);
      setModules(modules);

      let quizResult = await ModuleController.getQuizResult({
        student: user.id,
        module: module
      });
      setQuizResult(quizResult);
      console.log("Quiz", quizResult);
      setLoaded(true);
    }

    if(!loaded) fetchData();
  }, [loaded])

  if(!loaded) return <Loading />
  return (
    <>
      <UserNavbar user={user} />
      <div className="w-screen flex flex-row justify-center ">
        <div className="lg:w-[70vw] w-full lg:mt-4 m-0 lg:px-8 px-4">
          <div className="flex flex-row justify-center">
            <div className="w-full lg:px-8 p-0 lg:mr-8 m-0">
              <div className="flex justify-between">
                <div>
                  <button className="btn btn-primary" onClick={() => navigate(-1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                      <path fill="currentColor" d="m12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2H7.825l5.6 5.6Z" />
                    </svg>
                    <p>Back</p>
                  </button>
                </div>
                <div>
                  {
                    quizResult ? (
                      <Link
                        className="btn btn-success"
                        to="/student/result"
                        state={{ module: module, result: quizResult}}
                      >
                        View Quiz Result
                      </Link>
                    ) : (
                      <Link
                        className="btn btn-success"
                        to="/student/quiz"
                        state={{ module: module }}
                      >
                        Take Quiz
                      </Link>
                    )
                  }
                </div>
              </div>
              <div className="divider"></div>
              <div>
                {
                  module ? (
                    modules.map((item, i) => (
                      <div key={i.toString()}>
                        <h1 className="text-2xl font-bold">{item.title}</h1>
                        <p>{item.content}</p>
                        {
                          item.file_uri ? (
                            <>
                              <label className="label">
                                <span className="label-text">Video</span>
                              </label>
                              <div className="h-96 mt-4">
                                <ReactPlayer
                                  url={`${config.host}/${item.file_uri}`}
                                  width='100%'
                                  height='100%'
                                  controls
                                />
                              </div>
                            </>
                          ) : null
                        }
                      </div>
                    ))
                  ) : null
                }
                {/* <?php
                if (isset($_POST['viewItem'])) {
                  $item = $_POST['viewItem'];

                $moduleData = mysqli_query($conn, 'SELECT * FROM tb_modules WHERE number=' . $item);

                        if (mysqli_num_rows($moduleData) > 0) {
                            while ($row = mysqli_fetch_assoc($moduleData)) {
                  echo '<h1 className="text-2xl font-bold">' . $row['title'] . '</h1>';

                echo $row['content'];
                            }
                        }
                    }
                    ?> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}