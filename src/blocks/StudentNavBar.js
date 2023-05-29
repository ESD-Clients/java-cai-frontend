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
      // let modules = await ModuleController.getApprovedModules();
      // setModules(modules);
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
      <div className="flex flex-row justify-center shadow-lg py-2 bg-base-100 ">
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
                  <li><Link to="/student/room">Room</Link></li>
                  <li><Link to="/student/playground">Playground</Link></li>
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
                  <li><Link to="/student/room">Room</Link></li>
                  <li><Link to="/student/playground">Playground</Link></li>
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