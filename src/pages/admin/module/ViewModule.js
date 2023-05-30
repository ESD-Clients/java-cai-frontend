import { useEffect } from "react";
import { useState } from "react";
import ReactPlayer from "react-player";
import { useLocation, useNavigate } from "react-router-dom"
import Header2 from "../../../components/Header2";
import HDivider from "../../../components/HDivider";
import RichText from "../../../components/RichText";
import TextInfo from "../../../components/TextInfo";
import { ModuleController } from "../../../controllers/_Controllers";
import { getErrorMessage } from "../../../controllers/_Helper";
import { clearModal, showMessageBox } from "../../../modals/Modal";


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
      let item = snapshot.data();
      item.id = moduleId;
      setModule(item);
      setTitle(item.title);
      setSypnosis(item.sypnosis);
    })

    const unsubscribeTopics = ModuleController.subscribeTopics(moduleId, (snapshot) => {
      setTopics(snapshot.docs);
    })

    return () => {
      unsubscribeModule();
      unsubscribeTopics();
    };
    
  }, [])

  async function approveModule() {
    
    let result = await ModuleController.update(moduleId, {
      remarks: "approved"
    });

    clearModal();

    if (result && result.id) {
      showMessageBox({
        title: "Success",
        message: "Success",
        type: "success"
      })
    }
    else {
      
      showMessageBox({
        title: "Error",
        message: getErrorMessage(result),
        type: "danger",
        onPress: () => {
        }
      });
    }
    
  }

  async function disapproveModule() {
    let result = await ModuleController.update(moduleId, {
      remarks: "disapproved"
    });

    clearModal();

    if (result && result.id) {
      showMessageBox({
        title: "Success",
        message: "Success",
        type: "success"
      })
    }
    else {
      
      showMessageBox({
        title: "Error",
        message: getErrorMessage(result),
        type: "danger",
        onPress: () => {
        }
      });
    }
  }


  if(!moduleId || !module) return null;

  return (
    <>
      <div>
        <div className="flex justify-between">
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
              <path fill="currentColor" d="m12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2H7.825l5.6 5.6Z" />
            </svg>
            <p>Back</p>
          </button>

          <div className="space-x-2">
            <button className="btn btn-success" onClick={() => approveModule()}>
              Approved
            </button>
            <button className="btn btn-error" onClick={() => disapproveModule()}>
              Disapproved
            </button>
          </div>
        </div>
        <Header2 value="Module Details" />
        <TextInfo label="Title" value={module.title} />
        <TextInfo label="Remarks" value={module.remarks.toUpperCase()} />
        <RichText
          value={module.sypnosis}
        />
        {/* <TextInfo label="Sypnosis" value={module.sypnosis} /> */}

        <div className="flex items-center justify-between mt-4">
          <Header2 value="Topics" />
        </div>
        {
          topics.map((item, index) => (
            <div 
              key={index.toString()}
              className="my-4"
            >
              <h3 className="font-semibold text-lg mb-4">{item.data().title}</h3>
              <RichText
                value={item.data().content}
              />
              {/* <p className="whitespace-pre-wrap text-sm leading-5">
                {item.data().content}
              </p> */}

              {
                item.data().media && (
                  item.data().media.type === "image" ? (
                    <img
                      src={item.data().media.url}
                      className="w-full my-4"
                    />
                  ) : (
                    <div className="mt-4">
                      {/* <label className="label label-text font-semibold">
                        Demo
                      </label> */}
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
                item.data().code && (
                  <div className="mt-4">
                    <label className="label label-text font-semibold">
                      Example Code:
                    </label>
                    <p className="textarea font-mono whitespace-pre-wrap">
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