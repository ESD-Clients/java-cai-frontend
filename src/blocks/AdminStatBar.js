import React, { useEffect, useState } from "react";
import { FacultyController, StudentController } from "../controllers/_Controllers";

export default function AdminStatBar () {

  const [loaded, setLoaded] = useState(false);
  const [students, setStudents] = useState([]);
  const [completedStudents, setCompletedStudents] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    async function fetchData () {
      let students = await StudentController.getActiveList();
      setStudents(students);

      let completedStudents = await StudentController.getListByProgress({progress: 100});
      setCompletedStudents(completedStudents);

      let faculties = await FacultyController.getActiveList();
      setFaculties(faculties);

      //TODO: admins, rooms

      setLoaded(true);
    }

    if(!loaded) {
      fetchData();
    }
  }, [loaded])

  return (
    <>
      {/* <?php require('./src/api/admin/dashboard-stats.php') ?> */}

      <div className="lg:block hidden w-fit">
        <div className="sticky top-40 mt-20">
          <div className="stats shadow stats-vertical bg-base-200">
            {/* <!-- * FIRST STAT --> */}
            <div className="stat">
              <div className="stat-figure text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" className="w-8 h-8">
                  <path fill="currentColor" d="M858.5 763.6a374 374 0 0 0-80.6-119.5a375.63 375.63 0 0 0-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1c-.4.2-.8.3-1.2.5c-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 0 0-80.6 119.5A371.7 371.7 0 0 0 136 901.8a8 8 0 0 0 8 8.2h60c4.4 0 7.9-3.5 8-7.8c2-77.2 33-149.5 87.8-204.3c56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 0 0 8-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z" />
                </svg>
              </div>
              <div className="stat-title">Total Students</div>
              <div className="stat-value text-primary">
                {students.length}
                {/* <?php echo $studentDataStat; ?> */}
              </div>
            </div>

            {/* <!-- * SECOND STAT --> */}



            <div className="stat">
              <div className="stat-figure">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="w-8 h-8">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.25 9.25V6L8 2.75L1.75 6L8 9.25l3.25-1.5v3.5c0 1-1.5 2-3.25 2s-3.25-1-3.25-2v-3.5" />
                </svg>
              </div>
              <div className="stat-title">Finished Students</div>
              <div className="stat-value">
                {
                  students.length > 0 ? (
                    ((completedStudents.length / students.length) * 100).toFixed(0)
                  ) : 0
                }
                %
                {/* <?php
                echo (($completedStudentDataStat / $studentDataStat) * 100);
                    ?>
                % */}
              </div>
            </div>

            {/* <!-- * 3RD STAT --> */}

            <div className="stat">
              <div className="stat-figure text-accent">
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1.25em" height="1em" preserveAspectRatio="xMidYMid meet" className="w-8 h-8" viewBox="0 0 640 512">
                  <path fill="currentColor" d="M208 352c-2.39 0-4.78.35-7.06 1.09C187.98 357.3 174.35 360 160 360c-14.35 0-27.98-2.7-40.95-6.91c-2.28-.74-4.66-1.09-7.05-1.09C49.94 352-.33 402.48 0 464.62C.14 490.88 21.73 512 48 512h224c26.27 0 47.86-21.12 48-47.38c.33-62.14-49.94-112.62-112-112.62zm-48-32c53.02 0 96-42.98 96-96s-42.98-96-96-96s-96 42.98-96 96s42.98 96 96 96zM592 0H208c-26.47 0-48 22.25-48 49.59V96c23.42 0 45.1 6.78 64 17.8V64h352v288h-64v-64H384v64h-76.24c19.1 16.69 33.12 38.73 39.69 64H592c26.47 0 48-22.25 48-49.59V49.59C640 22.25 618.47 0 592 0z" />
                </svg>
              </div>
              <div className="stat-title">Total Faculty</div>
              <div className="stat-value text-accent">
                {faculties.length}
              </div>
            </div>

            {/* <!-- * 4TH STAT --> */}
            <div className="stat">
              <div className="stat-figure text-warning">
                <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 20">
                  <path fill="currentColor" d="M10 9.25c-2.27 0-2.73-3.44-2.73-3.44C7 4.02 7.82 2 9.97 2c2.16 0 2.98 2.02 2.71 3.81c0 0-.41 3.44-2.68 3.44zm0 2.57L12.72 10c2.39 0 4.52 2.33 4.52 4.53v2.49s-3.65 1.13-7.24 1.13c-3.65 0-7.24-1.13-7.24-1.13v-2.49c0-2.25 1.94-4.48 4.47-4.48z" />
                </svg>
              </div>
              <div className="stat-title">Total Admin</div>
              <div className="stat-value text-warning">
                {admins.length}
              </div>
            </div>

            {/* <!-- * 5TH STAT --> */}
            <div className="stat">
              <div className="stat-figure text-error">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="w-8 h-8">
                  <path fill="currentColor" d="M10 7.998a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0ZM7.598 2.01A.5.5 0 0 0 7 2.5v10.997a.5.5 0 0 0 .598.49l5-1a.5.5 0 0 0 .402-.49V3.5a.5.5 0 0 0-.402-.49l-5-1ZM8 12.887V3.11l4 .8v8.177l-4 .8Zm-2 .11v-1H4V4h2V3H3.5a.5.5 0 0 0-.5.5v8.997a.5.5 0 0 0 .5.5H6Z" />
                </svg>
              </div>
              <div className="stat-title">Active Rooms</div>
              <div className="stat-value text-error">
                {rooms.length}
              </div>
            </div>
            {/* <!-- * ADD MORE STAT BELOW --> */}
          </div>
        </div>
      </div>
    </>
  )
}