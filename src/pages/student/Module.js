import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Link, useLocation, useNavigate } from "react-router-dom";
import StudentNavBar from "../../components/StudentNavBar";
import { Helper, ModuleController } from "../../controllers/_Controllers";
import Loading from "../../modals/Loading";
import config from "../../config.json";
import axios from "axios";
import QueryString from "qs";
import { setPlaygroundCode } from "../../controllers/_Helper";
import HDivider from "../../components/HDivider";

export default function Module() {
  const location = useLocation();
  const navigate = useNavigate();

  const user = Helper.getCurrentUser();
  const moduleId = location.search.substring(1);

  const [module, setModule] = useState(null);
  const [topics, setTopics] = useState([]);

  const [compiling, setCompiling] = useState(false);
  const [output, setOutput] = useState('');

  const [loaded, setLoaded] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    

    window.addEventListener('scroll', () => {

      let btnGoToTop = document.getElementById("btnGoToTop");

      if(btnGoToTop.style) {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
          btnGoToTop.style.display = "flex";
        } else {
          btnGoToTop.style.display = "none";
        }
      }
    })
  }, []);

  useEffect(() => {
    if (moduleId === "") navigate("/student")
    else setLoaded(false);
  }, [moduleId])

  useEffect(() => {
    async function fetchData() {
      let module = await ModuleController.get(moduleId);
      setModule(module);

      let topics = await ModuleController.getTopics(moduleId);
      console.log("Topics", topics)
      setTopics(topics);

      // let quizResult = await ModuleController.getQuizResult({
      //   student: user.id,
      //   module: moduleId
      // });
      // setQuizResult(quizResult);
      // console.log("Quiz", quizResult);

      // if(module[0].sample_code) {
      //   await compile(module[0].sample_code)
      // }

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

  function scrollTo (id) {
    console.log(id);
    document.getElementById(id).scrollIntoView({
      behavior: "smooth"
    });
  }


  if (!loaded) return <Loading />
  return (
    <>
      <button
        className="fixed hidden z-50 bottom-10 right-10 bg-base-100 h-12 w-12 rounded-full justify-center items-center"
        id="btnGoToTop"
        onClick={() => scrollTo("top")}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current" width={24} height={24} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
      </button>
      <div className="flex flex-row flex-1 justify-center">
        <div className="w-full h-full lg:px-8 p-0 lg:mr-8 m-0">
          <div className="flex justify-between ">
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
                    state={{ module: moduleId, result: quizResult }}
                  >
                    View Quiz Result
                  </Link>
                ) : (
                  null
                  // <Link
                  //   className="btn btn-success"
                  //   to="/"
                  //   state={{ module: moduleId }}
                    
                  // >
                  //   Take Quiz
                  // </Link>
                )
              }
            </div>
          </div>

          <HDivider />
          

          {/* Content */}
          <div className="flex h-full">

            {/* TOPICS NAVIGATION */}
            <div className="w-[44rem] sticky h-full right-0 top-52">
              <h1 className="text-sm uppercase mb-4 font-semibold mt-2">Topics</h1>
              <ul className="w-full">
                <li
                  className="w-full px-4 py-4 cursor-pointer rounded text-sm font-bold hover:bg-base-100"
                  onClick={() => scrollTo("sypnosis")}
                >
                  Sypnosis
                </li>
                {
                  topics.map((item, index) => (
                    <li
                      className="w-full px-4 py-4 cursor-pointer rounded text-sm font-bold hover:bg-base-100"
                      key={index.toString()}
                      onClick={() => scrollTo(item.id)}
                    >
                      {
                        item.data().title
                      }
                    </li>
                  ))
                }
              </ul>
            </div>
            <div className="divider divider-horizontal" />
            <div className="pb-16">
              {
                moduleId && module && (
                  <div>
                    <h1 className="text-4xl uppercase font-bold">{module.title}</h1>
                    
                    <HDivider id="sypnosis"/>
                    <p 
                      className="pt-20"
                    >
                      {module.sypnosis}
                    </p>

                    {/* TOPICS */}

                    {
                      topics.map((item, i) => (
                        
                        <div
                          key={i.toString()}
                          className="mt-8"
                        >
                          <HDivider id={item.id}/>
                          
                          <div className="pt-20">
                            <h4 className="text-2xl font-bold">
                              {item.data().title}
                            </h4>
                            <p className="mt-4">
                              {item.data().content}
                            </p>
                          </div>

                          {/* Media */}
                          {
                            item.data().media && (
                              item.data().media.type === "image" ? (
                                <img
                                  src={item.data().media.url}
                                  className="w-full my-4"
                                />
                              ) : (
                                <div className="mt-4">
                                  {/* <label className="label label-text font-semibold">
                                    Demo
                                  </label> */}
                                  <div className="h-96 border border-base-300 ">
                                    <ReactPlayer
                                      url={item.data().media.url}
                                      width='100%'
                                      height='100%'
                                      controls
                                    />
                                  </div>
                                </div>
                              )
                            )
                          }

                          {/* Code */}
                          {
                            item.data().code && (
                              <div className="mt-8">
                                <label className="label label-text font-semibold mb-2">
                                  Example Code:
                                </label>
                                <p className="textarea font-mono whitespace-pre-wrap">
                                  {item.data().code}
                                </p>
                                <div className="flex justify-end mt-2">
                                  <Link
                                    className="btn btn-info"
                                    to="/student/playground"
                                    target="_blank"
                                    onClick={() => {
                                      setPlaygroundCode(item.data().code)
                                    }}
                                  >
                                    Try it Out
                                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 stroke-current" width={16} height={16} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M12 5l7 7-7 7"/></svg>
                                  </Link>
                                </div>
                              </div>
                            )
                          }
                        </div>
                      ))
                    }
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}