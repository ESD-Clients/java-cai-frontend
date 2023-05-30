import { useEffect, useState } from "react"
import Chart from "react-google-charts";

export default function StudentProgress ({student, modules}) {

  const [modulePie, setModulePie] = useState([]);

  useEffect(() => {

    let finishedModules = 0;

    for(let module of modules) {
      if(student.modules.includes(module.id)) {
        finishedModules++;
      }
    }

    setModulePie([
      ["Status", "Count"],
      ["Finished", finishedModules],
      ["Unfinished", modules.length - finishedModules]

    ])
  }, [student, modules])

  return (
    <div>
      <Chart
        chartType="PieChart"
        data={modulePie}
        options={{
          title: "Module Progress"
        }}
        width={"100%"}
        height={"40rem"}
      />
    </div>
  )
}