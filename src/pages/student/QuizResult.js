import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QuizItem from "../../components/QuizItem";
import UserNavbar from "../../components/UserNavBar";
import { Helper } from "../../controllers/_Controllers";

export default function QuizResult() {

  const user = Helper.getCurrentUser();
  const location = useLocation();
  const navigate = useNavigate();

  const result = location.state.result;

  const questions = JSON.parse(result.answers);

  const multiChoices = questions.multi_choices;
  const fillBlanks = questions.fill_blank;
  const codings = questions.coding;

  const [loaded, setLoaded] = useState(false);

  const [tabIndex, setTabIndex] = useState(0);



  function selectTab (e, i) {
    e.preventDefault();
    setTabIndex(i);
  }

  return (
    <>
      <UserNavbar user={user} />

      <div className="w-screen flex flex-row justify-center ">
        <div className="lg:w-[70vw] w-full lg:mt-4 m-0 lg:px-8 px-4">
          <div className="flex flex-row justify-center">
            <div className="w-full lg:px-8 p-0 lg:mr-8 m-0">
              <div>
                <div className="flex justify-between mb-4">
                  <button className="btn btn-primary" onClick={() => navigate(-1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                      <path fill="currentColor" d="m12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2H7.825l5.6 5.6Z" />
                    </svg>
                    <p>Back</p>
                  </button>

                  <div className="text-lg">
                    <span className="mr-2">Score: </span>
                    {/* <span className="font-bold">{result.score} / {result.total}</span> */}
                    <span className="font-bold">{result.score}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 mb-4">

                  {
                    result ? (
                      <>
                        <div className={tabIndex === 0 ? "" : "hidden"} >
                          <div className="font-bold text-xl mb-4">
                            I. Multiple Choice
                          </div>
                          {

                            multiChoices.map((item, i) => (
                              <QuizItem key={i.toString()} item={item} index={i}/>
                            ))
                          }
                          <div className="flex justify-end">
                            <a className="btn btn-primary" onClick={(e) => selectTab(e, 1)}>NEXT PAGE</a>
                          </div>
                        </div>

                        <div className={tabIndex === 1 ? "" : "hidden"}>
                          <div className="font-bold mb-4 text-xl">
                            II. Fill in the Blank
                          </div>
                          {
                            fillBlanks.map((item, i) => (
                              <QuizItem key={i.toString()} item={item} index={i} />
                            ))
                          }
                          <div className="flex justify-between">
                            <a className="btn btn-primary" onClick={(e) => selectTab(e, 0)}>PREVIOUS PAGE</a>
                            <a className="btn btn-primary" onClick={(e) => selectTab(e, 2)}>NEXT PAGE</a>
                          </div>
                        </div>

                        <div className={tabIndex === 2 ? "" : "hidden"}>
                          <div className="font-bold mb-4 text-xl">
                            III. Coding
                          </div>
                          {
                            codings.map((item, i) => (
                              <QuizItem key={i.toString()} item={item} index={i} />
                            ))
                          }
                          <div className="flex justify-between">
                            <a className="btn btn-primary" onClick={(e) => selectTab(e, 1)}>PREVIOUS PAGE</a>
                            {/* <button className="btn btn-success" type="submit">SUBMIT</button> */}
                          </div>
                        </div>
                      </>
                    ) : null
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}