import React, { useEffect } from "react";
import ReactPlayer from "react-player";
import { useLocation, useNavigate } from "react-router-dom";
import AdminNavBar from "../../components/AdminNavBar";
import AdminSideBar from "../../components/AdminSideBar";
import { ModuleController } from "../../controllers/_Controllers";
import { clearModal, showLoading, showMessageBox } from "../../modals/Modal";
import config from "../../config.json";

export default function ViewApproveModule({user}) {

  const location = useLocation();
  const navigate = useNavigate();
  const module = location.state.module;

  useEffect(() => {
    if(!module) {
      navigate("/admin");
    }
  }, [module])

  async function updateModule (remarks) {
    showLoading({
      message: "Updating..."
    })

    let params = {
      params: {
        remarks: remarks
      }
    }

    let result = await ModuleController.update(module.id, params);
    clearModal();
    
    if(result && result.id) {
      showMessageBox({
        title: "Success",
        message: "Success",
        type: "success",
        onPress: () => {
          // navigate("/admin/approve-modules");
        }
      })
    }
    else {
      showMessageBox({
        title: "Error",
        message: "Something went wrong",
        type: "danger",
      });
    }
  }

  return (
    <>
      <div className="drawer drawer-mobile">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* <!-- Navbar --> */}
          {/* <AdminNavBar user={user} /> */}
          
          
          {/* <!-- Page content here --> */}
          <div className="p-6">
            <div className="flex xl:flex-row flex-col justify-between">
              <div className="w-full lg:pr-8 p-0">
                <div className="flex justify-between">
                  <div>
                    <a href="/admin/approve-modules">
                      <button className="btn btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                          <path fill="currentColor" d="m12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2H7.825l5.6 5.6Z" />
                        </svg>
                        <p>Back</p>
                      </button>
                    </a>
                  </div>
                  <div className="space-x-2">
                    <button className="btn btn-success" onClick={() => updateModule("approved")}>Approve</button>
                    <button className="btn btn-error"  onClick={() => updateModule("disapproved")}>Disapprove</button>
                  </div>
                </div>
                <div className="mt-2 p-1 border border-base-content rounded h-full">
                  <h1 className="text-2xl font-bold">{module.title}</h1>
                  <p>{module.content}</p>
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
                  {/* <?php
                  if (isset($_POST['viewItem']) and is_numeric($_POST['viewItem'])) {
                    $view = $_POST['viewItem'];

                  $viewData = mysqli_query($conn, 'SELECT * FROM tb_modules WHERE id=' . $view);

                                if (mysqli_num_rows($viewData) > 0) {
                                    while ($row = mysqli_fetch_assoc($viewData)) {
                    echo $row['content'];
                                    }
                                }
                            }
                            ?> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <AdminSideBar /> */}
      </div>
    </>

    // TODO: SCRIPT
  )
}