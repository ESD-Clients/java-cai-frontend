import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Helper, StudentController } from "../../../controllers/_Controllers";
import { Dots } from "react-activity";
import { CLR_PRIMARY } from "../../../values/MyColor";
import SearchField from "../../../components/SearchField";
import { useNavigate } from "react-router-dom";


export default function StudentList({ user }) {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    let unsubscribe = StudentController.subscribeActiveList(snapshot => {
      setStudents(snapshot.docs);
      setLoading(false);
    })

    return () => unsubscribe();

  }, [])

  function viewItem(item) {
    navigate('/admin/student?'+item.id)
  }

  function checkFilter(item) {
    if (filter) {
      let value = filter.toLowerCase();
      let name = item.data().name.toLowerCase();
      let email = item.data().email.toLowerCase();
      let studentNo = Helper.padIdNo(item.data().studentNo);

      if (name.includes(value) || email.includes(value) || studentNo.includes(value)) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return true;
    }
  }

  return (
    <>
      <div className="flex xl:flex-row flex-col justify-between">
        <div className="w-full lg:pr-8 p-0">
          
        <div className="flex flex-col sm:flex-row justify-between mb-8">
          <div>
            <div className="font-bold uppercase mb-4">Student List</div>
            <div className="font-thin">Total Number of Students:
              <span className="font-bold ml-2">
                {students.length}
              </span>
            </div>
          </div>
          <div className="mt-4 flex flex-row justify-center">
            <SearchField
              setFilter={setFilter}
              placeholder="Search student no, name or email"
            />
          </div>
        </div>

          <div className="divider"></div>
          <div className="overflow-x-auto">
            <div>
              <table className="table table-compact w-full">
                <thead>
                  <tr>
                    <th>Student No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    students.map((item, i) => (
                      checkFilter(item) && (
                        <tr key={i.toString()}>
                          <td>{Helper.padIdNo(item.data().studentNo)}</td>
                          <td>{item.data().name}</td>
                          <td>{item.data().email}</td>
                          <td className="flex gap-2">
                            <button className="btn btn-info btn-sm" onClick={() => viewItem(item)}>
                              View
                            </button>
                          </td>
                        </tr>
                      )
                    ))
                  }
                </tbody>
              </table>
              {
                loading && (
                  <div className="flex justify-center items-center mt-4">
                    <Dots color={CLR_PRIMARY} />
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}