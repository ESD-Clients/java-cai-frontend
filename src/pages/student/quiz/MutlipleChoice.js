export default function MutlipleChoice({item, questionNo}) {

  const choices = item.choices;

  return (
    <div className="shadow-lg rounded-lg mb-4">
      <div className={
        "flex rounded-t-lg p-4 text-white gap-4 "  + (
          item.remarks !== undefined ? (
            item.remarks === 1 ?
              "bg-green-500"
              :
              "bg-red-400"
          ) : "bg-primary"
        )
      }>
        <div className="mt-1 text-xs">{questionNo}.&#41;</div>
        <div className="flex-1 font-semibold">{item.question}</div>
        <div className="text-right text-xs">
          {item.points} Point/s
        </div>
      </div>
      
      <div className="p-4 form-control">
        {
          choices.map ((option, i) => (
            <div
              key={i.toString()}
              className={
                "flex items-center my-1 px-2 rounded-full " + (
                  item.remarks !== undefined && item.studentAnswer === option ? (
                    item.correctAnswer === item.studentAnswer ?
                      "border-green-400 border-2"
                      :
                      "border-red-400 border-2"
                  ) : "border"
                )
              }
            >
              <input
                type="radio"
                id={`${item.id}_${i}`}
                name={item.id}
                className={
                  "radio mr-4 " + (
                    item.remarks !== undefined && item.studentAnswer === option ? (
                      item.correctAnswer === item.studentAnswer ?
                        "checked:bg-green-400 "
                        :
                        "checked:bg-red-400 "
                    ) : "checked:bg-primary"
                  )
                }
                value={option}
                required
                disabled={item.remarks !== undefined}
                checked={item.remarks !== undefined && item.studentAnswer === option ? true : undefined}
              />
              <label htmlFor={`${item.id}_${i}`} className="flex-1 py-2 cursor-pointer">{option}</label>

            </div>
          ))
        }
      </div>
    </div>
  )
}