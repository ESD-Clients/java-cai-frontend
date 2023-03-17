import React from "react";
import AdminNavBar from "../../components/AdminNavBar";
import AdminSideBar from "../../components/AdminSideBar";
import AdminStatBar from "../../components/AdminStatBar";

export default function Settings({ user }) {

  

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
              <div className="w-full lg:pr-8 p-0">
                <div className="flex flex-col items-center justify-center mb-8">
                  <div className="font-bold uppercase mb-4">Admin Settings</div>
                </div>
                <div className="overflow-x-auto">
                  <div className="flex items-end">
                    <div className="form-control w-full max-w-xs">
                      <label className="label">
                        <span className="label-text">Update Name</span>
                      </label>
                      <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                    </div>
                    <button className="ml-2 btn btn-info">
                      Save
                    </button>
                  </div>

                  <div className="mx-2"></div>
                  <div className="form-control w-full max-w-xs">
                    <label className="label">
                      <span className="label-text">Update Email</span>
                    </label>
                    <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                  </div>
                  <div className="form-control w-full max-w-xs">
                    <label className="label">
                      <span className="label-text">Update Password</span>
                    </label>
                    <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                  </div>
                </div>
              </div>
              <AdminStatBar />
            </div>
          </div>
        </div>
        <AdminSideBar />
      </div>
    </>
  )
}