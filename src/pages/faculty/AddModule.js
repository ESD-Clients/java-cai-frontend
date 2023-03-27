import Editor from "@monaco-editor/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import FacultyNavBar from "../../components/FacultyNavBar";
import FacultySideBar from "../../components/FacultySideBar";
import { Helper, ModuleController } from "../../controllers/_Controllers";
import { clearModal, showLoading, showMessageBox } from "../../modals/Modal";

export default function AddModule({ user }) {

  const [video, setVideo] = useState(null);
  const [code, setCode] = useState('');

  async function addItem(e) {
    e.preventDefault();

    showLoading({
      message: "Saving..."
    })

    // console.log(e.target.video.files[0]);

    
    let values = Helper.getEventFormData(e);
    if(code) {
      values.sample_code = code;
    }
    delete values["video"];

    let valueString = JSON.stringify(values);
    // console.log(valueString);

    let data = new FormData();
    data.append("params", valueString);
    data.append("video", e.target.video.files[0]);

    let result = await ModuleController.store(data);

    clearModal();

    console.log(result);
    
    if (result && result.id) {
      showMessageBox({
        title: "Success",
        message: "Success",
        type: "success",
        onPress: () => {
          document.getElementById("btnBack").click();
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
      <div className="drawer drawer-mobile">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* <!-- Navbar --> */}
          <FacultyNavBar user={user} />
          {/* <!-- Page content here --> */}
          <div>
            <div className="p-6">
              <div className="flex xl:flex-row flex-col justify-between">
                <div className="w-full lg:pr-8 p-0">
                  <div className="overflow-x-auto">
                    <form method="post" id="addModuleInputForm" onSubmit={addItem}>
                      <div className="flex justify-between">
                        <div>
                          <Link to="/faculty/modules" id="btnBack">
                            <button className="btn btn-primary">
                              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                <path fill="currentColor" d="m12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2H7.825l5.6 5.6Z" />
                              </svg>
                              <p>Back</p>
                            </button>
                          </Link>
                        </div>
                        <div>
                          <button className="btn btn-success" type="submit">Save</button>
                        </div>
                      </div>
                      <div className="divider"></div>
                      <div className="flex flex-row justify-between w-1/2 space-x-2">
                        <div className="form-control w-full max-w-xs">
                          <label className="label">
                            <span className="label-text">Module Number</span>
                          </label>
                          <input type="number" placeholder="e.g. 1" className="input input-bordered w-full max-w-xs" name="number" required />
                        </div>
                        <div className="form-control w-full max-w-xs">
                          <label className="label">
                            <span className="label-text">Module Title</span>
                          </label>
                          <input type="text" placeholder="Flowchart" className="input input-bordered w-full max-w-xs" name="title" required />
                        </div>
                      </div>
                      <div>
                        <div className="form-control w-full">
                          <label className="label">
                            <span className="label-text">Module Content</span>
                          </label>
                          <textarea className="textarea textarea-bordered mt-2 p-1 border rounded h-full w-full" placeholder="Module Content" name="content" required></textarea>
                        </div>
                        <div className="form-control w-full">
                          <label className="label">
                            <span className="label-text">Module Video</span>
                          </label>
                          <div>
                            <input name="video" type="file" accept="video/mp4,video/x-m4v,video/*" className="file-input file-input-bordered w-full max-w-xs" />
                          </div>
                        </div>
                        <div className="form-control w-full">
                          <label className="label">
                            <span className="label-text">Example Code:</span>
                          </label>
                          <Editor
                            language="java"
                            defaultLanguage="java"
                            theme="vs-dark"
                            height="20rem"
                            onChange={setCode}
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <FacultySideBar />

      </div>
    </>

    // TODO: SCRIPTS
  )
}