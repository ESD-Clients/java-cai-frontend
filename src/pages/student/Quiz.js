import { useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QuizItem from "../../components/QuizItem";
import StudentNavBar from "../../components/StudentNavBar";
import { Helper, ModuleController } from "../../controllers/_Controllers";
import { clearModal, showLoading, showMessageBox } from "../../modals/Modal";

export default function Quiz() {
  const user = Helper.getCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();
  const moduleId = location.state.moduleId;

  const [loaded, setLoaded] = useState(false);

  const [tabIndex, setTabIndex] = useState(0);

  const [multiChoices, setMultiChoices] = useState([]);
  const [fillBlanks, setFillBlanks] = useState([]);
  const [codings, setCodings] = useState([]);

  const [answers, setAnswers] = useState({
    multi_choices: {},
    fill_blank: {},
    coding: {},
  });

  const [quizResult, setQuizResult] = useState();

  useEffect(() => {
    if (!moduleId) {
      navigate("/");
    }
  }, [moduleId]);

  useEffect(() => {
    async function fetchData() {

      let questions = await ModuleController.getQuestions(moduleId);

      console.log("QUESTIONS", questions);

      let multi = [];
      let blank = [];
      let coding = [];

      for(let doc of questions) {
        if(doc.data().type === "choices") {
          multi.push(doc);
        }
        else if(doc.data().type === "blank") {
          blank.push(doc);
        }
        else {
          coding.push(doc);
        }
      }

      setMultiChoices(multi);
      setFillBlanks(blank);
      setCodings(coding);

      console.log(blank)

      setLoaded(true);
    }

    if (!loaded) fetchData();
  }, [loaded]);

  function selectTab(e, i) {
    e.preventDefault();
    setTabIndex(i);
  }

  async function checkAnswers(answers) {
    // showLoading({
    //   message: "Submitting Answer...",
    // });

    let score = 0;
    // let total = 0;
    let studMultiChoices = [],
      studFillBlank = [],
      studCoding = [];

    for (let question of multiChoices) {
      let studentAnswer = {
        correctAnswer: question.data().answer,
        questionId: question.id,
        question: question.data().question,
        type: question.data().type,
      }
      
      studentAnswer.student_answer = answers.multi_choices[question.id];
      studentAnswer.remarks = 0;

      //Check answer
      if (question.data().answer === answers.multi_choices[question.id]) {
        score++;
        studentAnswer.remarks = 1;
      }

      studMultiChoices.push(studentAnswer);
    }

    for (let question of fillBlanks) {
      let studentAnswer = {
        correctAnswer: question.data().answer,
        questionId: question.id,
        question: question.data().question,
        type: question.data().type,
      }

      studentAnswer.student_answer = answers.fill_blank[question.id];
      studentAnswer.remarks = 0;

      //Check answer
      if (question.data().answer === answers.fill_blank[question.id]) {
        score++;
        studentAnswer.remarks = 1;
      }

      studFillBlank.push(studentAnswer);
    }

    for (let question of codings) {
      let studentAnswer = {
        correctAnswer: question.data().answer,
        questionId: question.id,
        question: question.data().question,
        type: question.data().type,
      }

      studentAnswer.student_answer = answers.coding[question.id];
      studentAnswer.remarks = 0;

      //Check answer
      if (question.data().answer === answers.coding[question.id]) {
        score++;
        studentAnswer.remarks = 1;
      }

      studCoding.push(studentAnswer);
    }

    let studentAnswer = {
      multi_choices: studMultiChoices,
      fill_blank: studFillBlank,
      coding: studCoding,
    };

    console.log("ALL ANSWER", studentAnswer);

    return;
    // Submit Answers

    let result = await ModuleController.addQuizResult({
      params: {
        student: user.id,
        module: moduleId,
        score: score,
        total: 0,
        answers: JSON.stringify(studentAnswer),
      },
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
          navigate("/student/result", { state: { result: result.result } });
        },
      });
    } else {
      showMessageBox({
        title: "Error",
        message: "Something went wrong",
        type: "danger",
        onPress: () => {},
      });
    }
  }

  return (
    <>
      <div className="fixed top-0 left-0 bg-base-100 w-full h-20 flex items-center justify-center">
        Timer Goes Here
      </div>
      <div className="flex flex-row justify-center">
        <div className="w-full max-w-[48rem] lg:px-8 p-0 lg:mr-8 m-0">
          <div>
            <div className="flex flex-col gap-2 mb-4">
              {moduleId ? (
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
                    {multiChoices.map((item, i) => (
                      <QuizItem 
                        key={i.toString()} item={{
                          ...item.data(),
                          id: item.id
                        }} 
                        index={i} 
                      />
                    ))}
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
                    {fillBlanks.map((item, i) => (
                      <QuizItem 
                        key={i.toString()} item={{
                          ...item.data(),
                          id: item.id
                        }} 
                        index={i} 
                      />
                    ))}
                    <div className="flex justify-between">
                      <a
                        className="btn btn-primary"
                        onClick={(e) => selectTab(e, 0)}
                      >
                        PREVIOUS PAGE
                      </a>
                      <button className="btn btn-primary" type="submit">
                        NEXT PAGE
                      </button>
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
                    <div className="font-bold mb-4 text-xl">III. Coding</div>
                    {codings.map((item, i) => (
                      <QuizItem 
                        key={i.toString()} item={{
                          ...item.data(),
                          id: item.id
                        }} 
                        index={i} 
                      />
                    ))}
                    <div className="flex justify-between">
                      <a
                        className="btn btn-primary"
                        onClick={(e) => selectTab(e, 1)}
                      >
                        PREVIOUS PAGE
                      </a>
                      <button className="btn btn-success" type="submit">
                        SUBMIT
                      </button>
                    </div>
                  </form>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
