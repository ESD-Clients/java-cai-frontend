import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useState } from 'react';
import Coding from '../../quiz/Coding';
import FillBlank from '../../quiz/FillBlank';
import MutlipleChoice from '../../quiz/MutlipleChoice';
import Tracing from '../../quiz/Tracing';

export default function LearnerQuiz({ student, module, result, setSelected }) {

  const [tab, setTab] = useState('choices');

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
              <div className='font-bold text-2xl'>{result.studentScore} / {result.totalScore}</div>
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

        <div className="flex flex-row justify-center pt-8 mt-8">
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