import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminNavBar from "../../components/AdminNavBar";
import AdminSideBar from "../../components/AdminSideBar";
import AdminStatBar from "../../components/AdminStatBar";
import { FacultyController, Helper, ModuleController, StudentController } from "../../controllers/_Controllers";
import Loading from "../../modals/Loading";

export default function Dashboard({ user }) {

  const navigate = useNavigate();

  const [loaded, setLoaded] = useState(false);

  const [students, setStudents] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [modules, setModules] = useState([]);
  const [rooms, setRooms] = useState([]);


  useEffect(() => {
    async function fetchData() {

      let students = await StudentController.getActiveList();
      setStudents(students);
      
      let faculties = await FacultyController.getActiveList();
      setFaculties(faculties);

      let modules = await ModuleController.getList();
      setModules(modules);
      
      setLoaded(true);
    }

    if(!loaded) fetchData();

  }, [loaded])

  if(!loaded) return <Loading />

  return (
    <>
      <div className="drawer drawer-mobile">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <div className="p-6">
            <div className="flex xl:flex-row flex-col justify-between">
              <div className="w-full lg:pr-8 p-0">
                <div className="flex flex-col items-center justify-center mb-8">
                  <div className="text-2xl font-thin">
                    Good Morning, {user.name}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}