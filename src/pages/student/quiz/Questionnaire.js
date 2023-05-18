import { useEffect } from "react";
import { useState } from "react";
import { Helper, ModuleController, StudentController } from "../../../controllers/_Controllers";
import { getDocData } from "../../../controllers/_Helper";
import { clearModal, showLoading, showMessageBox } from "../../../modals/Modal";
import MutlipleChoice from "./MutlipleChoice";
import FillBlank from "./FillBlank";
import Coding from "./Coding";
import Tracing from "./Tracing";
import Timer from "../../../components/Timer";

export default function Questionnaire({ user, module, setResult }) {

  const [tabIndex, setTabIndex] = useState(0);
  const [codingIndex, setCodingIndex] = useState(0);

  const [questions, setQuestions] = useState([]);
  const [codings, setCodings] = useState([]);

  useEffect(() => {
    async function fetchData() {

      let results = await ModuleController.getQuestionsSortedByDifficulties(module.id);

      let question = [];
      let coding = [];

      for (let doc of results) {
        
        let data = getDocData(doc);
        if (data.type === "coding") {
          coding.push(data);
        }
        else {
          if(data.type === "choices") {
            let choices = data.choices;
            let shuffled = shuffleChoices(choices);
            data.choices = shuffled;
            
          }
          question.push(data);
        }
      }

      // setMultiChoices(multi);
      // setFillBlanks(blank);
      setQuestions(question);
      setCodings(coding);
    }

    fetchData();

  }, [module]);

  function shuffleChoices(array) {
    const now = new Date();
    const seed = now.getTime();
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random(seed) * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }  

  function selectTab(e, i) {
    e.preventDefault();
    setTabIndex(i);
  }

  function checkEntries(entries, questions) {

    let answers = [];
    let studentScore = 0;
    let totalScore = 0;

    for (let question of questions) {
      let studentAnswer = {
        ...question,
        questionId: question.id,
        correctAnswer: question.answer,
      }

      delete studentAnswer.answer;
      delete studentAnswer.createdAt;

      studentAnswer.studentAnswer = entries[question.id];

      //Check answer
      if (question.type === "coding") {
        studentAnswer.remarks = -1;
      }
      else {
        if (question.answer === entries[question.id]) {
          studentScore += studentAnswer.points;
          studentAnswer.remarks = 1;
        }
        else {
          studentAnswer.remarks = 0;
        }
      }

      totalScore += studentAnswer.points;
      answers.push(studentAnswer);
    }

    return { answers, studentScore, totalScore };
  }

  async function checkAnswers(e) {

    e && e.preventDefault && e.preventDefault();

    showLoading({
      message: "Submitting..."
    });

    let formMix = document.getElementById('form_mix');
    let formCoding = document.getElementById('form_coding');


    let entries_mix = getFormEntries(formMix);
    let entries_coding = getFormEntries(formCoding);

    let data_choices = {
      answers: [],
      studentScore: 0,
      totalScore: 0
    };
    let data_blanks = {
      answers: [],
      studentScore: 0,
      totalScore: 0
    };
    let data_tracing = {
      answers: [],
      studentScore: 0,
      totalScore: 0
    };
    

    let data_mix = checkEntries(entries_mix, questions);
    let data_coding = checkEntries(entries_coding, codings);

    for(let item of data_mix.answers) {
      if(item.type === "choices") {
        data_choices.answers.push(item);
        data_choices.totalScore += item.points;
        if(item.remarks === 0) {
          data_choices.studentScore += item.points;
        }
      }
      else if(item.type === "blank") {
        data_blanks.answers.push(item);
        data_blanks.totalScore += item.points;
        if(item.remarks === 0) {
          data_blanks.studentScore += item.points;
        }
      }
      else if(item.type === "tracing") {
        data_tracing.answers.push(item);
        data_tracing.totalScore += item.points;
        if(item.remarks === 0) {
          data_tracing.studentScore += item.points;
        }
      }
    }

    let studentScore = data_mix.studentScore + data_coding.studentScore;
    let totalScore = data_mix.totalScore + data_coding.totalScore;

    let answers = {
      studentId: user.id,
      multipleChoice: data_choices,
      fillBlank: data_blanks,
      outputTracing: data_tracing,
      coding: {
        ...data_coding,
        status: 0,
      },
      studentScore: studentScore,
      totalScore: totalScore,
    }

    // console.log(answers);
    clearModal();

    let result = await ModuleController.submitQuizAnswer(module.id, answers);

    clearModal();

    if (result && result.id) {

      showLoading({
        message: "Updating progress..."
      });

      let finishedModules = user.finishedModules;
      finishedModules.push(module.id);

      await StudentController.update(user.id, {
        finishedModules: finishedModules
      });

      let updateUser = user;
      user.finishedModules = finishedModules;

      Helper.setCurrentUser(updateUser);

      clearModal();

      setResult(result);

      showMessageBox({
        title: "Success",
        message: "Success",
        type: "success",
      });
    }
    else {
      showMessageBox({
        title: "Error",
        message: "Something went wrong",
        type: "danger"
      });
    }
  }

  function getFormEntries(form) {
    let formData = new FormData(form);
    let formEntries = Object.fromEntries(formData.entries());

    return formEntries;
  }

  function timerTimeout () {
    showMessageBox({
      title: "Time's up",
      message: "Sorry your out of time.",
      type: "warning",
      onPress: checkAnswers
    });
  }

  return (
    <>
      <div className="fixed drop-shadow top-0 left-0 bg-base-100 w-full h-20 flex items-center justify-center z-50">
        <div>
          <h1 className="text-center">Quiz Timer:</h1>
          <Timer
            className="text-4xl font-bold text-primary"
            minutes={module ? module.examTime : 90}
            onTimeout={timerTimeout}
          />
        </div>
      </div>
      <div className="flex flex-row justify-center">
        <div className="w-full max-w-[48rem] lg:px-8 p-0 lg:mr-8 m-0">
          <div>
            <div className="flex flex-col gap-2 mb-4">
              <form
                id="form_mix"
                className={tabIndex === 0 ? "" : "hidden"}
                onSubmit={(e) => codings.length > 0 ? selectTab(e, 1) : checkAnswers(e)}
              >
                <div className="font-bold text-xl mb-4">
                  {codings.length > 0 ? "I. " : ""} Questionnaires
                </div>
                {questions.map((item, i) =>
                  item.type === "choices" ? (
                    <MutlipleChoice
                      key={i.toString()}
                      item={item}
                      questionNo={i + 1}
                    />
                  ) :
                  item.type === "blank" ? (
                    <FillBlank
                      key={i.toString()}
                      item={item}
                      questionNo={i + 1}
                    />
                  ) :
                  item.type === "tracing" ? (
                    <Tracing
                      key={i.toString()}
                      item={item}
                      questionNo={i + 1}
                    />
                  ) : null
                )}
                <div className="flex justify-end">
                  <button className="btn btn-primary" type="submit">
                    {codings.length > 0 ? "NEXT PAGE" : "SUBMIT"}
                  </button>
                </div>
              </form>

              {/* Coding */}
              <form
                id="form_coding"
                className={tabIndex === 1 ? "" : "hidden"}
                onSubmit={checkAnswers}
              >
                <div className="font-bold mb-4 text-xl">II. Coding</div>
                {codings.map((item, i) => (
                  <div key={i.toString()} className={i !== codingIndex ? "hidden" : ""}>
                    <Coding
                      item={item}
                      questionNo={i + 1}
                    />
                    <div className="flex justify-between">
                      {
                        codingIndex === 0 ? (
                          <div
                            className="btn btn-primary"
                            onClick={(e) => selectTab(e, 0)}
                          >
                            PREVIOUS PAGE
                          </div>
                        ) : (
                          <div
                            className="btn btn-primary"
                            onClick={(e) => setCodingIndex(i - 1)}
                          >
                            PREVIOUS
                          </div>
                        )
                      }
                      {
                        codingIndex === codings.length - 1 ? (
                          <button className="btn btn-success" type="submit">
                            SUBMIT
                          </button>
                        ) : (
                          <div
                            className="btn btn-success"
                            onClick={() => setCodingIndex(i + 1)}
                          >
                            NEXT
                          </div>
                        )
                      }
                    </div>
                  </div>

                ))}

              </form>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
