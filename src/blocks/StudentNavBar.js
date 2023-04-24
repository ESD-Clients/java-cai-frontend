import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helper, ModuleController } from "../controllers/_Controllers";
import { clearModal, showConfirmationBox } from "../modals/Modal";

export default function StudentNavBar({ user }) {

  const navigate = useNavigate();

  const [loaded, setLoaded] = useState(false);
  const [modules, setModules] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let modules = await ModuleController.getApprovedModules();
      setModules(modules);
      setLoaded(true);
    }

    if (!loaded) fetchData();
  }, [loaded])

  function logout() {

    showConfirmationBox({
      title: "Confirmation",
      message: "Are you sure you want to logout?",
      onYes: () => {
        clearModal();
        Helper.logout();
        navigate("/");
      }
    })
  }

  return (
    <>
      <div className="flex flex-row justify-center shadow-lg py-2 ">
        <div className="lg:max-w-[100rem] w-full m-0">

          <div className="navbar bg-base-100">
            <div className="navbar-start mb-0">

              <div className="dropdown">
                <label tabIndex="0" className="btn btn-ghost lg:hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                  </svg>
                </label>

                {/* Small Screen */}
                <ul tabIndex="0" className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 backdrop-blur-sm rounded-box w-52">
                  <li><div>Dashboard</div></li>
                  <li tabIndex="0" className="">
                    <div>
                      Modules
                      <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                        <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                      </svg>
                    </div>
                    <ul className="p-2 bg-base-200 z-50">
                      {
                        modules.length > 0 ? (
                          modules.map((item, i) => (
                            ModuleController.isModuleUnlocked({
                              student: user,
                              lastId: i > 0 ? modules[i - 1].id : ''
                            }) ? (
                              <li key={i.toString()}>
                                <Link
                                  to={"/student/module?" + item.id}
                                >
                                  {item.data().title}
                                </Link>
                              </li>
                            ) : (
                              <li className="disabled" key={i.toString()}>
                                <span>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M20 12c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5S7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7z" />
                                  </svg>
                                  <span>{item.data().title}</span>
                                </span>
                              </li>
                            )
                          ))
                        ) : (
                          <li>No Module Available</li>
                        )
                      }

                    </ul>
                  </li>
                  <li><Link to="/student/playground">Playground</Link></li>
                  <li><Link to="/student/room">Room</Link></li>
                </ul>
              </div>
              <Link
                className="normal-case btn btn-ghost text-xl font-bold"
                to="/student/dashboard"
              >
                caiJAVA
              </Link>
              {/* Wide Screen */}
              <div className="hidden lg:block">
                <ul className="menu menu-horizontal p-0">
                  <li><Link to="/student/dashboard">Dashboard</Link></li>
                  <li tabIndex="0">
                    <div>
                      Modules
                      <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                        <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                      </svg>
                    </div>
                    <ul className="p-2 bg-base-200 z-50 max-w-[24rem]">
                      {
                        modules.length > 0 ? (
                          modules.map((item, i) => (
                            ModuleController.isModuleUnlocked({
                              student: user,
                              lastId: i > 0 ? modules[i - 1].id : ''
                            }) ? (
                              <li key={i.toString()}>
                                <Link
                                  to={"/student/module?" + item.id}
                                  className="block overflow-hidden whitespace-nowrap text-ellipsis hover:whitespace-normal"
                                >
                                  {item.data().title}
                                </Link>
                              </li>
                            ) : (
                              <li className="disabled" key={i.toString()}>
                                <span className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M20 12c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5S7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7z" />
                                  </svg>
                                  <span className="block overflow-hidden whitespace-nowrap text-ellipsis">{item.data().title}</span>
                                </span>
                              </li>
                            )
                          ))
                        ) : (
                          <li>No Module Available</li>
                        )
                      }
                    </ul>
                  </li>
                  <li><Link to="/student/playground">Playground</Link></li>
                  <li><Link to="/student/room">Room</Link></li>
                </ul>
              </div>
            </div>

            <div className="navbar-end">
              <div className="flex justify-end flex-1">
                <div className="flex items-stretch">
                  <div className="dropdown dropdown-end">
                    <label tabIndex="0" className="btn btn-ghost rounded-btn lg:gap-4 p-0 lg:px-4">
                      <div className="avatar-group">
                        {
                          user.imageUri ? (
                            <img
                              src={user.imageUri}
                              className="avatar h-12 w-12 object-cover"
                              alt="Student Profile"
                            />
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                              <path fill="currentColor" d="M16 8a5 5 0 1 0 5 5a5 5 0 0 0-5-5Z" />
                              <path fill="currentColor" d="M16 2a14 14 0 1 0 14 14A14.016 14.016 0 0 0 16 2Zm7.992 22.926A5.002 5.002 0 0 0 19 20h-6a5.002 5.002 0 0 0-4.992 4.926a12 12 0 1 1 15.985 0Z" />
                            </svg>
                          )
                        }
                      </div>
                      <div className="lg:flex flex-col items-start hidden">
                        <div className="font-bold">
                          {user.name}
                        </div>
                      </div>
                      <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                          <path fill="currentColor" d="m7 10l5 5l5-5z" />
                        </svg>
                      </div>
                    </label>
                    <ul tabIndex="0" className="menu menu-compact dropdown-content p-2 shadow bg-base-200 rounded-box w-52 mt-4">
                      <li><Link to="/student/settings">Account Settings</Link></li>
                      <li><Link to="/student/contact">Contact Us</Link></li>
                      <li><span onClick={logout}>Logout</span></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border border-base-100"></div>
        </div>
      </div>

    </>
  )
}