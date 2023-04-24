import { Link, useNavigate } from "react-router-dom";
import { Helper } from "../controllers/_Controllers";
import { clearModal, showConfirmationBox } from "../modals/Modal";

export default function AdminNavBar({ user }) {

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
      <div className="sticky top-0 bg-base-100 shadow-lg py-2">
        <div className="navbar w-full bg-base-100 px-6">

          <div className="navbar-center px-2 mx-2 uppercase ml-16 lg:ml-2">Admin</div>
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
                          alt="Admin Profile"
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
                    <div className="text-xs font-thin">Admin</div>
                  </div>
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                      <path fill="currentColor" d="m7 10l5 5l5-5z" />
                    </svg>
                  </div>
                </label>
                <ul tabIndex="0" className="menu menu-compact dropdown-content p-2 shadow bg-base-200 rounded-box w-52 mt-4 sticky">
                  <li><Link to="/admin/settings">Admin Settings</Link></li>
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