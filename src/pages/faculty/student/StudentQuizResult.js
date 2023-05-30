import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useState } from 'react';
import Coding from '../../quiz/Coding';
import FillBlank from '../../quiz/FillBlank';
import MutlipleChoice from '../../quiz/MutlipleChoice';
import TextField from '../../../components/TextField';
import HDivider from '../../../components/HDivider';
import { Helper, LearnerController, ModuleController, StudentController } from '../../../controllers/_Controllers';
import { clearModal, showLoading, showMessageBox } from '../../../modals/Modal';
import Tracing from '../../quiz/Tracing';
import ReactModal from 'react-modal';
import TextArea from '../../../components/TextArea';

export default function StudentQuizResult({ user, student, module, result, setSelected }) {

  const [tab, setTab] = useState('choices');
  const [quizResult, setQuizResult] = useState(result);
  const [feedBack, setFeedBack] = useState(result.feedBack);
  const [feedBackModal, setFeedBackModal] = useState(false);

  async function checkCoding(e) {
    e.preventDefault();

    showLoading({
      message: "Submitting..."
    })
    let newResult = {
      ...quizResult
    }

    let data = Helper.getEventFormData(e);
    let answers = newResult.coding.answers;

    let studentScore = 0;

    for (let i = 0; i < answers.length; i++) {
      let score = parseInt(data[i]);
      answers[i].remarks = score;
      studentScore += score;
    }

    newResult.coding.studentScore = studentScore;
    newResult.coding.status = 1;
    newResult.studentScore = newResult.studentScore + studentScore;

    let passingScore = Math.ceil(newResult.totalScore * 0.6);

    if (newResult.studentScore >= passingScore) {
      newResult.remarks = "passed";
    }
    else {
      newResult.remarks = "failed";
    }

    let resultId = newResult.id;
    let newData = { ...newResult };
    delete newData.id;

    let res = await ModuleController.updateQuizResult(module.id, resultId, newData);

    if (newResult.remarks === "passed") {
      let finishedModules = student.finishedModules;
      finishedModules.push(module.id);

      if(user.type === "faculty") {
        await StudentController.update(student.id, {
          finishedModules: finishedModules
        });
      }
      else {
        await LearnerController.update(student.id, {
          finishedModules: finishedModules
        });
      }
    }

    clearModal();

    if (res === true) {
      setQuizResult(newResult);
    }
    else {
      showMessageBox({
        type: "danger",
        title: "Error",
        message: res.message
      })
    }
  }

  async function submitFeedback (e) {
    e.preventDefault();

    showLoading({
      message: "Saving..."
    });

    await ModuleController.updateQuizResult(module.id, quizResult.id, {
      feedBack: feedBack
    });

    clearModal();
    setFeedBackModal(false);
  }

  return (
    <>
      <ReactModal
        isOpen={feedBackModal}
        ariaHideApp={false}
        style={{ overlay: { zIndex: 49, background: "transparent" } }}
        className="bg-modal flex w-full h-full backdrop-blur-sm z-50 p-4 items-center justify-center"
      >
        <form 
          className="bg-base-200 p-4 sm:w-1/2 rounded relative overflow-x-hidden overflow-y-auto"
          onSubmit={submitFeedback}
        >
          <TextArea
            label="Feedback"
            required
            name="message"
            value={feedBack}
            onChange={setFeedBack}
          />
          <div className='mt-4 flex justify-end gap-2'>
            <button
              className="btn btn-info"
              onClick={() => {

              }}
            >
              SAVE
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => {
                setFeedBackModal(false);
              }}
            >
              CANCEL
            </button>
          </div>
        </form>
      </ReactModal>
      <Tabs className="flex flex-col w-full bg-base-100">
        <div className='sticky top-6 bg-base-100'>
          <div className="flex justify-between items-center mb-4">
            <div className='flex items-center flex-1'>
              <button className="btn btn-ghost" onClick={() => setSelected(null)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                  <path fill="currentColor" d="m12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2H7.825l5.6 5.6Z" />
                </svg>
                <p>Back</p>
              </button>
              <h2 className='ml-8 font-bold text-2xl'>
                {module.title}
              </h2>
            </div>
            <button
              className="btn btn-sm btn-info ml-8 mr-4"
              onClick={() => {
                setFeedBackModal(true);
              }}
            >
              Feedback
            </button>
            <div>
              <div className='text-xs'>Score:</div>
              <div className='font-bold text-2xl'>{quizResult.studentScore} / {quizResult.totalScore}</div>
            </div>
          </div>
          <TabList className="flex border-y-2 bg-base-100">
            {
              quizResult.multipleChoice.answers.length > 0 && (
                <Tab
                  className={
                    "flex-1 text-center py-4 px-2 outline-none hover:bg-primary-focus hover:text-white cursor-pointer " +
                    (tab === "choices" && "bg-primary text-white")
                  }
                  onClick={() => {
                    setTab('choices')
                  }}
                >
                  Mutliple Choice</Tab>
              )
            }

            {
              quizResult.fillBlank.answers.length > 0 && (
                <Tab
                  className={
                    "flex-1 text-center py-4 px-2 outline-none hover:bg-primary-focus hover:text-white cursor-pointer " +
                    (tab === "blank" && "bg-primary text-white")
                  }
                  onClick={() => {
                    setTab('blank')
                  }}
                >
                  Fill in the Blank</Tab>
              )
            }

            {
              quizResult.outputTracing.answers.length > 0 && (
                <Tab
                  className={
                    "flex-1 text-center py-4 px-2 outline-none hover:bg-primary-focus hover:text-white cursor-pointer " +
                    (tab === "tracing" && "bg-primary text-white")
                  }
                  onClick={() => {
                    setTab('tracing')
                  }}
                >
                  Output Tracing</Tab>
              )
            }

            {
              quizResult.coding.answers.length > 0 && (
                <Tab
                  className={
                    "flex-1 text-center py-4 px-2 outline-none hover:bg-primary-focus hover:text-white cursor-pointer " +
                    (tab === "coding" && "bg-primary text-white")
                  }
                  onClick={() => {
                    setTab('coding')
                  }}
                >
                  Coding
                  {
                    !quizResult.coding.status && (
                      " (Unchecked)"
                    )
                  }
                </Tab>
              )
            }
          </TabList>
        </div>

        <div className="flex flex-row justify-center pt-8 mt-8">
          <div className="w-full max-w-[48rem] lg:px-8 p-0 lg:mr-8 m-0">
            {
              quizResult.multipleChoice.answers.length > 0 && (
                <TabPanel>
                  {
                    quizResult.multipleChoice.answers.map((item, index) => (
                      <MutlipleChoice key={index.toString()} item={item} questionNo={index + 1} />
                    ))
                  }
                </TabPanel>
              )
            }

            {
              quizResult.fillBlank.answers.length > 0 && (
                <TabPanel>
                  {
                    quizResult.fillBlank.answers.map((item, index) => (
                      <FillBlank key={index.toString()} item={item} questionNo={index + 1} />
                    ))
                  }
                </TabPanel>
              )
            }

            {
              quizResult.outputTracing.answers.length > 0 && (
                <TabPanel>
                  {
                    quizResult.outputTracing.answers.map((item, index) => (
                      <Tracing key={index.toString()} item={item} questionNo={index + 1} />
                    ))
                  }
                </TabPanel>
              )
            }

            {
              quizResult.coding.answers.length > 0 && (
                <TabPanel>
                  <form onSubmit={checkCoding}>
                    {
                      quizResult.coding.answers.map((item, index) => (
                        <div key={index.toString()}>
                          <Coding item={item} questionNo={index + 1} />
                          {
                            quizResult.coding.status === 0 && (
                              <>
                                <TextField name={index} label="Points" type="number" min={0} max={item.points} required />
                                <HDivider />
                              </>
                            )
                          }
                        </div>
                      ))
                    }
                    {
                      quizResult.coding.status === 0 && (
                        <button className='btn btn-success'>
                          SUBMIT SCORE
                        </button>
                      )
                    }
                  </form>
                </TabPanel>
              )
            }
          </div>
        </div>

      </Tabs>
    </>
  )
}