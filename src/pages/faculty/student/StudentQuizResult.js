import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useState } from 'react';
import Coding from '../../student/quiz/Coding';
import FillBlank from '../../student/quiz/FillBlank';
import MutlipleChoice from '../../student/quiz/MutlipleChoice';
import TextField from '../../../components/TextField';
import HDivider from '../../../components/HDivider';
import { Helper, ModuleController } from '../../../controllers/_Controllers';
import { clearModal, showLoading, showMessageBox } from '../../../modals/Modal';
import Tracing from '../../student/quiz/Tracing';

export default function StudentQuizResult({ student, module, result, setSelected }) {

  const [tab, setTab] = useState('choices');
  const [quizResult, setQuizResult] = useState(result);

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

    let resultId = newResult.id;
    let newData = { ...newResult };
    delete newData.id;

    console.log(newResult);

    let res = await ModuleController.updateQuizResult(module.id, resultId, newData);
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

  return (
    <>
      <Tabs className="flex flex-col w-full bg-base-100">
        <div className='sticky top-6 bg-base-100'>
          <div className="flex justify-between mb-4 gap-12">
            <div className='flex items-center'>
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

            <div className='ml-8'>
              <div className='text-xs'>Score:</div>
              <div className='font-bold text-2xl'>{quizResult.studentScore} / {quizResult.totalScore}</div>
            </div>
          </div>
          <TabList className="flex border-y-2 bg-base-100">
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
          </TabList>
        </div>

        <div className="flex flex-row justify-center pt-8 mt-8">
          <div className="w-full max-w-[48rem] lg:px-8 p-0 lg:mr-8 m-0">
            <TabPanel>
              {
                quizResult.multipleChoice.answers.map((item, index) => (
                  <MutlipleChoice key={index.toString()} item={item} questionNo={index + 1} />
                ))
              }
            </TabPanel>
            <TabPanel>
              {
                quizResult.fillBlank.answers.map((item, index) => (
                  <FillBlank key={index.toString()} item={item} questionNo={index + 1} />
                ))
              }
            </TabPanel>
            <TabPanel>
              {
                quizResult.outputTracing.answers.map((item, index) => (
                  <Tracing key={index.toString()} item={item} questionNo={index + 1} />
                ))
              }
            </TabPanel>
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
          </div>
        </div>

      </Tabs>
    </>
  )
}