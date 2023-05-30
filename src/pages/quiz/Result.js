import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import MutlipleChoice from './MutlipleChoice';
import FillBlank from './FillBlank';
import Coding from './Coding';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Tracing from './Tracing';
import { clearModal, showLoading } from '../../modals/Modal';
import { LearnerController, ModuleController, StudentController } from '../../controllers/_Controllers';

export default function Result({ user, module, result }) {

  const navigate = useNavigate();
  const [tab, setTab] = useState('choices');

  async function retakeQuiz() {
    showLoading({
      message: "Opening Quiz..."
    });

    let modulesTaken = user.modulesTaken ? user.modulesTaken : [];
      
    let currentModule = null;

    let found = false;

    for(let item of modulesTaken) {
      if(item.id === module.id) {
        currentModule = item;
        currentModule.takes += 1;
        found = true;
        break;
      }
    }

    if(!found) {
      currentModule = {
        id: module.id,
        takes: 2,
      }
      modulesTaken.push(currentModule);
    }

    if(user.type === "student") {
      await StudentController.update(user.id, {
        modulesTaken: modulesTaken
      });
    }
    else {
      await LearnerController.update(user.id, {
        modulesTaken: modulesTaken
      });
    }

    await ModuleController.destroyStudentWork(module.id, user.id);
    clearModal();
    navigate(`/${user.type}/quiz`, {
      state: {
        module: module
      }
    })
  }

  return (
    <>
      <Tabs>
        <div className="fixed flex justify-center drop-shadow top-0 left-0 bg-base-100 w-full pt-4 z-50">
          <div className="lg:max-w-[100rem] w-full flex flex-col flex-1 lg:mt-4 m-0 lg:px-8 px-4">
            <div className="flex justify-between mb-4 gap-12">
              <div className='flex items-center'>
                <button className="btn btn-ghost" onClick={() => navigate(-1)}>
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
                <div className={
                  'font-bold text-2xl ' + (result.remarks === "failed" ? "text-red-500" : result.remarks === "passed" ? "text-green-500" : "")
                }>
                  {result.studentScore} / {result.totalScore}
                </div>
              </div>
            </div>

            <div className='flex mb-4 '>
              <div className='flex-1'>
                <div className='mx-28 text-red-400 flex-1'>
                  {
                    result.remarks === "failed" && "You failed the quiz. Need to retake."
                  }
                </div>
                {
                  result.feedBack && (
                    <div className='mx-28 flex-1'>
                      Feedback: {result.feedBack}
                    </div>
                  )
                }
              </div>
              <div>
                {
                  result.remarks === "failed" && (
                    <button
                      className="btn btn-success"
                      onClick={retakeQuiz}
                    >
                      Retake Quiz
                    </button>
                  )
                }
              </div>

            </div>

            <TabList className="flex border-y-2 bg-base-100">
              {
                result.multipleChoice.answers.length > 0 && (
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
                result.fillBlank.answers.length > 0 && (
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
                result.outputTracing.answers.length > 0 && (
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
                result.coding.answers.length > 0 && (
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
                      !result.coding.status && (
                        " (Unchecked)"
                      )
                    }
                  </Tab>
                )
              }
            </TabList>
          </div>
        </div>

        <div className="flex flex-row justify-center pt-24 mt-8">
          <div className="w-full max-w-[48rem] lg:px-8 p-0 lg:mr-8 m-0">
            {
              result.multipleChoice.answers.length > 0 && (
                <TabPanel>
                  {
                    result.multipleChoice.answers.map((item, index) => (
                      <MutlipleChoice key={index.toString()} item={item} />
                    ))
                  }
                </TabPanel>
              )
            }

            {
              result.fillBlank.answers.length > 0 && (
                <TabPanel>
                  {
                    result.fillBlank.answers.map((item, index) => (
                      <FillBlank key={index.toString()} item={item} />
                    ))
                  }
                </TabPanel>
              )
            }

            {
              result.outputTracing.answers.length > 0 && (
                <TabPanel>
                  {
                    result.outputTracing.answers.map((item, index) => (
                      <Tracing key={index.toString()} item={item} />
                    ))
                  }
                </TabPanel>
              )
            }

            {
              result.coding.answers.length > 0 && (
                <TabPanel>
                  {
                    result.coding.answers.map((item, index) => (
                      <Coding key={index.toString()} item={item} />
                    ))
                  }
                </TabPanel>
              )
            }
          </div>
        </div>

      </Tabs>
    </>
  )
}