import { Link, useNavigate } from "react-router-dom";
import { Helper } from "../controllers/_Controllers";
import { clearModal, showConfirmationBox } from "../modals/Modal";

export default function FacultyNavBar({ user }) {

  const navigate = useNavigate();
  
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
      <div className="sticky top-0 backdrop-blur-sm">
        <div className="navbar w-full bg-base-100 px-6">
          <div className="flex-1 lg:hidden">
            <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </label>
          </div>
          <div className="navbar-center px-2 mx-2 uppercase">Faculty</div>
          <div className="flex justify-end flex-1">
            <div className="flex items-stretch">
              <div className="dropdown dropdown-end">
                <label tabIndex="0" className="btn btn-ghost rounded-btn lg:gap-4 p-0 lg:px-4">
                  <div className="avatar">
                    {
                      user && user.image ? (
                        <div className=" h-10 rounded-full">
                          <img src="" alt="" />

                        </div>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
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
                    <div className="text-xs font-thin">Faculty</div>
                  </div>
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                      <path fill="currentColor" d="m7 10l5 5l5-5z" />
                    </svg>
                  </div>
                </label>
                <ul tabIndex="0" className="menu menu-compact dropdown-content p-2 shadow bg-base-200 rounded-box w-52 mt-4 sticky">
                  <li><Link to="/faculty/settings">Faculty Settings</Link></li>
                  <li><span onClick={logout}>Logout</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}