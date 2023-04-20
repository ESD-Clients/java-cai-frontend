import { useEffect } from "react";
import { useState } from "react";
import { Helper, ModuleController, StudentController } from "../../../controllers/_Controllers";
import { getDocData } from "../../../controllers/_Helper";
import { clearModal, showLoading, showMessageBox } from "../../../modals/Modal";
import MutlipleChoice from "./MutlipleChoice";
import FillBlank from "./FillBlank";
import Coding from "./Coding";

export default function Questionnaire({ user, module, setResult }) {

  const [tabIndex, setTabIndex] = useState(0);

  const [multiChoices, setMultiChoices] = useState([]);
  const [fillBlanks, setFillBlanks] = useState([]);
  const [codings, setCodings] = useState([]);

  useEffect(() => {
    async function fetchData() {

      let questions = await ModuleController.getQuestions(module.id);

      let multi = [];
      let blank = [];
      let coding = [];

      for (let doc of questions) {
        if (doc.data().type === "choices") {
          multi.push(doc);
        }
        else if (doc.data().type === "blank") {
          blank.push(doc);
        }
        else {
          coding.push(doc);
        }
      }

      setMultiChoices(multi);
      setFillBlanks(blank);
      setCodings(coding);
    }

    fetchData();

  }, [module]);

  function selectTab(e, i) {
    e.preventDefault();
    setTabIndex(i);
  }

  function getQuestionData(entries, questions) {

    let answers = [];
    let studentScore = 0;
    let totalScore = 0;

    for (let question of questions) {
      let studentAnswer = {
        ...question.data(),
        questionId: question.id,
        correctAnswer: question.data().answer,
      }

      delete studentAnswer.answer;
      delete studentAnswer.createdAt;

      studentAnswer.studentAnswer = entries[question.id];

      //Check answer
      if( question.data().type !== "coding") {
        studentAnswer.remarks = -1;
      }
      else {
        if (question.data().answer === entries[question.id]) {
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

    e.preventDefault();

    showLoading({
      message: "Submitting..."
    });

    let formChoices = document.getElementById('form_choices');
    let formBlank = document.getElementById('form_blank');
    let formCoding = document.getElementById('form_coding');


    let entries_choices = getFormEntries(formChoices);
    let entries_blank = getFormEntries(formBlank);
    let entries_coding = getFormEntries(formCoding);

    let data_choices = getQuestionData(entries_choices, multiChoices);
    let data_blanks = getQuestionData(entries_blank, fillBlanks);
    let data_coding = getQuestionData(entries_coding, codings);

    let studentScore = data_choices.studentScore + data_blanks.studentScore + data_coding.studentScore;
    let totalScore = data_choices.totalScore + data_blanks.totalScore + data_coding.totalScore;

    let answers = {
      studentId: user.id,
      multipleChoice: data_choices,
      fillBlank: data_blanks,
      coding: data_coding,
      studentScore: studentScore,
      totalScore: totalScore
    }

    let result = await ModuleController.submitQuizAnswer(module.id, answers);

    clearModal();

    if(result && result.id) {

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

  return (
    <>
      <div className="fixed drop-shadow top-0 left-0 bg-base-100 w-full h-20 flex items-center justify-center z-50">
        Timer Goes Here
      </div>
      <div className="flex flex-row justify-center">
        <div className="w-full max-w-[48rem] lg:px-8 p-0 lg:mr-8 m-0">
          <div>
            <div className="flex flex-col gap-2 mb-4">

              {/* Multiple Choice */}
              <form
                id="form_choices"
                className={tabIndex === 0 ? "" : "hidden"}
                onSubmit={(e) => selectTab(e, 1)}
              >
                <div className="font-bold text-xl mb-4">
                  I. Multiple Choice
                </div>
                {multiChoices.map((item, i) => (
                  <MutlipleChoice
                    key={i.toString()}
                    item={getDocData(item)}
                    questionNo={i + 1}
                  />
                ))}
                <div className="flex justify-end">
                  <button className="btn btn-primary" type="submit">
                    NEXT PAGE
                  </button>
                </div>
              </form>
              
              {/* Fill in the blank */}
              <form
                id="form_blank"
                className={tabIndex === 1 ? "" : "hidden"}
                onSubmit={(e) => selectTab(e, 2)}
              >
                <div className="font-bold mb-4 text-xl">
                  II. Fill in the Blank
                </div>
                {fillBlanks.map((item, i) => (
                  <FillBlank
                    key={i.toString()}
                    item={getDocData(item)}
                    questionNo={i + 1}
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
              
              {/* Coding */}
              <form
                id="form_coding"
                className={tabIndex === 2 ? "" : "hidden"}
                onSubmit={checkAnswers}
              >
                <div className="font-bold mb-4 text-xl">III. Coding</div>
                {codings.map((item, i) => (
                  <Coding
                    key={i.toString()}
                    item={getDocData(item)}
                    questionNo={i + 1}
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

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
