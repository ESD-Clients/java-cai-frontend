import { useState } from "react";
import PasswordField from "../components/PasswordField";
import TextField from "../components/TextField";
import { clearModal, showLoading, showMessageBox } from "../modals/Modal";
import { AdminController } from "../controllers/_Controllers";

export default function LoginModal({onSubmit}) {

  const [tab, setTab] = useState('learner');

  function toggleForgotPassword () {

    document.getElementById("login").click();
    
    document.getElementById("forgot-password").click();
  }

  async function forgotPassword (e) {
    e.preventDefault();
    document.getElementById("forgot-password").click();

    showLoading({
      message: "Submitting..."
    })
    let email = e.target.email.value;
    let res = await AdminController.resetPassword(email);
    clearModal();
    
    if(res === true) {
      showMessageBox({
        title: "Message",
        type: "success",
        message: "A reset link has been sent to your email."
      })
    }
    else {
      showMessageBox({
        title: "Error",
        type: "danger",
        message: res.message
      })
    }

    e.target.reset();
  }
  return (
    <>
      <input type="checkbox" id="login" className="modal-toggle" />
      <label className="modal modal-bottom sm:modal-middle" htmlFor="login">
        <div className="flex flex-col items-center w-full">
          <div className="flex items-start lg:justify-start lg:w-96">
            <div className="tabs bg-base-200 rounded-t-md">
              
              <div
                className={
                  "tab tab-lifted " + (tab === "learner" ? "tab-active" : "")
                }
                onClick={(e) => {
                  e.preventDefault();
                  setTab("learner");
                }}
              >
                Learner
              </div>
              <div
                className={
                  "tab tab-lifted " + (tab === "student" ? "tab-active" : "")
                }
                onClick={(e) => {
                  e.preventDefault();
                  setTab("student");
                }}
              >
                Student
              </div>
              <div
                className={
                  "tab tab-lifted " + (tab === "faculty" ? "tab-active" : "")
                }
                onClick={(e) => {
                  e.preventDefault();
                  setTab("faculty");
                }}
              >
                Faculty
              </div>
              <div
                className={
                  "tab tab-lifted " + (tab === "admin" ? "tab-active" : "")
                }
                onClick={(e) => {
                  e.preventDefault();
                  setTab("admin");
                }}
              >
                Admin
              </div>
            </div>
          </div>
          <label className="modal-box" htmlFor="">
            <div className="w-full flex justify-center">
              <h3 className="font-bold text-lg my-4" id="modalTitle">
                Login as
                {tab === "student"
                  ? " Student"
                  : tab === "faculty"
                  ? " Faculty"
                  : tab === "admin"
                  ? " Admin"
                  : tab === "learner"
                  ? " Learner"
                  : ""}
              </h3>
            </div>
            <form id="loginForm" onSubmit={onSubmit}>
              <input
                className="w-0 h-0"
                name="type"
                value={tab}
                onChange={() => {}}
              />
              <div className="form-control">
                <label className="input-group">
                  <span>Email</span>
                  <TextField
                    className="rounded-l-none"
                    type="email"
                    name="email"
                  />
                </label>
              </div>
              <div className="my-3"></div>
              <div className="form-control">
                <label className="input-group">
                  <span>Password</span>
                  <PasswordField className="rounded-l-none" name="password" />
                  {/* <input type="password" name="password" className="input input-bordered w-full" id="passwordInput" required /> */}
                </label>
              </div>
              <div id="errorPlaceholder"></div>
              <div className="mt-6 flex flex-row items-center justify-end">
                <div 
                  className="link link-primary"
                  onClick={toggleForgotPassword}
                >
                  Forgot Password?
                </div>
              </div>
              <div className="mt-6 flex flex-row items-center justify-end">
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
              </div>
            </form>
          </label>
        </div>
      </label>


      <input type="checkbox" id="forgot-password" className="modal-toggle" />
      <label className="modal modal-bottom sm:modal-middle" htmlFor="forgot-password">
        <div className="flex flex-col items-center w-full">
          <label className="modal-box" htmlFor="">
            <h3 className="font-bold text-lg my-4" id="modalTitle">
              Forgot Password
            </h3>
            <form onSubmit={forgotPassword}>
              <div className="form-control">
                <label className="input-group">
                  <span>Email</span>
                  <TextField
                    className="rounded-l-none"
                    type="email"
                    name="email"
                  />
                </label>
              </div>
              <div className="mt-6 flex flex-row items-center justify-end">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>
          </label>
        </div>
      </label>
    </>
  );
}
