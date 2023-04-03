import Editor from "@monaco-editor/react";
import { useEffect } from "react";
import { useState } from "react";
import ReactModal from "react-modal";

import { useNavigate } from "react-router-dom";
import HDivider from "../../components/HDivider";
import RichText from "../../components/RichText";
import RichTextEditor from "../../components/RichTextEditor";
import TextArea from "../../components/TextArea";
import TextField from "../../components/TextField";
import { ModuleController } from "../../controllers/_Controllers";
import { getFileType } from "../../controllers/_Helper";
import { clearModal, showLoading, showMessageBox } from "../../modals/Modal";

export default function AddModule({ user }) {

  console.log(user);

  const navigate = useNavigate();

  /** MODULE */
  const [title, setTitle] = useState('');
  const [sypnosis, setSypnosis] = useState('');
  const [topics, setTopics] = useState([]);

  /** ADD TOPIC */
  const [add, setAdd] = useState(false);
  const [topicTitle, setTopicTitle] = useState('');
  const [topicContent, setTopicContent] = useState('');
  const [topicCode, setTopicCode] = useState('');

  useEffect(() => {
    setTopicTitle('');
    setTopicContent('');
    setTopicCode('');
  }, [add])

  function addTopic (e) {

    e.preventDefault();

    let topic = {
      title: topicTitle,
      content: topicContent,
      code: topicCode
    };

    
    if(e.target.media.files.length > 0) {
      topic.file = e.target.media.files[0];
    }

    let newList = [...topics];
    newList.push(topic);

    setTopics(newList);

    setAdd(false);
  }

  function updateTopic () {
    
  }

  function removeTopic (index) {
    let newList = [...topics];
    newList.splice(index, 1);
    setTopics(newList);
  }

  async function addModule(e) {
    e.preventDefault();

    if(topics.length === 0) {
      showMessageBox({
        title: "Warning",
        type: "warning",
        message: "Please add atleast one (1) topic."
      })
      return;
    }

    showLoading({
      message: "Saving..."
    })

    let module = {
      title: title,
      sypnosis: sypnosis,
      remarks: "unapproved"
    };


    let result = await ModuleController.store(module);

    if (result && result.id) {

      for(let topic of topics) {

        if(topic.file) {
          topic.media = {
            type: getFileType(topic.file),
            url: await ModuleController.uploadFile(topic.file, `module/${result.id}`)
          }
        }
        delete topic.file;

        await ModuleController.addTopic({
          moduleId: result.id,
          topic: topic
        });
      }

      clearModal();

      showMessageBox({
        title: "Success",
        message: "Success",
        type: "success",
        onPress: () => {
          navigate(-1);
          // document.getElementById("btnBack").click();
        }
      })
    }
    else {
      
      showMessageBox({
        title: "Error",
        message: "Something went wrong",
        type: "danger",
        onPress: () => {
        }
      });
    }
  }

  return (
    <>
      {/* Modal for ADD TOPIC */}
      <ReactModal 
        isOpen={add}
        ariaHideApp={false}
        style={{overlay: {zIndex: 49, background: "transparent"}}}
        className="bg-modal flex w-full h-full backdrop-blur-sm z-50 items-center justify-center overflow-y-scroll "
      >
        <form 
          className="bg-base-200 p-4 sm:w-2/3 rounded relative"
          onSubmit={addTopic}
        >
          <div className="my-4">
            <h1 className="text-lg font-semibold">New Topic</h1>
          </div>
          <TextField 
            label="Title" 
            value={topicTitle}
            onChange={setTopicTitle}
            required />
          <RichTextEditor 
            label="Content" 
            value={topicContent}
            onChange={setTopicContent}
            required />
          
          {/* <TextArea 
            label="Content" 
            value={topicContent}
            onChange={setTopicContent}
            required /> */}

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Media</span>
            </label>
            <div>
              <input 
                type="file" 
                name="media"
                accept="video/*, image/*" 
                className="file-input file-input-bordered w-full max-w-xs" />
            </div>
          </div>

          <label className="label label-text">
            Example Code
          </label>
          <Editor
            language="java"
            defaultLanguage="java"
            theme="vs-dark"
            height="20rem"
            value={topicCode}
            onChange={setTopicCode}
          />

          <div className="flex justify-end my-4 space-x-2">
            <button 
              className="btn btn-ghost"
              onClick={() => setAdd(false)}
            >CANCEL</button>
            <button className="btn btn-success">ADD TOPIC</button>
          </div>
        </form>
      </ReactModal>

      {/* Content */}
      <div className="flex justify-between">
        <div>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
              <path fill="currentColor" d="m12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2H7.825l5.6 5.6Z" />
            </svg>
            <p>Back</p>
          </button>
        </div>
        <div>
          <button className="btn btn-success" form="module-form" type="submit">Save Module</button>
        </div>
      </div>

      <HDivider />

      <div>
        <form id="module-form" onSubmit={addModule}>
          <div className="my-4">
            <h1 className="text-lg font-bold">Module Information</h1>
          </div>

          <div className="flex space-x-2">
            {/* <TextField label="Module No" type="number" width="xs"/> */}
            <TextField 
              label="Module Title" 
              value={title}
              onChange={setTitle}
              required />
          </div>

          <RichTextEditor
            label="Sypnosis" 
            value={sypnosis}
            onChange={setSypnosis}
            required 
          />

          {/* <TextArea 
            label="Sypnosis" 
            value={sypnosis}
            onChange={setSypnosis}
            required /> */}

          <div className="mt-8 flex justify-between">
            <h1 className="text-lg font-bold">Topics</h1>
            <button 
              className="btn btn-info" 
              type="button"
              onClick={() => setAdd(true)}
            >
              ADD TOPIC
            </button>
          </div>

          <div>
            {
              topics.map((item, index) => (
                <div
                  key={index.toString()}
                  className="w-full flex bg-base-300 rounded p-4 mt-4"
                >
                  <div className="flex-1">
                    <h6 className="font-semibold">{item.title}</h6>
                    <RichText
                      value={item.content}
                    />
                    {/* <p className="text-sm overflow-hidden text-ellipsis max-h-14 mt-2">
                      {item.content}
                    </p> */}
                    <div className="flex space-x-2 mt-2">
                      {
                        item.file && (
                          <span>
                            <svg className="svg-icon fill-current" height={24} width={24} viewBox="0 0 20 20">
                              <path d="M4.317,16.411c-1.423-1.423-1.423-3.737,0-5.16l8.075-7.984c0.994-0.996,2.613-0.996,3.611,0.001C17,4.264,17,5.884,16.004,6.88l-8.075,7.984c-0.568,0.568-1.493,0.569-2.063-0.001c-0.569-0.569-0.569-1.495,0-2.064L9.93,8.828c0.145-0.141,0.376-0.139,0.517,0.005c0.141,0.144,0.139,0.375-0.006,0.516l-4.062,3.968c-0.282,0.282-0.282,0.745,0.003,1.03c0.285,0.284,0.747,0.284,1.032,0l8.074-7.985c0.711-0.71,0.711-1.868-0.002-2.579c-0.711-0.712-1.867-0.712-2.58,0l-8.074,7.984c-1.137,1.137-1.137,2.988,0.001,4.127c1.14,1.14,2.989,1.14,4.129,0l6.989-6.896c0.143-0.142,0.375-0.14,0.516,0.003c0.143,0.143,0.141,0.374-0.002,0.516l-6.988,6.895C8.054,17.836,5.743,17.836,4.317,16.411"></path>
                            </svg>
                          </span>
                        )
                      }

                      {
                        item.code && (
                          <span>
                            <svg className="svg-icon fill-current" height={24} width={24} viewBox="0 0 20 20">
                              <path d="M17.728,4.419H2.273c-0.236,0-0.429,0.193-0.429,0.429v10.304c0,0.234,0.193,0.428,0.429,0.428h15.455c0.235,0,0.429-0.193,0.429-0.428V4.849C18.156,4.613,17.963,4.419,17.728,4.419 M17.298,14.721H2.702V9.57h14.596V14.721zM17.298,8.712H2.702V7.424h14.596V8.712z M17.298,6.566H2.702V5.278h14.596V6.566z M9.142,13.005c0,0.235-0.193,0.43-0.43,0.43H4.419c-0.236,0-0.429-0.194-0.429-0.43c0-0.236,0.193-0.429,0.429-0.429h4.292C8.948,12.576,9.142,12.769,9.142,13.005"></path>
                            </svg>
                          </span>
                        )
                      }
                    </div>
                  </div>
                  <div className="flex justify-center items-center ml-4">
                    {/* <span className="btn btn-ghost"
                      onClick={() => {
                        setAdd(true);
                        setTopicTitle(item.title)
                        setTopicContent(item.content)
                        setTopicCode(item.code)
                      
                      }}
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current text-blue-400" width="24" height="24" viewBox="0 0 24 24" fill="none"  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg>
                    </span> */}

                    <span className="btn btn-ghost" onClick={() => removeTopic(index)}>
                      <svg className="svg-icon text-red-400 fill-current" height={24} width={24} viewBox="0 0 20 20">
                        <path d="M17.114,3.923h-4.589V2.427c0-0.252-0.207-0.459-0.46-0.459H7.935c-0.252,0-0.459,0.207-0.459,0.459v1.496h-4.59c-0.252,0-0.459,0.205-0.459,0.459c0,0.252,0.207,0.459,0.459,0.459h1.51v12.732c0,0.252,0.207,0.459,0.459,0.459h10.29c0.254,0,0.459-0.207,0.459-0.459V4.841h1.511c0.252,0,0.459-0.207,0.459-0.459C17.573,4.127,17.366,3.923,17.114,3.923M8.394,2.886h3.214v0.918H8.394V2.886z M14.686,17.114H5.314V4.841h9.372V17.114z M12.525,7.306v7.344c0,0.252-0.207,0.459-0.46,0.459s-0.458-0.207-0.458-0.459V7.306c0-0.254,0.205-0.459,0.458-0.459S12.525,7.051,12.525,7.306M8.394,7.306v7.344c0,0.252-0.207,0.459-0.459,0.459s-0.459-0.207-0.459-0.459V7.306c0-0.254,0.207-0.459,0.459-0.459S8.394,7.051,8.394,7.306"></path>
                      </svg>
                    </span>

       
                  </div>
                </div>
              ))
            }
          </div>
        </form>
      </div>
    </>

    // TODO: SCRIPTS
  )
}

