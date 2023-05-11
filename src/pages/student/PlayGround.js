import Editor from "@monaco-editor/react";
import { useState } from "react";
import axios from "axios";
import QueryString from "qs";
import { Helper, PlaygroundController } from "../../controllers/_Controllers";

export default function PlayGround() {

  const initialCode = Helper.getPlaygroundCode();

  const [loading, setLoading] = useState(false);
  const [codes, setCodes] = useState(initialCode ? initialCode : '');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  async function compile() {

    setOutput("");
    setLoading(true);

    let result = await PlaygroundController.execute(codes, input);
    setOutput(result);

    // let data = QueryString.stringify({
    //   'code': codes,
    //   'language': 'java',
    //   'input': input
    // });

    // let config = {
    //   method: 'post',
    //   url: 'https://api.codex.jaagrav.in',
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   },
    //   data: data
    // };

    // await axios(config)
    //   .then(function (response) {
    //     setOutput(response.data);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //     setOutput({
    //       error: error
    //     })
    //   });

    setLoading(false);
  }



  return (
    <>
      <div className="w-full flex flex-row">
        <div className="w-full lg:px-8 p-0">
          <div className="z-0">
            <Editor
              defaultLanguage="java"
              className="z-0 border min-h-[32rem]"
              theme="vs-light"
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
                className="textarea textarea-bordered w-full font-mono h-full"
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
                output.error ? (
                  <div className="textarea textarea-bordered w-full h-full font-mono text-red-500 whitespace-pre-wrap">
                    <p>Compiled Error!</p>
                    <p>
                      {output.error}
                    </p>
                  </div>

                ) : (
                  <p className="textarea textarea-bordered w-full h-full font-mono whitespace-pre-wrap">
                    {output.output}
                  </p>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}