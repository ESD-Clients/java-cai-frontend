import Editor from "@monaco-editor/react";
import { useEffect } from "react";
import { useState } from "react";
import ReactModal from "react-modal";
import ReactPlayer from "react-player";
import { useLocation, useNavigate } from "react-router-dom"
import Header2 from "../../components/FormTitle";
import HDivider from "../../components/HDivider";
import TextArea from "../../components/TextArea";
import TextField from "../../components/TextField";
import TextInfo from "../../components/TextInfo";
import { ModuleController } from "../../controllers/_Controllers";
import { getErrorMessage, getFileType } from "../../controllers/_Helper";
import { clearModal, showConfirmationBox, showLoading, showMessageBox } from "../../modals/Modal";


export default function ViewModule () {

  
  const location = useLocation();
  const navigate = useNavigate();

  const moduleId = location.search.substring(1);

  const [module, setModule] = useState(null);
  const [topics, setTopics] = useState([]);

  /** EDIT DETAILS */
  const [detailsModal, setDetailsModal] = useState(false);
  const [title, setTitle] = useState('');
  const [sypnosis, setSypnosis] = useState('');

  /** EDIT TOPIC */
  const [topicModal, setTopicModal] = useState(false);
  const [topicId, setTopicId] = useState('');
  const [topicTitle, setTopicTitle] = useState('');
  const [topicContent, setTopicContent] = useState('');
  const [topicCode, setTopicCode] = useState('');
  const [removeMedia, setRemoveMedia] = useState(false);
  // const [topicMedia, setTopicMedia] = useState(null);

  useEffect(() => {

    const unsubscribeModule = ModuleController.subscribeDoc(moduleId, (snapshot) => {
      
      console.log("MODULE", snapshot)
      let item = snapshot.data();
      item.id = moduleId;
      setModule(item);
      setTitle(item.title);
      setSypnosis(item.sypnosis);
    })

    console.log("Subscribing")
    const unsubscribeTopics = ModuleController.subscribeTopics(moduleId, (snapshot) => {
      console.log("TOPICS", snapshot.docs)
      setTopics(snapshot.docs);
    })

    return () => {
      unsubscribeModule();
      unsubscribeTopics();
    };
    
  }, [])

  async function saveDetails (e) {

    e.preventDefault();
    
    showLoading({
      message: "Saving..."
    })

    let result = await ModuleController.update(moduleId, {
      title: title,
      sypnosis: sypnosis
    });

    clearModal();

    setDetailsModal(false);

    if(result && result.id) {
      showMessageBox({
        title: "Success",
        message: "Success",
        type: "success",
      })
    }
    else {
      showMessageBox({
        title: "Error",
        message: "Something went wrong",
        type: "danger"
      });
    }
  }

  async function saveTopic (e) {

    e.preventDefault();

    showLoading({
      message: "Saving..."
    })

    let topic = {
      title: topicTitle,
      content: topicContent,
      code: topicCode
    };

    // if(topicMedia) {
    //   topic.media = topicMedia;
    // }
    
    
    if(removeMedia) {
      topic.media = null;
    }
    else {
      if(e.target.media.files.length > 0) {
        let file = e.target.media.files[0];

        topic.media = {
          type: getFileType(file),
          url: await ModuleController.uploadFile(file, `module/${moduleId}`)
        }
      }
    }

    let result = false;

    if(topicId) {
      result = await ModuleController.updateTopic({
        moduleId: moduleId,
        topicId: topicId,
        data: topic
      })
    }
    else {
      console.log("ADD");
      result = await ModuleController.addTopic({
        moduleId: moduleId,
        topic: topic
      });
    }

    clearModal();

    setTopicModal(false);

    if(result && result.id) {
      showMessageBox({
        title: "Success",
        message: "Success",
        type: "success",
      })
    }
    else {
      showMessageBox({
        title: "Error",
        message: "Something went wrong",
        type: "danger"
      });
    }
    

  }

  function addTopic () {
    setTopicId(null);
    setTopicTitle('');
    setTopicContent('');
    setTopicCode('');

    setTopicModal(true);
  }

  function editTopic (index) {
    setTopicId(topics[index].id);
    setTopicTitle(topics[index].data().title);
    setTopicContent(topics[index].data().content);
    setTopicCode(topics[index].data().code);

    // setTopicMedia(topics[index].media);
    
    setTopicModal(true);
  }

  function deleteTopic (index) {
    showConfirmationBox({
      message: "Are you sure you want to remove this topic?",
      type: "warning",
      onYes: async () => {
        showLoading({
          message: "Deleting..."
        })

        let result = await ModuleController.deleteTopic({
          moduleId: moduleId,
          topicId: topics[index].id
        });

        clearModal();

        if(result !== true) {
          showMessageBox({
            title: "Error",
            type: "error",
            message: getErrorMessage(result)
          })
        }
      }
    })
  }


  if(!moduleId || !module) return null;

  return (
    <>
      {/* Details Modal */}
      <ReactModal 
        isOpen={detailsModal}
        ariaHideApp={false}
        style={{overlay: {zIndex: 49, background: "transparent"}}}
        className="bg-modal flex w-full h-full backdrop-blur-sm z-50 items-center justify-center overflow-y-scroll "
      >
        <form 
          className="bg-base-200 p-4 sm:w-2/3 rounded relative"
          onSubmit={saveDetails}
        >
          <div className="my-4">
            <h1 className="text-lg font-semibold">Edit Details</h1>
          </div>
          <TextField 
            label="Title" 
            value={title}
            onChange={setTitle}
            required />
          <TextArea 
            label="Sypnosis" 
            value={sypnosis}
            onChange={setSypnosis}
            required />

          <div className="flex justify-end my-4 space-x-2">
            <button 
              className="btn btn-ghost"
              onClick={() => setDetailsModal(false)}
            >CANCEL</button>
            <button className="btn btn-success">SAVE DETAILS</button>
          </div>
        </form>
      </ReactModal>

      {/* Modal for Edit TOPIC */}
      <ReactModal 
        isOpen={topicModal}
        ariaHideApp={false}
        style={{overlay: {zIndex: 49, background: "transparent"}}}
        className="bg-modal flex w-full h-full backdrop-blur-sm z-50 items-center justify-center overflow-y-scroll "
      >
        <form 
          className="bg-base-200 p-4 sm:w-2/3 rounded relative"
          onSubmit={saveTopic}
        >
          <div className="my-4">
            <h1 className="text-lg font-semibold">
              {topicId ? "Edit Topic" : "New Topic"}
            </h1>
          </div>
          <TextField 
            label="Title" 
            value={topicTitle}
            onChange={setTopicTitle}
            required />
          <TextArea 
            label="Content" 
            value={topicContent}
            onChange={setTopicContent}
            required />

          {
            topicId ? (
              <div className="form-control w-full">
                <Header2 value="Media" />
                <div className="flex items-center">
                  <input 
                    type="checkbox"
                    className="checkbox"
                    checked={removeMedia}
                    onChange={e => setRemoveMedia(e.target.checked)}
                    />
                    <label className="label">
                      <span className="label-text">Remove Media</span>
                    </label>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Replace Media</span>
                  </label>
                  <input 
                    type="file" 
                    name="media"
                    accept="video/*, image/*" 
                    disabled={removeMedia}
                    className="file-input file-input-bordered w-full max-w-xs" />
                </div>
              </div>
            ) : (
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
            )
          }

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
              onClick={() => setTopicModal(false)}
            >CANCEL</button>
            <button className="btn btn-success">SAVE TOPIC</button>
          </div>
        </form>
      </ReactModal>

      {/* Content */}
      <div>
        <div>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
              <path fill="currentColor" d="m12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2H7.825l5.6 5.6Z" />
            </svg>
            <p>Back</p>
          </button>
        </div>
        <div className="flex justify-between">
          
          <Header2 value="Module Details" />
          <div>
            <button 
              className="btn btn-ghost" 
              name="Edit"
              onClick={() => setDetailsModal(true)}
            >
              <span className="mr-2">Edit</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#757c8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon><line x1="3" y1="22" x2="21" y2="22"></line></svg>
            </button>
          </div>
        </div>
        <TextInfo label="Title" value={module.title} />
        <TextInfo label="Sypnosis" value={module.sypnosis} />

        <div className="flex items-center justify-between mt-4">
        <Header2 value="Topics" />
        <button className="btn btn-info" onClick={addTopic}>
          ADD TOPIC
        </button>
        </div>
        {
          topics.map((item, index) => (
            <div 
              key={index.toString()}
              className="my-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg mb-4">{item.data().title}</h3>
                <div>
                  <button 
                    className="btn btn-ghost" 
                    name="Edit" 
                    onClick={() => editTopic(index)}
                  >
                    <span className="mr-2">Edit</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#757c8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon><line x1="3" y1="22" x2="21" y2="22"></line></svg>
                  </button>
                  <button 
                    className="btn btn-ghost" 
                    name="Edit" 
                    onClick={() => deleteTopic(index)}
                  >
                    <span className="mr-2 text-red-400">DELETE</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f87272" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </div>
              </div>
              
              <p className="whitespace-pre-line text-sm leading-5">
                {item.data().content}
              </p>

              {
                item.data().media && (
                  item.data().media.type === "image" ? (
                    <img
                      src={item.data().media.url}
                      className="w-full my-4"
                    />
                  ) : (
                    <div className="mt-4">
                      <label className="label label-text font-semibold">
                        Demo
                      </label>
                      <div className="h-96 border border-base-300 ">
                        <ReactPlayer
                          url={item.data().media.url}
                          width='100%'
                          height='100%'
                          controls
                        />
                      </div>
                    </div>
                  )
                )
              }

              
              {
                item.code && (
                  <div className="mt-4">
                    <label className="label label-text font-semibold">
                      Example Code:
                    </label>
                    <p className="textarea font-mono whitespace-pre-line">
                      {item.data().code}
                    </p>
                  </div>
                )
              }
              <HDivider />
            </div>
          ))
        }
      </div>    
    </>
  )
}