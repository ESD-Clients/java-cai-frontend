import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import MutlipleChoice from './MutlipleChoice';
import FillBlank from './FillBlank';
import Coding from './Coding';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Result({ user, module, result }) {

  const navigate = useNavigate();
  const [tab, setTab] = useState('choices');

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
                <div className='font-bold text-2xl'>{result.studentScore} / {result.totalScore}</div>
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
                  (tab === "coding" && "bg-primary text-white")
                }
                onClick={() => {
                  setTab('coding')
                }}
              >
                Coding</Tab>
            </TabList>
          </div>
        </div>

        <div className="flex flex-row justify-center pt-8 mt-8">
          <div className="w-full max-w-[48rem] lg:px-8 p-0 lg:mr-8 m-0">
            <TabPanel>
              {
                result.multipleChoice.answers.map((item, index) => (
                  <MutlipleChoice key={index.toString()} item={item} questionNo={index + 1} />
                ))
              }
            </TabPanel>
            <TabPanel>
              {
                result.fillBlank.answers.map((item, index) => (
                  <FillBlank key={index.toString()} item={item} questionNo={index + 1} />
                ))
              }
            </TabPanel>
            <TabPanel>
              {
                result.coding.answers.map((item, index) => (
                  <Coding key={index.toString()} item={item} questionNo={index + 1} />
                ))
              }
            </TabPanel>
          </div>
        </div>

      </Tabs>
    </>
  )
}