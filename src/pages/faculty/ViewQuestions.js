import { useState } from "react";
import ReactModal from "react-modal";
import { useLocation, useNavigate } from "react-router-dom";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import Header2 from "../../components/FormTitle";
import TextField from "../../components/TextField";

export default function ViewQuestions () {
  const location = useLocation();
  const navigate = useNavigate();

  const moduleId = location.search.substring(1);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [choices, setChoices] = useState([]);

  return (
    <>
      {/* Modal for multiple choices */}

      {/* Modal for fill in the blanks */}

      {/* Modal for coding */}

      <ReactModal 
        isOpen={true}
        ariaHideApp={false}
        style={{overlay: {zIndex: 49, background: "transparent"}}}
        className="bg-modal flex w-full h-full backdrop-blur-sm z-50 items-center justify-center overflow-y-scroll "
      >
        <form 
          className="bg-base-200 p-4 w-[40rem] rounded relative"
          // onSubmit={saveDetails}
        >
          <div className="my-4">
            <h1 className="text-lg font-semibold">Question Details</h1>
          </div>
          <select className="select select-bordered w-full" id="questionSelector">
            <option value="" disabled>Select a question type</option>
            <option value="choice">Multiple Choice</option>
            <option value="coding">Coding Question</option>
            <option value="blank">Fill in the blanks</option>
          </select>
          <TextField
            label="Question"
          />
          <TextField
            label="Answer"
          />
          <TextField
            label="Option 1"
          />
          <TextField
            label="Option 2"
          />
          <TextField
            label="Option 3"
          />
        </form>
      </ReactModal>


      <div>
        <div>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
              <path fill="currentColor" d="m12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2H7.825l5.6 5.6Z" />
            </svg>
            <p>Back</p>
          </button>
        </div>
        <div className="flex justify-between">
          
          <Header2 value="Questionnaires" />
        </div>

        <div>
          <Tabs>
            <TabList className="flex">
              <Tab className="flex-1">Title 1</Tab>
              <Tab className="flex-1">Title 2</Tab>
              <Tab className="flex-1">Title 3</Tab>
            </TabList>

            <TabPanel>
              <h2>Any content 1</h2>
            </TabPanel>
            <TabPanel>
              <h2>Any content 2</h2>
            </TabPanel>
            <TabPanel>
              <h2>Any content 3</h2>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </>
  )
}