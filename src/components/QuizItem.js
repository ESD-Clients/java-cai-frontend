import Editor from "@monaco-editor/react";
import { useState } from "react";

export default function QuizItem ({item, index}) {

  const [answer, setAnswer] = useState('');


  if(item.type === "choices") {


    let choices = item.choices;

    return (
      <div>
        <div>{(index + 1).toString() + ". " + item.question}</div>
        <div className="form-control">
          <label 
            className={
              item.remarks !== undefined && item.student_answer === choices[0] ? (
                item.answer === item.student_answer ? 
                  "label border border-green-400 rounded" 
                : 
                  "label border border-red-400 rounded"
              ) 
              : "label" 
            }
          >
            <span className="label-text">{choices[0]}</span>
            <input 
              type="radio" 
              name={item.id} 
              className="radio checked:bg-gray-500" 
              value={choices[0]} 
              required 
              disabled={item.remarks !== undefined}
              checked={item.remarks !== undefined && item.student_answer === choices[0] ? true : undefined}
            />
          </label>

          <label 
            className={
              item.remarks !== undefined && item.student_answer === choices[1] ? (
                item.answer === item.student_answer ? 
                  "label border border-green-400 rounded" 
                : 
                  "label border border-red-400 rounded"
              ) 
              : "label" 
            }
          >
            <span className="label-text">{choices[1]}</span>
            <input 
              type="radio" 
              name={item.id} 
              className="radio checked:bg-gray-500" 
              value={choices[1]} 
              required 
              disabled={item.remarks !== undefined}
              checked={item.remarks !== undefined && item.student_answer === choices[1] ? true : undefined}
            />
          </label>

          <label 
            className={
              item.remarks !== undefined && item.student_answer === choices[2] ? (
                item.answer === item.student_answer ? 
                  "label border border-green-400 rounded" 
                : 
                  "label border border-red-400 rounded"
              ) 
              : "label" 
            }
          >
            <span className="label-text">{choices[2]}</span>
            <input 
              type="radio" 
              name={item.id} 
              className="radio checked:bg-gray-500" 
              value={choices[2]} 
              required 
              disabled={item.remarks !== undefined}
              checked={item.remarks !== undefined && item.student_answer === choices[2] ? true : undefined}
            />
          </label>

          <label 
            className={
              item.remarks !== undefined && item.student_answer === choices[3] ? (
                item.answer === item.student_answer ? 
                  "label border border-green-400 rounded" 
                : 
                  "label border border-red-400 rounded"
              ) 
              : "label" 
            }
          >
            <span className="label-text">{choices[3]}</span>
            <input 
              type="radio" 
              name={item.id} 
              className="radio checked:bg-gray-500" 
              value={choices[3]} 
              required 
              disabled={item.remarks !== undefined}
              checked={item.remarks !== undefined && item.student_answer === choices[3] ? true : undefined}
            />
          </label>
        </div>
        <div className="divider"></div>
      </div>
    )
  }
  else if (item.type === "blank") {
    return (
      <div>
        <div className="p-2">
          <div className="mb-2">{(index + 1).toString() + ". " + item.question}</div>
          {
            item.remarks !== undefined ? (
              <div 
                className={"textarea textarea-bordered max-w-xs w-full border " + (
                  item.answer === item.student_answer ? "border-green-400" : "border-red-400 "
                )}
              >
                {item.student_answer}
              </div>
            ) : (
              <input 
                name={item.id}
                type="text" 
                placeholder=""
                className="input input-bordered w-full max-w-xs"
                required
                disabled={item.remarks !== undefined}
              />
            )
          }
        </div>
        <div className="divider"></div>
      </div>
    )
  }
  else if (item.type === "coding") {


    return (
      <div>
        <div className="p-2 relative">
          <div className="mb-2">{(index + 1).toString() + ". " + item.question}</div>
          {
            item.remarks !== undefined ? (
              <p className={"textarea textarea-bordered max-w-xs w-full whitespace-pre-wrap border " + (
                item.answer === item.student_answer ? "border-green-400" : "border-red-400 "
              )}>
                {item.student_answer}
              </p>
            ) : (
              <>
                <Editor
                  language="java"
                  defaultLanguage="java"
                  theme="vs-dark"
                  height="20rem"
                  onChange={setAnswer}
                />
                <textarea 
                  name={item.id}
                  value={answer}  
                  className="w-2 h-2 absolute top-14 left-20 bg-transparent outline-none opacity-0 whitespace-pre-wrap" 
                  onChange={() => {}}
                  required
                />
              </>
            )
          }
        </div>
        <div className="divider"></div>
      </div>
    )
  }
}