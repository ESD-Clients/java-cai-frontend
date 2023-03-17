import React from "react";
import ReactPlayer from "react-player";
import { useLocation, useNavigate } from "react-router-dom";
import AdminNavBar from "../../components/AdminNavBar";
import AdminSideBar from "../../components/AdminSideBar";
import config from "../../config.json";
import { Helper, ModuleController } from "../../controllers/_Controllers";
import { showLoading, showMessageBox } from "../../modals/Modal";

export default function ViewEditModules({user}) {

  const location = useLocation();
  const navigate = useNavigate();

  const module = location.state.module;

  async function updateModule (e) {
    
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
      <div className="drawer drawer-mobile">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* <!-- Navbar --> */}
          <AdminNavBar user={user} />
          
          {/* <!-- Page content here --> */}
          <div className="p-6">
            <div className="flex xl:flex-row flex-col justify-between">
              <form className="w-full lg:pr-8 p-0" onSubmit={updateModule}>
                <div className="flex justify-between">
                  <div>
                    <a>
                      <a className="btn btn-primary" onClick={() => navigate(-1)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                          <path fill="currentColor" d="m12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2H7.825l5.6 5.6Z" />
                        </svg>
                        <p>Back</p>
                      </a>
                    </a>
                  </div>
                  <div>
                    <button className="btn btn-success" id="contentSave">Save</button>
                  </div>
                </div>
                <div className="mt-8">
                  <label className="label">
                    <span className="label-text">Title</span>
                  </label>
                  <input type="text" name="title" className="input input-bordered w-full" defaultValue={module.title} required />
                  <label className="label">
                    <span className="label-text">Content</span>
                  </label>
                  <textarea 
                    className="mt-2 p-1 border rounded h-full w-full" 
                    id="textarea-input" 
                    name="content"
                    defaultValue={module.content}
                  />
                  {
                    module.file_uri ? (
                      <>
                        <label className="label">
                          <span className="label-text">Video</span>
                        </label>
                        <div className="h-96 mt-4">
                          <ReactPlayer
                            url={`${config.host}/${module.file_uri}`}
                            width='100%'
                            height='100%'
                            controls
                          />
                        </div>
                      </>
                    ) : null
                  }
                </div>
              </form>
            </div>
          </div>
        </div>
        <AdminSideBar />
      </div>
    </>

    // TODO: SCRIPTS
  )
}