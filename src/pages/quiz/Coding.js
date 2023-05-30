import Editor from "@monaco-editor/react";
import { useState } from "react";
import { PlaygroundController } from "../../controllers/_Controllers";
import { getDifficulty } from "../../controllers/_Helper";

export default function Coding({ item, questionNo }) {

  const [answer, setAnswer] = useState('');
  const [testResult, setTestResult] = useState([]);
  const [testing, setTesting] = useState(false);

  async function test() {

    setTesting(true);
    let result = [];

    for (let testCase of item.testCases) {
      let res = await PlaygroundController.execute(answer, testCase.input);
      let remarks = res.output === testCase.output ? 1 : 0;
      result.push(remarks);
    }

    setTestResult(result);
    setTesting(false);
  }

  return (
    <div className="shadow-lg rounded-lg mb-4">
      <div className={
        "flex rounded-t-lg p-4 text-white gap-4 " + (
          item.remarks !== undefined ? (
            item.remarks === -1 ? "bg-gray-400"
              : item.remarks === 0 ? "bg-red-500"
                : "bg-green-400"
          ) : "bg-primary"
        )
      }>
        {
          item.remarks === undefined && <div className="mt-1 text-xs">{questionNo}.&#41;</div>
        }
        <div className="flex-1 font-semibold">{item.question}</div>
        
        <div>
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
            <p className={"textarea textarea-bordered w-full whitespace-pre-wrap border-2 " + (
              item.remarks === -1 ? "border-gray-400"
                : item.remarks === 0 ? "border-red-500"
                  : "border-green-400"
            )}>
              {item.studentAnswer}
            </p>
          ) : (
            <div>
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
                onChange={() => { }}
                required
              />
              <div className="flex justify-end">
                {
                  testing ? (
                    <div className="mr-4">
                      <span className="loader"></span>
                    </div>
                  ) : (
                    <button
                      className="btn btn-primary mt-2 btn-sm"
                      type="button"
                      disabled={!answer}
                      onClick={test}
                    >
                      Test Code
                    </button>
                  )
                }
              </div>
              <div>
                <label className="label justify-start">
                  <span className="label-text">Test Cases:</span>
                </label>
                <table className="table table-compact w-full">
                  <thead>
                    <tr>
                      <th className="text-xs font-semibold">Input</th>
                      <th className="text-xs font-semibold">Output</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      item.testCases.map((item, index) => (
                        <tr key={index.toString()} className="text-sm">
                          <td className="whitespace-pre">{item.input}</td>
                          <td>{item.output}</td>
                          {
                            testResult[index] === 0 ? (
                              <td className="text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                              </td>
                            ) : 
                            testResult[index] === 1 ? (
                              <td className="text-green-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              </td>
                            ) : 
                            <td className="text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                            </td>
                          }
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}