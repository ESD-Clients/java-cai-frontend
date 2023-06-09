import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LearnerNavBar from "../../blocks/LearnerNavBar";
import { Helper, ModuleController } from "../../controllers/_Controllers";
import Loading from "../../modals/Loading";
import config from "../../config.json";
import axios from "axios";
import QueryString from "qs";
import { setPlaygroundCode } from "../../controllers/_Helper";
import HDivider from "../../components/HDivider";
import RichText from "../../components/RichText";
import { showConfirmationBox } from "../../modals/Modal";
import { clearModal } from "../../modals/Modal";

export default function Module() {

  const location = useLocation();
  const navigate = useNavigate();

  const user = Helper.getCurrentUser();
  const moduleId = location.search.substring(1);

  const [module, setModule] = useState(null);
  const [topics, setTopics] = useState([]);
  const [questionnaire, setQuestionnaire] = useState(0);

  const [loaded, setLoaded] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    

    window.addEventListener('scroll', () => {

      let btnGoToTop = document.getElementById("btnGoToTop");

      if(btnGoToTop && btnGoToTop.style) {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
          btnGoToTop.style.opacity = 1;
        } else {
          btnGoToTop.style.opacity = 0;
        }
      }
    })
  }, []);

  useEffect(() => {
    if (moduleId === "") navigate("/learner")
    else setLoaded(false);
  }, [moduleId])

  useEffect(() => {
    async function fetchData() {
      let module = await ModuleController.get(moduleId);
      setModule(module);

      let topics = await ModuleController.getTopics(moduleId);
      setTopics(topics);

      let quizResult = await ModuleController.getQuizResult(moduleId, user.id);
      setQuizResult(quizResult);

      let questionnaire = await ModuleController.getQuestions(moduleId);
      setQuestionnaire(questionnaire.length);

      setLoaded(true);
    }

    if (!loaded) fetchData();
  }, [loaded])


  function scrollTo (id) {
    document.getElementById(id).scrollIntoView({
      behavior: "smooth"
    });
  }

  function takeQuiz () {
    showConfirmationBox({
      title: "Confirmation",
      message: "Did you read this module clearly?",
      type: "warning",
      onYes: () => {
        navigate("/learner/quiz", {
          state: {
            module: module
          }
        })
        clearModal();
      }
    })
  }

  if (!loaded) return <Loading />
  return (
    <>
      <button
        className="fixed flex drop-shadow opacity-0 transition-all z-50 bottom-10 right-10 bg-primary text-white h-12 w-12 rounded-full justify-center items-center"
        id="btnGoToTop"
        onClick={() => scrollTo("top")}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current" width={24} height={24} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
      </button>
      <div className="flex flex-row flex-1 justify-center">
        <div className="w-full h-full lg:px-8 p-0 lg:mr-8 m-0">
          <div className="flex justify-between ">
            <div>
              {/* <button className="btn btn-ghost" onClick={() => navigate(-1)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                  <path fill="currentColor" d="m12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2H7.825l5.6 5.6Z" />
                </svg>
                <p>Back</p>
              </button> */}
            </div>
            <div>
              {/* <Link
                className="btn btn-success"
                to="/learner/quiz"
                state={{ module: module }}
              >
                {
                  quizResult ? "View Quiz" : "Take Quiz"
                }
              </Link> */}
              {
                quizResult ? (
                  <Link
                    className="btn btn-success"
                    to="/learner/quiz"
                    state={{ module: module }}
                  >
                    View Quiz
                  </Link> 
                ) : (
                  <button
                    className="btn btn-success"
                    onClick={takeQuiz}
                    disabled={questionnaire === 0}
                    // to="/learner/quiz"
                    // state={{ module: module }}
                  >
                    Take Quiz
                  </button> 
                )
              }
            </div>
          </div>

          <HDivider />
          

          {/* Content */}
          <div className="flex h-full">

            {/* TOPICS NAVIGATION */}
            <div className="">
            <div className="w-[12rem] sticky overflow-y-auto h-[80vh] right-0 top-28 scrollbar-thin scrollbar-thumb-base-100 pr-2">
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
            </div>
            <div className="divider divider-horizontal ml-0" />
            <div className="pb-16 w-full">
              {
                moduleId && module && (
                  <div className="w-full">
                    <h1 className="text-4xl uppercase font-bold">{module.title}</h1>
                    
                    <HDivider id="sypnosis"/>
                    <RichText
                      value={module.sypnosis}
                    />
                    {/* <p 
                      className="pt-20"
                    >
                      {module.sypnosis}
                    </p> */}

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
                            <RichText
                              value={item.data().content}
                            />
                            {/* <p className="mt-4 whitespace-pre-line">
                              {item.data().content}
                            </p> */}
                          </div>

                          {/* Media */}
                          {
                            item.data().media && (
                              item.data().media.type === "image" ? (
                                <img
                                  src={item.data().media.url}
                                  className="max-h-[20rem] max-w-[80rem] my-4"
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
                                    to="/learner/playground"
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