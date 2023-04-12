import { useState } from "react";
import { Link } from "react-router-dom";

export default function FacultySideBar () {

  const [open, setOpen] = useState(false);

  function toggleDrawer () {
    let element = document.getElementById('drawer');
    if(open) {
      element.style.left = 0;
      setOpen(false);
    }
    else {
      element.style.left = 'auto';
      setOpen(true);
    }
  }

  return (
    <>
      <div className="fixed left-2 top-2 z-20 lg:hidden">
        <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost" onClick={toggleDrawer}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </label>
      </div>
      <div id="drawer" className="fixed drawer-side z-30 transition-all">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
        <ul className="menu overflow-y-auto w-[19rem] bg-base-200 px-3">
          <div className="relative lg:hidden">
            <div className="absolute right-0 top-2">
              <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost" onClick={toggleDrawer}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </label>
            </div>
          </div>
          <div className="flex justify-center ">
            <Link className="btn btn-ghost mb-10 text-2xl font-bold mt-6" to="/faculty/dashboard">
              <span className="lowercase font-thin">cai</span>
              <span className="uppercase">JAVA</span>
            </Link>
          </div>

          <li>
            <Link className="rounded-md" to="/faculty/dashboard">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 5a2 2 0 0 1 2-2h6v18H4a2 2 0 0 1-2-2V5Zm12-2h6a2 2 0 0 1 2 2v5h-8V3Zm0 11h8v5a2 2 0 0 1-2 2h-6v-7Z" />
              </svg>Dashboard
            </Link>
          </li>
          <li>
            <Link className="rounded-md" to="/faculty/modules">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                <path fill="currentColor" d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM10 9h8v2h-8zm0 3h4v2h-4zm0-6h8v2h-8z" />
              </svg>
              Modules
            </Link>
          </li>
          <li>
            <Link className="rounded-md" to="/faculty/students">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                <path fill="currentColor" d="m16 7.78l-.313.095l-12.5 4.188L.345 13L2 13.53v8.75c-.597.347-1 .98-1 1.72a2 2 0 1 0 4 0c0-.74-.403-1.373-1-1.72v-8.06l2 .655V20c0 .82.5 1.5 1.094 1.97c.594.467 1.332.797 2.218 1.093c1.774.59 4.112.937 6.688.937c2.576 0 4.914-.346 6.688-.938c.886-.295 1.624-.625 2.218-1.093C25.5 21.5 26 20.82 26 20v-5.125l2.813-.938L31.655 13l-2.843-.938l-12.5-4.187L16 7.78zm0 2.095L25.375 13L16 16.125L6.625 13L16 9.875zm-8 5.688l7.688 2.562l.312.094l.313-.095L24 15.562V20c0 .01.004.126-.313.375c-.316.25-.883.565-1.625.813C20.58 21.681 18.395 22 16 22c-2.395 0-4.58-.318-6.063-.813c-.74-.247-1.308-.563-1.624-.812C7.995 20.125 8 20.01 8 20v-4.438z" />
              </svg>
              Students
            </Link>
          </li>
          <li>
            <Link className="rounded-md" to="/faculty/rooms">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                  <path d="M5 2h11a3 3 0 0 1 3 3v14a1 1 0 0 1-1 1h-3" />
                  <path d="m5 2l7.588 1.518A3 3 0 0 1 15 6.459V20.78a1 1 0 0 1-1.196.98l-7.196-1.438A2 2 0 0 1 5 18.36V2Zm7 10v2" />
                </g>
              </svg>
              Rooms
            </Link>
          </li>
          {/* <li>
            <Link className="rounded-md" to="/faculty/messages">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                <path fill="currentColor" d="M20 2H4c-1.103 0-2 .894-2 1.992v12.016C2 17.106 2.897 18 4 18h3v4l6.351-4H20c1.103 0 2-.894 2-1.992V3.992A1.998 1.998 0 0 0 20 2z" />
              </svg>Messages
            </Link>
          </li> */}
          {/* <li>
            <Link className="rounded-md" to="/faculty/settings">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                  <path d="M13 2v4l-2 1l-3-3l-4 4l3 3l-1 2H2v6h4l1 2l-3 3l4 4l3-3l2 1v4h6v-4l2-1l3 3l4-4l-3-3l1-2h4v-6h-4l-1-2l3-3l-4-4l-3 3l-2-1V2Z" />
                  <circle cx="16" cy="16" r="4" />
                </g>
              </svg>Faculty Settings
            </Link>
          </li> */}
        </ul>
      </div>
    </>
  )
}