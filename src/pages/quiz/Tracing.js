import { getDifficulty } from "../../controllers/_Helper";

export default function Tracing ({item, questionNo}) {

  return (
    <div className="shadow-lg rounded-lg mb-4">
      <div className={
        "flex rounded-t-lg p-4 gap-4 "  + (
          item.remarks !== undefined ? (
            item.remarks === 1 ?
              "bg-green-500"
              :
              "bg-red-400"
          ) : "bg-primary"
        )
      }>
        {
          item.remarks === undefined && <div className="mt-1 text-xs">{questionNo}.&#41;</div>
        }
        <div className="flex-1">
          <div className="text-white mb-2">{item.question}</div>
          <div className="whitespace-pre textarea">{item.code}</div>
        </div>
        <div className="text-white">
          <div className="text-right text-xs">Difficulty: {getDifficulty(item.difficulty)}</div>
          <div className="text-right text-xs">
            <div>
              {item.points} Point/s
            </div>
            {
              item.remarks !== undefined && item.remarks > -1 && (
                <div className="text-sm font-bold">
                  Score: {item.remarks}
                </div>
              )
            }
          </div>
        </div>
      </div>
      
      <div className="p-4 form-control">

        {
          item.remarks !== undefined ? (
            <div 
              className={"textarea textarea-bordered w-full border-2 whitespace-pre " + (
                item.remarks === 1  ? "border-green-400" : "border-red-400 "
              )}
            >
              {item.studentAnswer}
            </div>
          ) : (
            <textarea 
              name={item.id}
              type="text" 
              placeholder=""
              className="textarea textarea-bordered w-full"
              required
              disabled={item.remarks !== undefined}
            />
          )
        }
      </div>
    </div>
  )
}