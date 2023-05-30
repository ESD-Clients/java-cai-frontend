import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { ModuleController } from "../../../controllers/_Controllers";



export default function RoomModuleStudents ({modules, students}) {

  const [data, setData] = useState(null);


  const options = {
    chart: {
      title: "Student per Modules",
      // subtitle: "Sales, Expenses, and Profit: 2014-2017",
    },
  };

  function getCurrentModule(student) {

    let current = modules.length > 0 ? modules[0] : null;

    for (let i = 1; i < modules.length; i++) {
      if (ModuleController.isModuleUnlocked({
        student: student,
        lastId: i > 0 ? modules[i - 1].id : ''
      })) {
        current = modules[i];
      }
    }

    return current;
  }

  useEffect(() => {

    if(!modules || !students) return;

    let data = [
      ["Students", "Current", "Finished", "Unfinished"]
    ];

    for(let module of modules) {
      let current = 0;
      let finished = 0;

      for(let student of students) {
        let currentModule = getCurrentModule(student);
        if(currentModule.id === module.id) {
          current++;
        }

        if(student.finishedModules.includes(module.id)) {
          finished++;
        }
      }


      let unfinished = students.length - finished;
      let item = [`Module ${module.data().moduleNo}`, current, finished, unfinished];
      data.push(item);
    }

    setData(data);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if(!data) return null

  return (
    <Chart
      chartType="Bar"
      width="100%"
      height="400px"
      data={data}
      options={options}
    />
  );
}
