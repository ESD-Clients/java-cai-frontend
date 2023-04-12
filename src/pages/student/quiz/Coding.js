import Editor from "@monaco-editor/react";
import { useState } from "react";

export default function Coding ({item, questionNo}) {

  const [answer, setAnswer] = useState('');

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
            <p className={"textarea textarea-bordered w-full whitespace-pre-wrap border-2 " + (
              item.remarks === 1 ? "border-green-400" : "border-red-400 "
            )}>
              {item.studentAnswer}
            </p>
          ) : (
            <>
              <Editor
                className="border"
                language="java"
                defaultLanguage="java"
                theme="vs-light"
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
    </div>
  )
}