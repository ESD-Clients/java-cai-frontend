import { useEffect, useState } from "react";
import { clearModal, showLoading, showMessageBox } from "../modals/Modal";
import { AdminController, FacultyController, Helper, StudentController } from "../controllers/_Controllers";
import { Link, useNavigate } from "react-router-dom";

export default function Home () {
  
  const navigate = useNavigate();
  const user = Helper.getCurrentUser();

  const [tab, setTab] = useState("student");

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

    let result = false;

    if(tab === "student") {
      result = await StudentController.authenticate({
        email: email,
        password: password
      })
    }
    else if(tab === "faculty") {
      result = await FacultyController.authenticate({
        email: email,
        password: password
      })
    }
    else if(tab === "admin") {
      result = await AdminController.authenticate({
        email: email,
        password: password
      })
    }

  

    if(result && result.id) {

      result.type = tab;
      Helper.setCurrentUser(result);
      e.target.reset();
      clearModal();
      // showMessageBox({
      //   type: "success",
      //   message: "Login Success!"
      // });

      navigate(`/${tab}`);

      
    }
    else {
      showMessageBox({
        type: "danger",
        title: "Error",
        message: result.code,
        onPress: () => {
          document.getElementById("login").click();
        }
      });
    }
  }

  return (
    <>
      <input type="checkbox" id="login" className="modal-toggle" />
      <label className="modal modal-bottom sm:modal-middle" htmlFor="login">
        <div className="flex flex-col items-center w-full">
          <div className="flex items-start lg:justify-start lg:w-96">
            <div className="tabs bg-base-200 rounded-t-md">
              <div 
                className={"tab tab-lifted " + (tab === "student" ? "tab-active" : "")} 
                id="studentTab"
                onClick={(e) => {
                  e.preventDefault();
                  setTab("student");
                }}
              >
                Student
              </div>
              <div
                className={"tab tab-lifted " + (tab === "faculty" ? "tab-active" : "")} 
                id="studentTab"
                onClick={(e) => {
                  e.preventDefault();
                  setTab("faculty");
                }}
              >
                Faculty
              </div>
              <div 
                className={"tab tab-lifted " + (tab === "admin" ? "tab-active" : "")} 
                id="studentTab"
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
                {
                  tab === "student" ? (" Student") :
                  tab === "faculty" ? (" Faculty") :
                  tab === "admin" ? (" Admin") :
                  ""
                }
              </h3>
            </div>
            <form id="loginForm" onSubmit={login}>
              <div className="form-control">
                <label className="input-group">
                  <span>Email</span>
                  <input 
                    type="text" name="email" className="input input-bordered w-full" id="emailInput" required />
                </label>
              </div>
              <div className="my-3"></div>
              <div className="form-control">
                <label className="input-group">
                  <span>Password</span>
                  <input type="password" name="password" className="input input-bordered w-full" id="passwordInput" required />
                </label>
              </div>
              <div id="errorPlaceholder"></div>
              <div className="mt-6 flex flex-row items-center justify-end">
                <button type="submit" className="btn btn-primary">Login</button>
              </div>
            </form>
          </label>
        </div>
      </label>

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

      <section>
        <div className="p-5">
          <div className="flex items-center justify-center flex-row">
            <div>
              <h1 className="text-3xl">Become a <span className="text-warning"> Java Developer </span></h1>
              <p className="my-4 block">
                We focus on teaching our students the fundamentals of the latest
                <br className="lg:block hidden" />
                and greatest technologies to prepare them for their first dev role
              </p>
              <Link 
                className="btn btn-primary"
                to="/enroll"
              >
                Start The Enrollment
              </Link>
            </div>
            <div className="w-2/5 hidden lg:block">
              <svg id="ab47acfe-844d-4101-aa7b-df38aa50dbe4" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 971.0518 628.38145">
                <path d="M847.93141,636.215h0a249.62642,249.62642,0,0,1-2.09461-54.11121l2.09461-29.88879h0c-11.54175,22.96552-8.93335,53.1922,0,83.99994Z" transform="translate(-114.4741 -135.80928)" fill="#cacaca" />
                <path d="M856.93141,641.215h0a183.49726,183.49726,0,0,1-1.00781-32.209l1.00781-17.791h0C851.37831,604.885,852.63331,622.877,856.93141,641.215Z" transform="translate(-114.4741 -135.80928)" fill="#cacaca" />
                <path d="M896.93606,663.21738v10a3.01557,3.01557,0,0,1-3,3h-5a.99647.99647,0,0,0-1,1v82a3.01557,3.01557,0,0,1-3,3h-61a3.0023,3.0023,0,0,1-3-3v-82a1.003,1.003,0,0,0-1-1h-6a3.0023,3.0023,0,0,1-3-3v-10a2.99585,2.99585,0,0,1,3-3h80A3.009,3.009,0,0,1,896.93606,663.21738Z" transform="translate(-114.4741 -135.80928)" fill="#f2f2f2" />
                <rect x="706.5518" y="542.50808" width="67" height="3" fill="#e6e6e6" />
                <path d="M887.93606,722.46217c-22.41974,9.27794-45.084,9.38019-68,0V701.327a106.78989,106.78989,0,0,1,68,0Z" transform="translate(-114.4741 -135.80928)" fill="#e6e6e6" />
                <circle cx="451.48125" cy="213.98538" r="36.39575" fill="#2f2e41" />
                <path d="M576.09529,314.40075a36.40078,36.40078,0,0,1,32.03936,53.66882,36.38707,36.38707,0,1,0-60.4544-39.98248A36.306,36.306,0,0,1,576.09529,314.40075Z" transform="translate(-114.4741 -135.80928)" fill="#2f2e41" />
                <circle cx="383.4705" cy="106.99576" r="106.91249" fill="#2f2e41" />
                <path d="M414.03572,176.47092A106.89327,106.89327,0,0,1,562.20289,165.261c-.87427-.83106-1.73926-1.66886-2.6477-2.47643a106.91251,106.91251,0,0,0-142.0661,159.80724c.90844.80758,1.84179,1.56848,2.76953,2.33935A106.89336,106.89336,0,0,1,414.03572,176.47092Z" transform="translate(-114.4741 -135.80928)" fill="#2f2e41" />
                <circle cx="382.5645" cy="144.14332" r="68.85889" fill="#ffb8b8" />
                <path d="M532.21437,367.50466l-73.68847,3.31269s6.15038,38.10812-33.71528,41.73229-76.10721-7.24829-90.60382,19.93283-8.24829,123.96607-8.24829,123.96607,27.18115,97.85211,48.92605,112.34875,212.01291-5.43622,212.01291-5.43622L666.5259,562.81735l-2.697-77.53951c-1.40839-40.49105-38.37693-70.89154-78.1935-63.39829q-1.17287.22073-2.36205.47539s-8.74743-6.53759-32.74743-18.53759C535.8492,396.479,532.21437,367.50466,532.21437,367.50466Z" transform="translate(-114.4741 -135.80928)" fill="#cacaca" />
                <path d="M372.26039,410.73757s17.5138,31.77787,10.26551,77.07978,23.164,141.11428,23.164,141.11428l21.74494-5.43622s-14.49662-94.228-10.87244-115.9729,4.62414-85.91251-13.49661-96.78494S372.26039,410.73757,372.26039,410.73757Z" transform="translate(-114.4741 -135.80928)" fill="#2f2e41" />
                <path d="M581.99873,427.39977l7.61682,200.62579,14.49658,9.06037s20.83887-220.16727,9.96643-220.16727H591.95607a9.97041,9.97041,0,0,0-9.9704,9.97043Q581.98567,427.14457,581.99873,427.39977Z" transform="translate(-114.4741 -135.80928)" fill="#2f2e41" />
                <circle cx="301.18217" cy="479.53178" r="9.06039" fill="#0d6efd" />
                <circle cx="482.38982" cy="488.59217" r="9.06038" fill="#0d6efd" />
                <polygon points="323.672 58.069 323.672 126.928 339.619 126.928 359.914 105.183 357.196 126.928 427.685 126.928 423.336 105.183 432.034 126.928 443.269 126.928 443.269 58.069 323.672 58.069" fill="#2f2e41" />
                <ellipse cx="312.79955" cy="129.6467" rx="5.43622" ry="9.96642" fill="#ffb8b8" />
                <ellipse cx="452.32945" cy="129.6467" rx="5.43622" ry="9.96642" fill="#ffb8b8" />
                <path d="M717.62587,744.25542v6.07a13.34036,13.34036,0,0,1-.91,4.87,13.68347,13.68347,0,0,1-.97,2,13.4372,13.4372,0,0,1-11.55,6.56h-446.55a13.43737,13.43737,0,0,1-11.55-6.56,13.68965,13.68965,0,0,1-.97-2,13.34125,13.34125,0,0,1-.91-4.87v-6.07a13.42638,13.42638,0,0,1,13.42282-13.43h25.74717v-2.83a.55906.55906,0,0,1,.55816-.56h13.43183a.5591.5591,0,0,1,.56.55817v2.83185h8.39v-2.83a.55906.55906,0,0,1,.55816-.56h13.43183a.5591.5591,0,0,1,.56.55817v2.83185h8.4v-2.83a.55906.55906,0,0,1,.55817-.56h13.43182a.5591.5591,0,0,1,.56.55817v2.83185h8.39v-2.83a.55906.55906,0,0,1,.55817-.56h13.43182a.5591.5591,0,0,1,.56.55817v2.83185h8.39v-2.83a.55907.55907,0,0,1,.55817-.56h13.43182a.5591.5591,0,0,1,.56.55817v2.83185h8.4v-2.83a.55906.55906,0,0,1,.55816-.56h13.43183a.5591.5591,0,0,1,.56.55817v2.83185h8.39v-2.83a.55908.55908,0,0,1,.55817-.56H526.80586a.55908.55908,0,0,1,.56.55817v2.83185h8.4v-2.83a.55908.55908,0,0,1,.55817-.56h13.43182a.5655.5655,0,0,1,.56.56v2.83h8.39v-2.83a.55908.55908,0,0,1,.55817-.56h13.43182a.55908.55908,0,0,1,.56.55817v2.83185h8.39v-2.83a.55908.55908,0,0,1,.55816-.56h13.43183a.55908.55908,0,0,1,.56.55817v2.83185h8.4v-2.83a.55908.55908,0,0,1,.55816-.56h13.43183a.557.557,0,0,1,.55.56v2.83h8.4v-2.83a.55908.55908,0,0,1,.55817-.56h13.43182a.55908.55908,0,0,1,.56.55817v2.83185h8.39v-2.83a.55908.55908,0,0,1,.55817-.56h13.43182a.55908.55908,0,0,1,.56.55817v2.83185h39.17a13.42639,13.42639,0,0,1,13.43,13.42273Z" transform="translate(-114.4741 -135.80928)" fill="#3f3d56" />
                <rect y="626.38145" width="971.0518" height="2" fill="#3f3d56" />
                <path d="M681.66835,488.62124H272.6248a11.2586,11.2586,0,0,0-11.25861,11.2586V727.79131A11.25867,11.25867,0,0,0,272.62477,739.05H681.66835a11.25866,11.25866,0,0,0,11.2586-11.25867V499.87984a11.2586,11.2586,0,0,0-11.2586-11.2586Z" transform="translate(-114.4741 -135.80928)" fill="#3f3d56" />
                <circle cx="362.99998" cy="432.38142" r="25" fill="#0d6efd" />
                <polygon points="517.763 267.219 643.969 140.016 703.552 140.016 703.552 138.016 643.134 138.016 642.841 138.313 516.341 265.813 517.763 267.219" fill="#3f3d56" />
                <rect x="776.32793" y="87.79227" width="146.22388" height="13.02985" fill="#0d6efd" />
                <path d="M872.981,244.87035H842.02589V213.91478H872.981Zm-28.95508-2H870.981V215.91478H844.02589Z" transform="translate(-114.4741 -135.80928)" fill="#3f3d56" />
                <rect x="776.32793" y="131.2251" width="146.22388" height="13.02985" fill="#0d6efd" />
                <path d="M872.981,288.303H842.02589V257.34789H872.981Zm-28.95508-2H870.981V259.34789H844.02589Z" transform="translate(-114.4741 -135.80928)" fill="#3f3d56" />
                <rect x="776.32793" y="174.65794" width="146.22388" height="13.02985" fill="#0d6efd" />
                <path d="M872.981,331.73558H842.02589V300.78051H872.981Zm-28.95508-2H870.981V302.78051H844.02589Z" transform="translate(-114.4741 -135.80928)" fill="#3f3d56" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="my-8 px-2 py-8 bg-base-100">
        <div className="flex justify-center max-w-[1280px] mx-auto">
          <div className="container">
            <div className="flex flex-col items-center">
              <div className="text-2xl">Frequently Asked Questions</div>
              <div className="divider"></div>
              <div tabIndex="0" className="collapse collapse-arrow border border-base-300 bg-base-100 w-full">
                <div className="collapse-title text-xl font-medium">
                  What do I need to know?
                </div>
                <div className="collapse-content">
                  <p>Nothing! Here you can learn the basics of programming and logic using Java Programming Language!</p>
                </div>
              </div>
              <div tabIndex="0" className="collapse collapse-arrow border border-base-300 bg-base-100 w-full">
                <div className="collapse-title text-xl font-medium">
                  How do I sign up?
                </div>
                <div className="collapse-content">
                  <p>Enroll using this link! <span className="link link-info">Enroll Here!</span></p>
                </div>
              </div>
              <div tabIndex="0" className="collapse collapse-arrow border border-base-300 bg-base-100 w-full">
                <div className="collapse-title text-xl font-medium">
                  How much this cost to attend?
                </div>
                <div className="collapse-content">
                  <p>Nothing! Just start and learn Java Programming using this site!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
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
