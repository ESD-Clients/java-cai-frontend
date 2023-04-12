import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { clearModal, showConfirmationBox, showLoading, showMessageBox } from "../../modals/Modal";
import { useEffect } from "react";
import { FeedbackController } from "../../controllers/_Controllers";
import SearchField from "../../components/SearchField";
import { Dots } from "react-activity";
import { CLR_PRIMARY } from "../../values/MyColor";
import ReactModal from "react-modal";

export default function Feedbacks() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);

  const [viewModal, setViewModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const [filter, setFilter] = useState('');


  useEffect(() => {
    const unsubscribe = FeedbackController.subscribeList(async snapshot => {
      setFeedbacks(snapshot.docs);
      setLoading(false);
    })

    return () => unsubscribe();

  }, [])


  function deleteFeedback(id) {
    showConfirmationBox({
      message: "Are you sure you want to delete this feedback?",
      type: "danger",
      onYes: async () => {

        showLoading({
          message: "Deleting Feedback..."
        })

        let res = await FeedbackController.destroy(id);
        
        clearModal();
        if(res) {
          showMessageBox({
            type: "success",
            title: "Success",
            message: "Feedback deleted successfully!"
          })
        }
        else {
          showMessageBox({
            title: "Error",
            message: "Something went wrong"
          })
        }
      }
    })
  }

  function checkFilter(item) {
    if (filter) {
      let value = filter.toLowerCase();
      let subject = item.data().subject.toLowerCase();
      let name = item.data().name.toLowerCase();
      let email = item.data().email.toLowerCase();

      if (subject.includes(value) || name.includes(value) || email.includes(value)) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return true;
    }
  }


  return (
    <>
      <ReactModal 
        isOpen={selected}
        ariaHideApp={false}
        style={{overlay: {zIndex: 49, background: "transparent"}}}
        className="bg-modal flex w-full h-full backdrop-blur-sm z-50 items-center justify-center overflow-y-scroll "
      >
        {
          selected && (
            <div className="bg-base-100 p-6 min-w-[30rem] max-w-[50rem] max-h-[80vh] overflow-y-auto rounded-lg shadow-lg">
              <div className="flex justify-between">
                <h2 className="font-bold">Details</h2>
                <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>CLOSE</button>
              </div>
              <div className="mt-2">
                <label className="label text-xs font-semibold">SUBJECT</label>
                <div className="border rounded-lg p-2">{selected.data().subject}</div>
              </div>
              <div className="mt-2">
                <label className="label text-xs font-semibold">NAME</label>
                <div className="border rounded-lg p-2">{selected.data().name}</div>
              </div>
              <div className="mt-2">
                <label className="label text-xs font-semibold">EMAIL</label>
                <div className="border rounded-lg p-2">{selected.data().email}</div>
              </div>
              <div className="mt-2">
                <label className="label text-xs font-semibold">CONTENT</label>
                <div className="border rounded-lg p-2 whitespace-pre-wrap">{selected.data().content}</div>
              </div>
            </div>
          )
        }
      </ReactModal>
      <div>
        <div className="flex flex-col sm:flex-row justify-between mb-8">
          <div>
            <div className="font-bold uppercase mb-4">Feedback and Concerns</div>
            <div className="font-thin">Total Number of Messages:
              <span className="font-bold ml-2">
                {feedbacks.length}
              </span>
            </div>
          </div>
          <div className="mt-4 flex flex-row justify-center">
            <SearchField
              setFilter={setFilter}
              placeholder="Search subject, name or email"
            />
          </div>
        </div>

        <div className="divider" />

        <div className="overflow-x-auto">
          <table className="table table-compact w-full">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Sender</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                feedbacks.map((item, i) => (
                  checkFilter(item) && (
                    <tr key={i.toString()}>
                      <td>{item.data().subject}</td>
                      <td>{item.data().name}</td>
                      <td>{item.data().email}</td>
                      <td className="flex gap-2">
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => setSelected(item)}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-sm btn-error"
                          onClick={() => deleteFeedback(item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                ))
              }
            </tbody>
          </table>
          {
            loading && (
              <div className="flex justify-center items-center mt-4">
                <Dots color={CLR_PRIMARY} />
              </div>
            )
          }
        </div>
      </div>
    </>
  )
}