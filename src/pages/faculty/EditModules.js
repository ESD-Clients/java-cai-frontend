import { useEffect } from "react";
import { useState } from "react";
import ReactPlayer from "react-player";
import { useLocation, useNavigate } from "react-router-dom";
import FacultySideBar from "../../components/FacultySideBar";
import { Helper, ModuleController } from "../../controllers/_Controllers";
import { showLoading, showMessageBox } from "../../modals/Modal";
import config from "../../config.json";
import Editor from "@monaco-editor/react";
import axios from "axios";
import QueryString from "qs";

export default function EditModules() {

  const location = useLocation();
  const navigate = useNavigate();

  const formType = location.state.type;

  const [module, setModule] = useState(location.state.item);

  const [compiling, setCompiling] = useState(false);
  const [code, setCode] = useState(module.sample_code);
  const [output, setOutput] = useState('');

  const [loaded, setLoaded] = useState(false);
  const [multiChoices, setMultiChoices] = useState([]);
  const [fillBlanks, setFillBlanks] = useState([]);
  const [codings, setCodings] = useState([]);

  const [selectedType, setSelectedType] = useState("multi_choices");


  useEffect(() => {

    console.log(module);
    console.log(`${config.host}/${module.file_uri}`);

    async function fetchData() {

      let multiChoices = await ModuleController.getQuestions({ module: module.id, type: "multi_choices" });
      setMultiChoices(multiChoices);

      let fillBlanks = await ModuleController.getQuestions({ module: module.id, type: "fill_blank" });
      setFillBlanks(fillBlanks);

      let codings = await ModuleController.getQuestions({ module: module.id, type: "coding" });
      setCodings(codings);

      setLoaded(true);
    }

    if (formType === "question" && !loaded) {
      fetchData();
    }
  }, [formType, loaded])

  useEffect(() => {
    if (module && module.sample_code) {
      compile();
    }
  }, [module])

  async function compile() {

    setCompiling(true);
    let data = QueryString.stringify({
      'code': code,
      'language': 'java',
      'input': ''
    });

    let config = {
      method: 'post',
      url: 'https://api.codex.jaagrav.in',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    };

    await axios(config)
      .then(function (response) {
        setOutput(response.data.output);
      })

    setCompiling(false);
  }


  async function addQuestion(e) {
    e.preventDefault();

    document.getElementById("addQuestionsModal").click();

    showLoading({
      message: "Saving..."
    })

    let values = Helper.getEventFormData(e);
    values.module = module.id;
    values.type = selectedType;

    if (selectedType === "multi_choices") {
      let choices = [
        e.target.choice1.value,
        e.target.choice2.value,
        e.target.choice3.value,
        e.target.choice4.value
      ];

      values.choices = JSON.stringify(choices);
    }

    let result = await ModuleController.addQuestion({
      params: values
    })

    if (result && result.id) {
      showMessageBox({
        title: "Success",
        message: "Success",
        type: "success",
        onPress: () => {
          window.location.reload();
        }
      })
    }
    else {
      showMessageBox({
        title: "Error",
        message: "Something went wrong",
        type: "danger",
        onPress: () => {
        }
      });
    }
  }


  async function updateModule(e) {

    e.preventDefault();

    showLoading({
      message: "Updating..."
    })

    let result = await ModuleController.update(module.id, {
      params: Helper.getEventFormData(e)
    });

    if (result && result.id) {
      showMessageBox({
        title: "Success",
        message: "Success",
        type: "success",
        onPress: () => {
          navigate(-1);
        }
      })
    }
    else {
      showMessageBox({
        title: "Error",
        message: "Something went wrong",
        type: "danger",
        onPress: () => {
        }
      });
    }
  }

  return (
    <>
      <input type="checkbox" id="addQuestionsModal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add Question</h3>

          <form id="addQuestionForm" onSubmit={addQuestion}>
            <div className="flex flex-row justify-center gap-2">
              <select className="select select-bordered w-full max-w-xs" id="questionSelector" onChange={(e) => setSelectedType(e.target.value)}>
                <option value="" disabled>Select a question type</option>
                <option value="multi_choices">Multiple Choice</option>
                <option value="coding">Coding Question</option>
                <option value="fill_blank">Fill in the blanks</option>
              </select>
              <button className="btn btn-primary" id="btnQuestionSelector">Select</button>
            </div>
            <div className="divider"></div>
            <div id="questionSelectorOutput">
              {
                selectedType === "multi_choices" ? (
                  <>
                    <div className="form-control w-full max-w-xs">
                      <label className="label">
                        <span className="label-text">Multiple Choice Question</span>
                      </label>
                      <input type="text" name="question" placeholder="Question" className="input input-bordered w-full max-w-xs" required />
                    </div>
                    <div className="form-control w-full max-w-xs">
                      <label className="label">
                        <span className="label-text">1st Choice</span>
                      </label>
                      <input type="text" name="choice1" placeholder="1st Choice" className="input input-bordered w-full max-w-xs" required />
                    </div>
                    <div className="form-control w-full max-w-xs">
                      <label className="label">
                        <span className="label-text">2nd Choice</span>
                      </label>
                      <input type="text" name="choice2" placeholder="2nd Choice" className="input input-bordered w-full max-w-xs" required />
                    </div>
                    <div className="form-control w-full max-w-xs">
                      <label className="label">
                        <span className="label-text">3rd Choice</span>
                      </label>
                      <input type="text" name="choice3" placeholder="3rd Choice" className="input input-bordered w-full max-w-xs" required />
                    </div>
                    <div className="form-control w-full max-w-xs">
                      <label className="label">
                        <span className="label-text">4th Choice</span>
                      </label>
                      <input type="text" name="choice4" placeholder="4th Choice" className="input input-bordered w-full max-w-xs" required />
                    </div>
                    <div className="form-control w-full max-w-xs">
                      <label className="label">
                        <span className="label-text">Correct Answer</span>
                      </label>
                      <input type="text" name="answer" placeholder="Correct Answer" className="input input-bordered w-full max-w-xs" required />
                    </div>
                  </>
                ) : selectedType === "fill_blank" ? (
                  <>
                    <div className="form-control w-full max-w-xs">
                      <label className="label">
                        <span className="label-text">Coding Question</span>
                      </label>
                      <input type="text" name="question" placeholder="Question" className="input input-bordered w-full max-w-xs" required />
                    </div>
                    <div className="form-control w-full max-w-xs">
                      <label className="label">
                        <span className="label-text">Answer</span>
                      </label>
                      <input type="text" name="answer" placeholder="Answer" className="input input-bordered w-full max-w-xs" required />
                    </div>
                  </>
                ) : selectedType === "coding" ? (
                  <>
                    <div className="form-control w-full max-w-xs">
                      <label className="label">
                        <span className="label-text">Fill in the Blank Question</span>
                      </label>
                      <input type="text" name="question" placeholder="Question" className="input input-bordered w-full max-w-xs" required />
                    </div>
                    <div className="form-control w-full max-w-xs">
                      <label className="label">
                        <span className="label-text">Answer</span>
                      </label>
                      <input type="text" name="answer" placeholder="Answer" className="input input-bordered w-full max-w-xs" required />
                    </div>
                  </>
                ) : null
              }
            </div>

            <div className="modal-action">
              <button className="btn btn-primary" id="addQuestion">Add</button>
              <label htmlFor="addQuestionsModal" className="btn btn-warning">Exit</label>
            </div>
          </form>
        </div>
      </div>


      <div className="drawer drawer-mobile">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* <!-- Navbar --> */}
          <div className="sticky top-0 backdrop-blur-sm">
            <div className="navbar w-full bg-base-100 px-6">
              <div className="flex-1 lg:hidden">
                <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                </label>
              </div>
              <div className="navbar-center px-2 mx-2 uppercase">Faculty Modules</div>
              <div className="flex justify-end flex-1">
                <div className="flex items-stretch">
                  <div className="dropdown dropdown-end">
                    <label tabIndex="0" className="btn btn-ghost rounded-btn lg:gap-4 p-0 lg:px-4">
                      <div className="avatar">
                        {/* <!-- <div className=" h-10 rounded-full">
                          <img src="" alt="" />

                        </div> --> */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                          <path fill="currentColor" d="M16 8a5 5 0 1 0 5 5a5 5 0 0 0-5-5Z" />
                          <path fill="currentColor" d="M16 2a14 14 0 1 0 14 14A14.016 14.016 0 0 0 16 2Zm7.992 22.926A5.002 5.002 0 0 0 19 20h-6a5.002 5.002 0 0 0-4.992 4.926a12 12 0 1 1 15.985 0Z" />
                        </svg>
                      </div>
                      <div className="lg:flex flex-col items-start hidden">
                        <div className="font-bold">
                          {/* <?php echo ($_SESSION['facultyName']) ?> */}
                        </div>
                        <div className="text-xs font-thin">Faculty</div>
                      </div>
                      <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                          <path fill="currentColor" d="m7 10l5 5l5-5z" />
                        </svg>
                      </div>
                    </label>
                    <ul tabIndex="0" className="menu menu-compact dropdown-content p-2 shadow bg-base-200 rounded-box w-52 mt-4 sticky">
                      <li><a href="/faculty/settings">Faculty Settings</a></li>
                      <li><a href="/src/api/faculty/logout.php">Logout</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- Page content here --> */}
          <div>
            <div className="p-6">
              <div className="flex xl:flex-row flex-col justify-between">
                <div className="w-full lg:pr-8 p-0">
                  <div className="overflow-x-auto">

                    {
                      formType === "content" ? (
                        <form onSubmit={updateModule}>
                          <div className="flex justify-between">
                            <div>
                              <button className="btn btn-primary" type="button" onClick={() => navigate(-1)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                  <path fill="currentColor" d="m12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2H7.825l5.6 5.6Z" />
                                </svg>
                                <p>Back</p>
                              </button>
                            </div>
                            <div>
                              <button className="btn btn-success">Save</button>
                            </div>
                          </div>

                          <div className="form-control w-full mt-2">
                            <label className="label">
                              <span className="label-text">Title</span>
                            </label>
                            <input type="text" name="title" className="input input-bordered w-full" defaultValue={module.title} required />
                          </div>
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text">Content</span>
                            </label>
                            <textarea
                              className="textarea textarea-bordered p-1 border rounded h-full w-full min-h-[20rem]"
                              name="content"
                              defaultValue={module.content}
                              required
                            />
                            {
                              module.file_uri ? (
                                <div className="h-96 mt-4">
                                  <ReactPlayer
                                    url={`${config.host}/${module.file_uri}`}
                                    width='100%'
                                    height='100%'
                                    controls
                                  />
                                </div>
                              ) : null
                            }
                          </div>
                          {/* <label className="label">
                            <span className="label-text">Change Video</span>
                          </label>
                          <div>
                            <input name="video" type="file" accept="video/mp4,video/x-m4v,video/*" className="file-input file-input-bordered w-full max-w-xs" />
                          </div> */}


                          <div className="form-control w-full">
                            <label className="label">
                              <span className="label-text">Example Code:</span>
                            </label>
                            <textarea
                              name="sample_code"
                              value={code}
                              className="w-0 h-0"
                              onChange={() => { }}
                            // required
                            />
                            <div className="flex flex-wrap">
                              
                              <Editor
                                language="java"
                                defaultLanguage="java"
                                theme="vs-dark"
                                height="20rem"
                                width="60rem"
                                value={code}
                                onChange={setCode}
                                
                              />
                              <div className="my-2 mx-4">
                                <div className="flex justify-between">
                                  <div id="output-span">Output:</div>
                                  <div>
                                    {
                                      compiling ? (
                                        <div className="mr-4">
                                          <span className="loader"></span>
                                        </div>
                                      ) : (
                                        <button className="btn btn-primary" onClick={compile}>Run</button>
                                      )
                                    }

                                  </div>
                                </div>
                                <div id="output-container" className="p-4 w-[20rem]">
                                  <p className="textarea w-full h-full font-mono whitespace-pre-line">
                                    {output}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                        </form>
                      ) : formType === "question" ? (
                        <>
                          <div className="flex justify-between">
                            <div>
                              <a href="/faculty/modules">
                                <button className="btn btn-primary">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="m12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2H7.825l5.6 5.6Z" />
                                  </svg>
                                  <p>Back</p>
                                </button>
                              </a>
                            </div>
                            <div>
                              <label htmlFor="addQuestionsModal" className="btn btn-primary">Add Question</label>
                              {/* <button className="btn btn-success">Save</button> */}
                            </div>
                          </div>
                          <div className="divider"></div>
                          <div className="flex flex-col gap-2 mt-2">

                            {/* Multiple Choices */}
                            <div>Multiple Choice :</div>
                            {
                              multiChoices.map((item, i) => {

                                let choices = JSON.parse(item.choices);

                                return (
                                  <div className="border rounded mx-2 p-1" key={i.toString()}>
                                    <div>
                                      <div>Question: {item.question}</div>
                                    </div>
                                    <div>
                                      <div>1st Choice: {choices[0]}</div>
                                      <div>2nd Choice: {choices[1]}</div>
                                      <div>3rd Choice: {choices[2]}</div>
                                      <div>4th Choice: {choices[3]}</div>
                                    </div>
                                    <div>Correct Answer: {item.answer}</div>
                                  </div>
                                )
                              })
                            }

                            {/* Identifications */}
                            <div className="mt-2">Coding Question :</div>
                            {
                              codings.map((item, i) => (
                                <div className="border rounded mx-2 p-1" key={i.toString()}>
                                  <div>Question: {item.question}</div>
                                  <div>Answer: {item.answer}</div>
                                </div>
                              ))
                            }

                            {/* Fill in the blank */}
                            <div className="mt-2">Fill in the Blank :</div>
                            {
                              fillBlanks.map((item, i) => (
                                <div className="border rounded mx-2 p-1" key={i.toString()}>
                                  <div>Question: {item.question}</div>
                                  <div>Answer: {item.answer}</div>
                                </div>
                              ))
                            }
                          </div>
                        </>
                      ) : null
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <FacultySideBar />
      </div>
    </>

    //TODO: Scripts
  )
}