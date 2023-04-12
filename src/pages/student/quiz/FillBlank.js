
export default function FillBlank ({item, questionNo}) {

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
          item.remarks !== undefined ? (
            <div 
              className={"textarea textarea-bordered w-full border-2 " + (
                item.remarks === 1  ? "border-green-400" : "border-red-400 "
              )}
            >
              {item.studentAnswer}
            </div>
          ) : (
            <input 
              name={item.id}
              type="text" 
              placeholder=""
              className="input input-bordered w-full"
              required
              disabled={item.remarks !== undefined}
            />
          )
        }
      </div>
    </div>
  )
}