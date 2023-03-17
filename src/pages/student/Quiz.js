import { useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QuizItem from "../../components/QuizItem";
import UserNavbar from "../../components/UserNavBar";
import { Helper, ModuleController } from "../../controllers/_Controllers";
import { clearModal, showLoading, showMessageBox } from "../../modals/Modal";

export default function Quiz() {

  const user = Helper.getCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();
  const module = location.state.module;

  const [loaded, setLoaded] = useState(false);
  const [questions, setQuestions] = useState([]);

  const [tabIndex, setTabIndex] = useState(0);

  const [multiChoices, setMultiChoices] = useState([]);
  const [fillBlanks, setFillBlanks] = useState([]);
  const [codings, setCodings] = useState([]);

  const [answers, setAnswers] = useState({
    multi_choices: {},
    fill_blank: {},
    coding: {}
  });

  const [quizResult, setQuizResult] = useState();



  useEffect(() => {
    async function fetchData() {

      let quizResult = await ModuleController.getQuizResult({
        student: user.id,
        module: module
      });

      if(quizResult) {
        navigate("/student");
        return;
      }

      let multiChoices = await ModuleController.getQuestions({ module: module, type: "multi_choices" });
      setMultiChoices(multiChoices);

      let fillBlanks = await ModuleController.getQuestions({ module: module, type: "fill_blank" });
      setFillBlanks(fillBlanks);

      let codings = await ModuleController.getQuestions({ module: module, type: "coding" });
      setCodings(codings);

      setLoaded(true);
    }

    if (!loaded) fetchData();
  }, [loaded])

  function selectTab (e, i) {
    e.preventDefault();
    setTabIndex(i);
  }

  async function checkAnswers (answers) {

    
    showLoading({
      message: "Submitting Answer..."
    })

    let score = 0;
    // let total = 0;
    let studMultiChoices = [], studFillBlank = [], studCoding = [];

    for(let question of multiChoices) {

      let studentAnswer = question;
      studentAnswer.student_answer = answers.multi_choices[question.id];
      studentAnswer.remarks = 0;

      //Check answer
      if(question.answer === answers.multi_choices[question.id]) {
        score++;
        studentAnswer.remarks = 1;
      }

      studMultiChoices.push(studentAnswer);
    }

    for(let question of fillBlanks) {
      
      let studentAnswer = question;
      studentAnswer.student_answer = answers.fill_blank[question.id];
      studentAnswer.remarks = 0;

      //Check answer
      if(question.answer === answers.fill_blank[question.id]) {
        score++;
        studentAnswer.remarks = 1;
      }

      studFillBlank.push(studentAnswer);
    }

    for(let question of codings) {
      
      let studentAnswer = question;
      studentAnswer.student_answer = answers.coding[question.id];
      studentAnswer.remarks = 0;

      //Check answer
      if(question.answer === answers.coding[question.id]) {
        score++;
        studentAnswer.remarks = 1;
      }

      studCoding.push(studentAnswer);
    }

    let studentAnswer = {
      multi_choices: studMultiChoices,
      fill_blank: studFillBlank,
      coding: studCoding
    }

    console.log("ALL ANSWER", studentAnswer);


    // Submit Answers

    let result = await ModuleController.addQuizResult({
      params: {
        student: user.id,
        module: module,
        score: score,
        total: 0,
        answers: JSON.stringify(studentAnswer)
      }
    });

    clearModal();

    console.log(result);
    
    if (result && result.user) {
      showMessageBox({
        title: "Success",
        message: "Success",
        type: "success",
        onPress: () => {
          let newUser = result.user;
          newUser.type = "student";
          Helper.setCurrentUser(newUser);
          navigate("/student/result", {state: {result: result.result}});
        }
      })
    }
    else {
      showMessageBox({
        title: "Error",
        message: "Something went wrong",
        type: "danger",
        onPress: () => {}
      });
    }
  }

  return (
    <>
      <UserNavbar user={user} />

      <div className="w-screen flex flex-row justify-center ">
        <div className="lg:w-[70vw] w-full lg:mt-4 m-0 lg:px-8 px-4">
          <div className="flex flex-row justify-center">
            <div className="w-full lg:px-8 p-0 lg:mr-8 m-0">
              <div>

                <div className="flex flex-col gap-2 mb-4">

                  {
                    module ? (
                      <>
                        <form 
                          className={tabIndex === 0 ? "" : "hidden"} 
                          onSubmit={(e) => {
                            e.preventDefault();

                            let values = Helper.getEventFormData(e);
                            let currentAnswers = answers;

                            currentAnswers.multi_choices = values;

                            setAnswers(currentAnswers);
                            selectTab(e, 1);
                          }}
                        >
                          <div className="font-bold text-xl mb-4">
                            I. Multiple Choice
                          </div>
                          {

                            multiChoices.map((item, i) => (
                              <QuizItem key={i.toString()} item={item} index={i} />
                            ))
                          }
                          <div className="flex justify-end">
                            <button className="btn btn-primary" type="submit">
                              NEXT PAGE
                            </button>
                          </div>
                        </form>

                        <form 
                          className={tabIndex === 1 ? "" : "hidden"}
                          onSubmit={(e) => {
                            e.preventDefault();

                            let values = Helper.getEventFormData(e);
                            let currentAnswers = answers;

                            currentAnswers.fill_blank = values;
                            setAnswers(currentAnswers);
                            selectTab(e, 2);
                          }}
                        >
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
                            <button className="btn btn-primary" type="submit">NEXT PAGE</button>
                          </div>
                        </form>

                        <form 
                          className={tabIndex === 2 ? "" : "hidden"}
                          onSubmit={(e) => {
                            e.preventDefault();

                            let values = Helper.getEventFormData(e);
                            let currentAnswers = answers;

                            currentAnswers.coding = values;

                            setAnswers(currentAnswers);
                            checkAnswers(currentAnswers);
                          }}
                        >
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
                            <button className="btn btn-success" type="submit">SUBMIT</button>
                          </div>
                        </form>
                      </>
                    ) : null
                  }
                  {/* <?php
                  if (isset($_POST['viewItem'])) {
                    $quiz = $_POST['viewItem'];
                  $index = 1;

                  $multipleChoiceData = mysqli_query($conn, 'SELECT * FROM tb_multiple_choice WHERE module=' . $quiz);
                  $codeQuestionData = mysqli_query($conn, 'SELECT * FROM tb_codequestion WHERE module=' . $quiz);
                  $fillBlanksData = mysqli_query($conn, 'SELECT * FROM tb_fitb WHERE module=' . $quiz);

                            if (mysqli_num_rows($multipleChoiceData) > 0) {
                                while ($row = mysqli_fetch_assoc($multipleChoiceData)) {
                    echo '<div className="p-2">
                    <div>' . $index . '. ' . $row['question'] . '</div>
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">' . $row['choice_1'] . '</span>
                        <input type="radio" name="radio-10" className="radio checked:bg-red-500" />
                      </label>
                    </div>
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">' . $row['choice_2'] . '</span>
                        <input type="radio" name="radio-10" className="radio checked:bg-red-500" />
                      </label>
                    </div>
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">' . $row['choice_3'] . '</span>
                        <input type="radio" name="radio-10" className="radio checked:bg-red-500" />
                      </label>
                    </div>
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">' . $row['choice_4'] . '</span>
                        <input type="radio" name="radio-10" className="radio checked:bg-red-500" />
                      </label>
                    </div>
                  </div><div className="divider"></div>';
                  $index++;
                                }
                            } else {
                    echo 'No Data';
                            }

                            if (mysqli_num_rows($codeQuestionData) > 0) {
                                while ($row = mysqli_fetch_assoc($codeQuestionData)) {
                    echo '<div className="p-2">
                    <div className="mb-1">' . $index . '. ' . $row['question'] . '</div>
                    <input type="text" placeholder="Answer" className="input input-bordered w-full max-w-xs" />
                  </div><div className="divider"></div>';
                  $index++;
                                }
                            }

                            if (mysqli_num_rows($fillBlanksData) > 0) {
                                while ($row = mysqli_fetch_assoc($fillBlanksData)) {
                    echo '<div className="p-2">
                    <div className="mb-1">' . $index . '. ' . $row['question'] . '</div>
                    <input type="text" placeholder="Answer" className="input input-bordered w-full max-w-xs" />
                  </div><div className="divider"></div>';
                  $index++;
                                }
                            }
                        }
                        ?> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}