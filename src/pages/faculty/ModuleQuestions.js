import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { useLocation, useNavigate } from "react-router-dom";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import Header2 from "../../components/Header2";
import Select from "../../components/Select";
import TextArea from "../../components/TextArea";
import TextField from "../../components/TextField";
import { ModuleController } from "../../controllers/_Controllers";
import { getErrorMessage } from "../../controllers/_Helper";
import { clearModal, showConfirmationBox, showLoading, showMessageBox } from "../../modals/Modal";
import SettingInfo from "../../components/SettingInfo";

export default function ModuleQuestions() {

  const location = useLocation();
  const navigate = useNavigate();

  const moduleId = location.search.substring(1);

  const [module, setModule] = useState(null);

  const [tab, setTab] = useState('choices');
  
  const [modal, setModal] = useState(false);
  const [type, setType] = useState('choices');
  const [questionId, setQuestionId] = useState('');
  const [question, setQuestion] = useState('');
  const [points, setPoints] = useState('');
  const [answer, setAnswer] = useState('');
  const [difficulty, setDifficulty] = useState("1");

  //Output Tracing
  const [code, setCode] = useState('');

  //Multi Choices
  const [choice1, setChoice1] = useState('');
  const [choice2, setChoice2] = useState('');
  const [choice3, setChoice3] = useState('');

  //Coding
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [testCases, setTestCases] = useState([]);

  const [listMulti, setListMulti] = useState([]);
  const [listBlank, setListBlank] = useState([]);
  const [listCoding, setListCoding] = useState([]);
  const [listTracing, setListTracing] = useState([]);

  useEffect(() => {
    const unsubscribeModule = ModuleController.subscribeDoc(moduleId, (snapshot) => {
      let item = snapshot.data();
      item.id = moduleId;
      setModule(item);
    })

    const unsubscribeQuestions = ModuleController.subscribeQuestions(moduleId, (snapshot) => {

      let multi = [];
      let blank = [];
      let tracing = [];
      let coding = [];

      for (let doc of snapshot.docs) {
        if (doc.data().type === "choices") {
          multi.push(doc);
        }
        else if (doc.data().type === "blank") {
          blank.push(doc);
        }
        else if (doc.data().type === "tracing") {
          tracing.push(doc);
        }
        else {
          coding.push(doc);
        }
      }

      setListMulti(multi);
      setListBlank(blank);
      setListTracing(tracing);
      setListCoding(coding);
    });

    return () => {
      unsubscribeModule();
      unsubscribeQuestions();
    }
  }, []);

  useEffect(() => {
    if(!modal) {
      setTestCases([])
      setInput('');
      setOutput('');
      setPoints('');
      setCode('');
    }
  }, [modal])

  async function saveQuestion(e) {

    e.preventDefault();

    showLoading({
      message: "Saving..."
    })

    let item = {
      question: question,
      answer: answer,
      type: type,
      difficulty: isNaN(difficulty) ? 1 : parseInt(difficulty),
      points: parseInt(points)
    }

    if(type === "coding") {
      if(testCases.length > 0) {
        item.testCases = testCases;
      }
      else {
        showMessageBox({
          title: "Message",
          message: "Please add atleast one test case.",
          type: "warning",
        })
        return;
      }
    }

    if(type === "tracing") {
      item.code = code;
    }

    if (type === "choices") {
      item.choices = [
        item.answer,
        choice1,
        choice2,
        choice3
      ]
    }

    let result = false;

    if (questionId) {
      result = await ModuleController.updateQuestion(moduleId, questionId, item);
    }
    else {
      result = await ModuleController.addQuestion(moduleId, item);
    }

    clearModal();

    if (result && result.id) {

      if(type === "coding") {
        setTestCases([]);
        setInput('');
        setOutput('');
      }

      showMessageBox({
        title: "Success",
        message: "Success",
        type: "success",
        onPress: () => {
          document.getElementById("modal_form").reset();
          setModal(false);
        }
      })
    }
    else {

      showMessageBox({
        title: "Error",
        message: getErrorMessage(result),
        type: "danger",
        onPress: () => {
        }
      });
    }
  }

  async function saveTime (value) {
    let time = parseInt(value);
    await ModuleController.update(moduleId, {
      examTime: time
    });
  }

  function editQuestion(item) {
    let data = item.data();
    setQuestionId(item.id);
    setAnswer(data.answer);
    setPoints(data.points);
    setQuestion(data.question);
    setDifficulty(data.difficulty);
    setType(data.type);

    if (data.type === "choices") {
      setChoice1(data.choices[1]);
      setChoice2(data.choices[2]);
      setChoice3(data.choices[3]);
    }

    if (data.type === "coding") {
      setTestCases(data.testCases);
    }

    if (data.type === "tracing") {
      setCode(data.code);
    }

    setModal(true);
  }

  function deleteQuestion(id) {
    showConfirmationBox({
      message: "Are you sure you want to remove this question?",
      type: "warning",
      onYes: async () => {
        showLoading({
          message: "Deleting..."
        })

        let result = await ModuleController.deleteQuestion(moduleId, id);

        clearModal();

        if (result !== true) {
          showMessageBox({
            title: "Error",
            type: "error",
            message: getErrorMessage(result)
          })
        }
      }
    })
  }

  function addTestCase() {
    if (input && output) {
      let list = [...testCases];
      list.push({
        input,
        output,
      });
      setTestCases(list);
      setInput('');
      setOutput('')
    }
  }

  function removeTestCase(index) {
    let list = [...testCases];
    list.splice(index, 1);
    setTestCases(list);
  }

  function getDifficulty (difficulty) {
    if(difficulty === 1) {
      return "Easy"
    }
    else if (difficulty === 2) {
      return "Medium"
    }
    else {
      return "Hard"
    }
  }

  const QuestionAction = ({ item }) => {

    return (
      <div className="flex items-center">
        <button
          className="btn btn-ghost"
          onClick={() => editQuestion(item)}
        >
          <span className="mr-2">Edit</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#757c8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon><line x1="3" y1="22" x2="21" y2="22"></line></svg>
        </button>
        <button
          className="btn btn-ghost"
          onClick={() => deleteQuestion(item.id)}
        >
          <span className="mr-2 text-red-400">DELETE</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f87272" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    )
  }



  return (
    <>
      {/* Modal */}
      <ReactModal
        isOpen={modal}
        ariaHideApp={false}
        style={{ overlay: { zIndex: 49, background: "transparent" } }}
        className="bg-modal flex w-full h-screen backdrop-blur-sm z-50 items-center justify-center"
      >
        <form
          className="bg-base-200 p-4 w-[40rem] max-h-[90vh] rounded relative overflow-y-auto overflow-x-hidden "
          id="modal_form"
          onSubmit={saveQuestion}
        >
          <div className="my-4">
            <h1 className="text-lg font-semibold">Question Details</h1>
          </div>
          <Select
            label="Type"
            required
            disabled={questionId}
            value={type}
            onChange={setType}
            options={[
              {
                value: "choices",
                label: "Multiple Choice"
              },
              {
                value: "blank",
                label: "Fill in the Blank"
              },
              {
                value: "tracing",
                label: "Output Tracing"
              },
              {
                value: "coding",
                label: "Coding"
              }
            ]}
          />

          <TextArea
            label="Question / Problem"
            name="question"
            value={question}
            onChange={setQuestion}
            required
          />

          {
            type === "tracing" && (
              <TextArea
                className="font-mono whitespace-pre-wrap"
                label="Code"
                name="code"
                value={code}
                onChange={setCode}
                required
              />
            )
          }

          {
            type !== "coding" && (
              <TextArea
                className="font-mono whitespace-pre-wrap"
                label="Answer"
                name="answer"
                value={answer}
                onChange={setAnswer}
                required
              />
            )
          }

          {
            type === "coding" && (
              <>
                <h1 className="font-bold text-sm mt-4">Test Cases</h1>
                <TextArea
                  className="font-mono whitespace-pre-wrap"
                  label="Input"
                  value={input}
                  onChange={setInput}
                />
                <TextArea
                  className="font-mono whitespace-pre-wrap"
                  label="Output"
                  value={output}
                  onChange={setOutput}
                />
                <div className="flex justify-end">
                  <button
                    className="btn btn-primary mt-2 btn-sm"
                    type="button"
                    disabled={!input || !output}
                    onClick={addTestCase}
                  >
                    ADD
                  </button>
                </div>

                <label className="label justify-start">
                  <span className="label-text">Test Case/s</span>
                  <span className="text-red-500 ml-2">*</span>
                </label>
                {
                  testCases.length > 0 ? (
                    <table className="table table-compact w-full">
                      <thead>
                        <tr>
                          <th className="text-xs font-semibold">Input</th>
                          <th className="text-xs font-semibold">Output</th>
                          <th className="text-xs font-semibold"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          testCases.map((item, index) => (
                            <tr key={index.toString()} className="text-sm">
                              <td className="whitespace-pre">{item.input}</td>
                              <td>{item.output}</td>
                              <td className="cursor-pointer" onClick={() => removeTestCase(index)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f87272" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center text-sm my-1 text-gray-400">
                      (Please add atlest one test case)
                    </div>
                  )
                }
              </>
            )
          }

          {
            type === "choices" && (
              <>
                <TextField
                  label="Choice 1"
                  name="choice_1"
                  value={choice1}
                  onChange={setChoice1}
                  required
                />
                <TextField
                  label="Choice 2"
                  name="choice_2"
                  value={choice2}
                  onChange={setChoice2}
                  required
                />
                <TextField
                  label="Choice 3"
                  name="choice_3"
                  value={choice3}
                  onChange={setChoice3}
                  required
                />
              </>
            )
          }

          <Select
            label="Difficulty"
            required
            value={difficulty}
            onChange={setDifficulty}
            options={[
              {
                value: "1",
                label: "Easy"
              },
              {
                value: "2",
                label: "Medium"
              },
              {
                value: "3",
                label: "Hard"
              },
            ]}
          />
          <TextField
            label="Points"
            name="points"
            type="number"
            value={points}
            onChange={setPoints}
            required
          />

          <div className="flex justify-end my-4 space-x-2">
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => setModal(false)}
            >CANCEL</button>
            <button className="btn btn-success">SAVE</button>
          </div>

        </form>
      </ReactModal>


      <div>
        <div className="flex justify-between">
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
              <path fill="currentColor" d="m12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2H7.825l5.6 5.6Z" />
            </svg>
            <p>Back</p>
          </button>
          <button className="btn btn-info" onClick={() => {
            setQuestion('');
            setAnswer('');
            setChoice1('');
            setChoice2('');
            setChoice3('');
            setQuestionId('');
            setModal(true)
          }}>
            <span>ADD QUESTION / PROBLEM</span>
          </button>
        </div>

        <div className="flex justify-between mb-4">
          <Header2 value="Questionnaires" />
          <div className="w-40">
            <SettingInfo
              label="Quiz Time in Mins:"
              value={module ? module.examTime : ""}
              type="number"
              editable
              onSave={saveTime}
            />
          </div>
        </div>



        <div>
          <Tabs>
            <TabList className="flex border-y-2">
              <Tab
                className={
                  "flex-1 text-center py-4 px-2 hover:bg-primary-focus hover:text-white cursor-pointer " +
                  (tab === "choices" && "bg-primary text-white")
                }
                onClick={() => {
                  setTab('choices')
                  setType('choices')
                }}
              >
                Mutliple Choice</Tab>
              <Tab
                className={
                  "flex-1 text-center py-4 px-2 hover:bg-primary-focus hover:text-white cursor-pointer " +
                  (tab === "blank" && "bg-primary text-white")
                }
                onClick={() => {
                  setTab('blank')
                  setType('blank')
                }}
              >
                Fill in the Blank</Tab>
              <Tab
                className={
                  "flex-1 text-center py-4 px-2 hover:bg-primary-focus hover:text-white cursor-pointer " +
                  (tab === "tracing" && "bg-primary text-white")
                }
                onClick={() => {
                  setTab('tracing')
                  setType('tracing')
                }}
              >
                Output Tracing</Tab>
              <Tab
                className={
                  "flex-1 text-center py-4 px-2 hover:bg-primary-focus hover:text-white cursor-pointer " +
                  (tab === "coding" && "bg-primary text-white")
                }
                onClick={() => {
                  setTab('coding')
                  setType('coding')
                }}
              >
                Coding</Tab>
            </TabList>

            <TabPanel>
              {
                listMulti.map((item, index) => (
                  <div key={index.toString()} className="flex border-b-2">
                    <div
                      className="flex-1 px-2 py-4"
                    >
                      <div className="flex flex-col items-start md:flex-row">
                        <span className="w-20">Question: </span>
                        <span className="font-semibold ml-4">{item.data().question}</span>
                      </div>

                      <div className="flex flex-col items-start md:flex-row mt-2">
                        <span className="w-20">Answer: </span>
                        <span className="font-bold ml-4">{item.data().answer}</span>
                      </div>

                      <div className="flex flex-col items-start md:flex-row mt-2">
                        <span className="w-20">Choices: </span>
                        <span className="ml-4">{item.data().choices.toString()}</span>
                      </div>

                      <div className="flex flex-col items-start md:flex-row mt-2">
                        <span className="w-20">Difficulty: </span>
                        <span className="ml-4">{getDifficulty(item.data().difficulty)}</span>
                      </div>

                      <div className="flex flex-col items-start md:flex-row mt-2">
                        <span className="w-20">Points: </span>
                        <span className="ml-4">{item.data().points}</span>
                      </div>
                    </div>
                    <QuestionAction item={item} />

                  </div>
                ))
              }
            </TabPanel>
            <TabPanel>
              {
                listBlank.map((item, index) => (
                  <div className="flex border-b-2" key={index.toString()}>
                    <div className="flex-1 px-2 py-4">
                      <div className="flex flex-col items-start md:flex-row">
                        <span className="w-20">Question: </span>
                        <span className="font-semibold ml-4">{item.data().question}</span>
                      </div>

                      <div className="flex flex-col items-start md:flex-row mt-2">
                        <span className="w-20">Answer: </span>
                        <span className="font-bold ml-4">{item.data().answer}</span>
                      </div>

                      <div className="flex flex-col items-start md:flex-row mt-2">
                        <span className="w-20">Difficulty: </span>
                        <span className="ml-4">{getDifficulty(item.data().difficulty)}</span>
                      </div>

                      <div className="flex flex-col items-start md:flex-row mt-2">
                        <span className="w-20">Points: </span>
                        <span className="ml-4">{item.data().points}</span>
                      </div>
                    </div>

                    <QuestionAction item={item} />
                  </div>
                ))
              }
            </TabPanel>
            <TabPanel>
              {
                listTracing.map((item, index) => (
                  <div className="flex border-b-2" key={index.toString()}>
                    <div className="flex-1 px-2 py-4">
                      <div className="flex flex-col items-start md:flex-row">
                        <span className="w-20">Question: </span>
                        <span className="font-semibold ml-4 whitespace-pre">{item.data().question}</span>
                      </div>

                      <div className="flex flex-col items-start md:flex-row">
                        <span className="w-20">Code: </span>
                        <span className="font-mono ml-4 whitespace-pre textarea textarea-bordered mt-2">{item.data().code}</span>

                      </div>

                      <div className="flex flex-col items-start md:flex-row mt-2">
                        <span className="w-20">Answer: </span>
                        <span className="font-bold ml-4 whitespace-pre">{item.data().answer}</span>
                      </div>

                      <div className="flex flex-col items-start md:flex-row mt-2">
                        <span className="w-20">Difficulty: </span>
                        <span className="ml-4">{getDifficulty(item.data().difficulty)}</span>
                      </div>

                      <div className="flex flex-col items-start md:flex-row mt-2">
                        <span className="w-20">Points: </span>
                        <span className="ml-4">{item.data().points}</span>
                      </div>
                    </div>

                    <QuestionAction item={item} />
                  </div>
                ))
              }
            </TabPanel>
            <TabPanel>
              {
                listCoding.map((item, index) => (
                  <div className="flex border-b-2" key={index.toString()}>
                    <div className="flex-1 px-2 py-4">
                      <div className="flex flex-col items-start md:flex-row">
                        <span className="w-20">Problem: </span>
                        <span className="font-semibold ml-4">{item.data().question}</span>
                      </div>

                      <div className="flex flex-col items-start md:flex-row mt-2">
                        <span className="w-20">Difficulty: </span>
                        <span className="ml-4">{getDifficulty(item.data().difficulty)}</span>
                      </div>

                      <div className="flex flex-col items-start md:flex-row mt-2">
                        <span className="w-20">Points: </span>
                        <span className="ml-4">{item.data().points}</span>
                      </div>
                    </div>

                    <QuestionAction item={item} />
                  </div>
                ))
              }
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </>
  )
}