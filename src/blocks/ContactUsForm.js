import Header2 from "../components/Header2";
import TextArea from "../components/TextArea";
import TextField from "../components/TextField";
import { FeedbackController, Helper } from "../controllers/_Controllers";
import { clearModal, showLoading, showMessageBox } from "../modals/Modal";

export default function ContactUsForm({ user }) {
  
  async function sendFeedback (e) {
    e.preventDefault();
    
    let data = Helper.getEventFormData(e);

    showLoading({
      message: "Sending..."
    })

    let result = await FeedbackController.store(data);

    clearModal();

    if(result && result.id) {

      e.target.reset();

      showMessageBox({
        title: "Success",
        message: "Your message have sent successfully!",
        type: "success",
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
      <div className="flex justify-center">
        <div className="max-w-[40rem] w-full flex flex-col flex-1 lg:mt-4 m-0 lg:px-8 px-4">
          <form onSubmit={sendFeedback}>
            <Header2
              value="Send Us Your Feedback"
            />
            <TextField
              label="Full Name"
              name="name"
              required
              defaultValue={user ? user.name : undefined}
            />
            <TextField
              label="Email"
              type="email"
              name="email"
              required
              defaultValue={user ? user.email : undefined}
            />
            <TextField
              label="Subject"
              name="subject"
              required
            />
            <TextArea
              label="Content"
              name="content"
              required
            />
            <div className="mt-4 flex justify-end">
              <button className="btn btn-primary">
                SUBMIT
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}