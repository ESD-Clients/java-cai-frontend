import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UserNavbar from "../../components/UserNavBar";
import { Helper, ModuleController } from "../../controllers/_Controllers";
import Loading from "../../modals/Loading";
import config from "../../config.json";
import axios from "axios";
import QueryString from "qs";
import { setPlaygroundCode } from "../../controllers/_Helper";

export default function Module() {
  const location = useLocation();
  const navigate = useNavigate();

  const user = Helper.getCurrentUser();
  const currentModule = location.search.substring(1);

  const [compiling, setCompiling] = useState(false);
  const [output, setOutput] = useState('');

  const [loaded, setLoaded] = useState(false);
  const [module, setModule] = useState(null);
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    if (currentModule === "") navigate("/student")
  }, [currentModule])

  useEffect(() => {
    async function fetchData() {
      let modules = await ModuleController.getModulesByNumber(currentModule);
      setModule(modules[0]);

      let quizResult = await ModuleController.getQuizResult({
        student: user.id,
        module: currentModule
      });
      setQuizResult(quizResult);
      console.log("Quiz", quizResult);

      if(modules[0].sample_code) {
        await compile(modules[0].sample_code)
      }

      setLoaded(true);
    }

    if (!loaded) fetchData();
  }, [loaded])

  async function compile(code) {

    console.log("Compiling")

    setCompiling(true);
    let data = QueryString.stringify({
      'code': code,
      'language': 'java',
      'input': ''
    });

    let config = {
      method: 'post',
      url: 'https://api.codex.jaagrav.in',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    };

    await axios(config)
      .then(function (response) {
        setOutput(response.data.output);
      })

    setCompiling(false);
  }


  if (!loaded) return <Loading />
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
                        state={{ module: currentModule, result: quizResult }}
                      >
                        View Quiz Result
                      </Link>
                    ) : (
                      <Link
                        className="btn btn-success"
                        to="/student/quiz"
                        state={{ module: currentModule }}
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
                  currentModule && module ? (
                    <div>
                      <h1 className="text-2xl font-bold">{module.title}</h1>
                      <p>{module.content}</p>
                      {
                        module.file_uri ? (
                          <>
                            <label className="label">
                              <span className="label-text">Video</span>
                            </label>
                            <div className="h-96 mt-4">
                              <ReactPlayer
                                url={`${config.host}/${module.file_uri}`}
                                width='100%'
                                height='100%'
                                controls
                              />
                            </div>
                          </>
                        ) : null
                      }
                      <div className="w-full mt-4">

                        <div className="flex">
                          <div className="flex-1">
                            <label className="label">Example:</label>
                            <p className="textarea whitespace-pre-line font-mono">{module.sample_code}</p>
                          </div>
                          <div className="ml-4">
                            <div className="flex justify-between">
                              <label className="label">Output:</label>
                              <div>
                                {
                                  compiling ? (
                                    <div className="mr-4">
                                      <span className="loader"></span>
                                    </div>
                                  ) : null
                                }
                              </div>
                            </div>
                            <div className="w-[20rem]">
                              <p className="textarea w-full h-full font-mono whitespace-pre-line">
                                {output}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end mt-4 ">
                          <Link 
                            className="btn btn-info" 
                            to="/student/playground" 
                            target="_blank"
                            onClick={() => {
                              setPlaygroundCode(module.sample_code)
                            }}
                          >
                              Try it Out
                          </Link>
                        </div>
                      </div>
                    </div>
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