import StudentNavBar from "../../components/StudentNavBar";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import axios from "axios";
import QueryString from "qs";
import { Helper } from "../../controllers/_Controllers";

export default function PlayGround() {

  const user = Helper.getCurrentUser();

  const initialCode = Helper.getPlaygroundCode();

  const [loading, setLoading] = useState(false);
  const [codes, setCodes] = useState(initialCode ? initialCode : '');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const [compileError, setCompileError] = useState(false);

  async function compile() {

    setOutput("");
    setLoading(true);
    setCompileError(false);

    let data = QueryString.stringify({
      'code': codes,
      'language': 'java',
      'input': input
    });

    let config = {
      method: 'post',
      url: 'https://api.codex.jaagrav.in',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    };

    await axios(config)
      .then(function (response) {
        console.log(response.data);
        setOutput(response.data.output);
      })
      .catch(function (error) {
        console.log(error);
        setCompileError(true);
      });

    setLoading(false);
  }



  return (
    <>
      <div className="w-full flex flex-row">
        <div className="w-full lg:px-8 p-0">
          <div className="h-[70vh] z-0">
            {/* <textarea className="textarea textarea-bordered resize-none focus:outline-none leading-snug w-full h-full text-current text-lg" wrap="logical" id="textareaInput"></textarea> */}
            <Editor
              defaultLanguage="java"
              className="z-0"
              theme="vs-dark"
              value={codes}
              onChange={(value) => {
                Helper.setPlaygroundCode(value)
                setCodes(value)
              }}
            />
            <div className="m-2"></div>

          </div>
        </div>
        <div className="hidden lg:block w-1/2">
          <div id="output" className="border rounded-lg flex flex-col h-full w-full">
            <div className="flex flex-row items-center justify-between my-2 mx-4">
              <div id="output-span">Input:</div>
            </div>
            <div id="output-container" className="h-full px-4 pb-4">
              <textarea
                className="textarea w-full font-mono h-full"
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />
            </div>


            <div className="flex flex-row items-center justify-between my-2 mx-4">
              <div id="output-span">Output:</div>
              <div>
                {
                  loading ? (
                    <div className="mr-4">
                      <span className="loader"></span>
                    </div>
                  ) : (
                    <button className="btn btn-primary" onClick={compile}>Run</button>
                  )
                }

              </div>
            </div>
            <div id="output-container" className="h-full p-4">
              {
                compileError ? (
                  <p className="textarea w-full h-full font-mono text-red-500 whitespace-pre-wrap">
                    Compiled Error!
                  </p>

                ) : (
                  <p className="textarea w-full h-full font-mono whitespace-pre-wrap">
                    {output}
                  </p>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </>

    //TODO: Scripts
  )
}