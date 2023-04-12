import { useEffect, useState } from "react";
import { clearModal, showLoading, showMessageBox } from "../modals/Modal";
import { AdminController, FacultyController, Helper, StudentController } from "../controllers/_Controllers";
import { Link, useNavigate } from "react-router-dom";
import PasswordField from "../components/PasswordField";
import LoginModal from "../components/LoginModal";

export default function Enroll () {
  
  const navigate = useNavigate();
  const user = Helper.getCurrentUser();

  /** REGISTER */
  const [image, setImage] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const [imgSource, setImgSource] = useState("");

  useEffect(() => {
    if(user) {
      navigate(`/${user.type}`);
    }
  }, [user])

  async function login (e) {
    e.preventDefault();

    document.getElementById("login").click();
    showLoading({
      message: "Logging in..."
    })

    let email = e.target.email.value;
    let password = e.target.password.value;
    let type = e.target.type.value;

    let result = false;

    if(type === "student") {
      result = await StudentController.authenticate({
        email: email,
        password: password
      })
    }
    else if(type === "faculty") {
      result = await FacultyController.authenticate({
        email: email,
        password: password
      })
    }
    else if(type === "admin") {
      result = await AdminController.authenticate({
        email: email,
        password: password
      })
    }

    if(result && result.id) {

      result.type = type;
      Helper.setCurrentUser(result);
      e.target.reset();
      clearModal();
      navigate(`/${type}`);
    }
    else {
      showMessageBox({
        type: "danger",
        message: "Incorrect email or password!",
        onPress: () => {
          document.getElementById("login").click();
        }
      });
    }
  }

  async function enroll (e) {
    e.preventDefault();

    if(e.target.password.value !== e.target.retype.value) {
      showMessageBox({
        title: "Error",
        type: "danger",
        message: "Password didn't match!"
      });
      return;
    }

    if(!Helper.isPasswordValid(e.target.password.value)) {
      showMessageBox({
        title: "Error",
        type: "danger",
        message: "Password must be 8-16 characters long and contain at least one uppercase letter, one lowercase letter, and one number."
      });
      return;
    }

    showLoading({
      message: "Enrolling..."
    })


    let data = Helper.getEventFormData(e);
    data.finishedModules = [];

    if(imgFile) {
      let imageUri = await StudentController.uploadFile(imgFile, 'image/student/profile');
      data.image = imageUri;
    }

    let result = await StudentController.register(data);
    clearModal();
    
    if (result && result.id) {
      navigate("/");
      showMessageBox({
        title: "Success",
        message: "Enrollment Success",
        type: "success",
        onPress: () => {
          // document.getElementById("btnBack").click();
        }
      })
    }
    else {
      showMessageBox({
        title: "Error",
        message: result.message,
        type: "danger",
        onPress: () => {
          
        }
      });
    }
  }

  return (
    <>
      <LoginModal onSubmit={login} />

      <div className="flex flex-row justify-center bg-base-200 sticky top-0">
        <div className="container">
          <div className="navbar">
            <div className="flex-1">
              <Link 
                className="btn btn-ghost text-2xl font-bold" 
                to="/"
              >
                <span className="lowercase font-thin">cai</span>
                <span className="uppercase">JAVA</span>
              </Link>
            </div>
            <div className="flex-none">
              <ul className="menu menu-horizontal p-0 gap-x-2">
                <li><label htmlFor="login" className="btn btn-primary rounded text-white">Login</label></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <section className="min-h-[85vh]">
        <form className="flex flex-col justify-start items-center mb-16" onSubmit={enroll}>
          <div className="input-group items-start my-4 w-[40rem]">
            <label className="text-right w-32 mr-8">Avatar:</label>
            <div className="flex flex-col items-center">
              <input 
                className="w-0 h-0" 
                type="file"
                id="image"
                value={image}
                onChange={ e => {
                  setImage(e.target.value);
                  if(e.target.files.length > 0) {
                    setImgFile(e.target.files[0]);
                    setImgSource(URL.createObjectURL(e.target.files[0]));
                  }
                  else {
                    setImgFile(null);
                  }
                }}
              />
              <div className="h-64 w-64 flex justify-center items-center border border-dashed rounded-full">
                {
                  image ? (
                    <img
                      src={imgSource}
                      className="h-64 w-64 rounded-full p-[1px] object-cover"
                    />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-image" viewBox="0 0 16 16"> 
                      <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/> 
                      <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/> 
                    </svg>
                  )
                }
              </div>
              <div className="space-x-2 mt-4">
                <label className="btn" htmlFor="image">Choose Photo</label>
                <label className="btn" onClick={() => {
                  setImage('')
                  setImgFile(null)
                  setImgSource(null)
                }}>Remove Photo</label>
              </div>
            </div>
          </div>
          <div className="input-group items-center my-4 w-[40rem]">
            <label className="text-right w-32 mr-8">Account Name:</label>
            <input className="input flex-1" name="name" required />
            <label className="ml-2 text-red-500">*</label>
          </div>
          <div className="input-group items-center my-4 w-[40rem]">
            <label className="text-right w-32 mr-8">Email:</label>
            <input className="input flex-1" name="email" type="email" required />
            <label className="ml-2 text-red-500">*</label>
          </div>
          <div className="input-group items-center my-4 w-[40rem]">
            <label className="text-right w-32 mr-8">Password:</label>
            <PasswordField
              name="password"
              containerClass="flex-1"
              className="rounded-none border-none"
              required
            />
            <label className="ml-2 text-red-500">*</label>
          </div>
          <div className="input-group items-center my-4 w-[40rem]">
            <label className="text-right w-32 mr-8">Confrim Password:</label>
            <PasswordField
              name="retype"
              containerClass="flex-1"
              className="rounded-none border-none"
              required
            />
            <label className="ml-2 text-red-500">*</label>
          </div>
          <div className="input-group items-center my-4 w-[40rem]">
            <label className="text-right w-32 mr-8">Date of Birth:</label>
            <input className="input flex-1" name="date_of_birth" type="date" max="2020-12-31" required />
            <label className="ml-2 text-red-500">*</label>
          </div>

          <div className="input-group items-center my-4 w-[40rem]">
            <label className="text-right w-32 mr-8">School:</label>
            <input className="input flex-1" name="school" />
            <label className="ml-2 text-transparent">*</label>
          </div>
          {/* <div className="input-group items-center my-4 w-[40rem]">
            <label className="text-right w-32 mr-8">Grade:</label>
            <input className="input flex-1" name="grade" />
            <label className="ml-2 text-transparent">*</label>
          </div>
          <div className="input-group items-center my-4 w-[40rem]">
            <label className="text-right w-32 mr-8">Section:</label>
            <input className="input flex-1" name="section" />
            <label className="ml-2 text-transparent">*</label>
          </div> */}

          <div className="w-[40rem] form-control items-end">
            <p>All forms marked with red asterisk (<span className="text-red-500">*</span>) are required.</p>
            <button className="btn btn-info mt-4">Sign Up</button>
          </div>
        </form>
      </section>

      <footer className="w-full">
        <div className="footer max-w-[1280px] mx-auto py-4 border-t border-base-300">
          <div className="items-center grid-flow-col">
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" className="fill-current">
              <path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path>
            </svg>
            <p>A thesis presentation <br />By: Centeno, Deducin and Magnaye</p>
          </div>
          <div className="md:place-self-center md:justify-self-end">
            <div className="grid grid-flow-col gap-4">
              <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg></span>
              <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
              </svg></span>
              <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg></span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
