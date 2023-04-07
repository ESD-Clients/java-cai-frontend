import { useEffect, useState } from "react";
import { StudentController } from "../../controllers/_Controllers";
import { getDocData } from "../../controllers/_Helper";
import RoomList from "./RoomList";
import RoomView from "./RoomView";

export default function Room ({user}) {

  
  const [student, setStudent] = useState(user);

  useEffect(() => {
    const unsubscribeStudent = StudentController.subscribeDoc(user.id, (snapshot) => {
      let user = getDocData(snapshot);

      setStudent(user);
    })

    return () => unsubscribeStudent();
  }, [])

  return (
    <>
      {
        student.currentRoom ? (
          <RoomView student={student} />
        ) : (
          <RoomList student={student}/>
        )
      }
    </>
  )
}