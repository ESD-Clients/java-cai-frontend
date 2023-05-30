import { useEffect } from "react";
import { clearModal, showLoading, showMessageBox } from "../modals/Modal";
import { AdminController, FacultyController, Helper, LearnerController, SchoolController, StudentController } from "../controllers/_Controllers";
import { Link, useNavigate } from "react-router-dom";
import LoginModal from "../blocks/LoginModal";
import Footer from "../blocks/Footer";
import ContactUsForm from "../blocks/ContactUsForm";

export default function ContactUs() {

  const navigate = useNavigate();
  const user = Helper.getCurrentUser();

  useEffect(() => {
    if (user) {
      navigate(`/${user.type}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function login(e) {
    e.preventDefault();

    document.getElementById("login").click();
    showLoading({
      message: "Logging in..."
    })

    let email = e.target.email.value;
    let password = e.target.password.value;
    let type = e.target.type.value;

    let result = false;

    if(type === "learner") {
      result = await LearnerController.authenticate({
        email: email,
        password: password
      })
    }
    else if (type === "student") {
      result = await StudentController.authenticate({
        email: email,
        password: password
      })
      let school = await SchoolController.get(result.school);
      result.school = school;
    }
    else if (type === "faculty") {
      result = await FacultyController.authenticate({
        email: email,
        password: password
      })
      let school = await SchoolController.get(result.school);
      result.school = school;
    }
    else if (type === "admin") {
      result = await AdminController.authenticate({
        email: email,
        password: password
      })
    }

    if (result && result.id) {

      result.type = type;
      Helper.setCurrentUser(result);
      e.target.reset();
      clearModal();

      navigate(`/${type}`);

    }
    else {
      showMessageBox({
        type: "danger",
        title: "Error",
        message: result.message,
        onPress: () => {
          document.getElementById("login").click();
        }
      });
    }
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">
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

        <div className="flex-1">
          <ContactUsForm user={user} />
        </div>
        
        <Footer />
      </div>
    </>
  );
}
