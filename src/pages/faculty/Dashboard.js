import { useEffect, useState } from "react";
import { FacultyController, ModuleController, StudentController } from "../../controllers/_Controllers";
import Loading from "../../modals/Loading";

export default function Dashboard({ user }) {

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

    if (!loaded) fetchData();

  }, [loaded])

  if (!loaded) return <Loading />

  return (
    <>
      <div className="flex xl:flex-row flex-col justify-between">
        <div className="w-full lg:pr-8 p-0">
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="text-2xl font-thin">
              Good Morning,
            </div>
          </div>
        </div>
      </div>
    </>
  )
}