import { useState } from "react";
import { FacultyController, Helper } from "../../controllers/_Controllers"
import moment from "moment";
import { Dots } from "react-activity";
import { CLR_PRIMARY } from "../../values/MyColor";
import TextField from "../../components/TextField";
import { useEffect } from "react";
import PasswordField from "../../components/PasswordField";
import { clearModal, showLoading, showMessageBox } from "../../modals/Modal";

export default function FacultySettings() {

  const [user, setUser] = useState(Helper.getCurrentUser());

  const [updatingImage, setUpdatingImage] = useState(false);
  const [image, setImage] = useState(null);

  async function updateUser(key, value) {

    let data = {};
    data[key] = value;

    let result = await FacultyController.update(user.id, data);

    if (result && result.id) {
      Helper.setCurrentUser({
        ...result,
        type: "faculty"
      });
      setUser(result)
    }
  }

  async function updateImage () {

    setUpdatingImage(true);

    let url = await FacultyController.uploadFile(image, 'student/profile');
    await updateUser("imageUri", url);

    setImage(null);
    setUpdatingImage(false);
  }

  async function updatePassword (e) {
    e.preventDefault();

    let retype = e.target.retype.value;
    let newPassword = e.target.new.value;
    let current = e.target.current.value;
    
    
    if(!Helper.isPasswordValid(newPassword)) {
      showMessageBox({
        title: "Error",
        type: "danger",
        message: "Password must be 8-16 characters long and contain at least one uppercase letter, one lowercase letter, and one number."
      });
      return;
    }

    if(newPassword !== retype) {
      showMessageBox({
        title: "Error",
        type: "danger",
        message: "Password didn't match!"
      });
      return;
    }
    
   showLoading({
    message: "Updating Password..."
   })

    let result = await FacultyController.updatePassword(user.email, current, newPassword);

    clearModal();

    if(result === true) {
      showMessageBox({
        title: "Success",
        type: "success",
        message: "Password updated successfully!"
      })
    }
    else {
      showMessageBox({
        title: "Error",
        type: "danger",
        message: result.message
      })
    }

    e.target.reset();

  }

  return (
    <>
      <div className="">
        <div className="lg:max-w-[100rem] w-full flex flex-col flex-1 lg:mt-4 m-0 lg:px-8 px-4">
          <div className="">
            <div className="">
              <div className="text-gray-300 h-[10rem] w-[10rem] rounded-full border border-dashed">
                {
                  image ? (
                    <img
                      src={URL.createObjectURL(image)}
                      className="h-[10rem] w-[10rem] rounded-full border border-dashed object-cover"
                    />
                  ) : (
                    user.imageUri ? (
                      <img
                        src={user.imageUri}
                        className="h-[10rem] w-[10rem] rounded-full border border-dashed object-cover"
                      />
                    ) : (
                      <div className="text-gray-300 h-[10rem] w-[10rem] rounded-full border border-dashed">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-[10rem]" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                          <path fill="currentColor" d="M16 8a5 5 0 1 0 5 5a5 5 0 0 0-5-5Z" />
                          <path fill="currentColor" d="M16 2a14 14 0 1 0 14 14A14.016 14.016 0 0 0 16 2Zm7.992 22.926A5.002 5.002 0 0 0 19 20h-6a5.002 5.002 0 0 0-4.992 4.926a12 12 0 1 1 15.985 0Z" />
                        </svg>
                      </div>
                    )
                  )
                }
              </div>

              <input
                id="image_picker"
                className="h-0 w-0"
                type="file"
                accept="image"
                value=""
                onChange={e => {
                  if (e.target.files.length > 0) {
                    setImage(e.target.files[0])
                  }
                }}
              />

              <div className="mt-4 flex gap-2">
                {
                  updatingImage ? (
                    <Dots color={CLR_PRIMARY} />
                  ) : (
                    <>
                      <button
                        className="btn btn-info btn-sm"
                        type="submit"
                        onClick={() => {
                          document.getElementById("image_picker").click();
                        }}
                      >
                        Change
                      </button>
                      {
                        image && (
                          <>
                            <button
                              className="btn btn-success btn-sm"
                              type="submit"
                              onClick={() => {
                                updateImage();
                              }}
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-error btn-sm"
                              type="submit"
                              onClick={() => {
                                setImage(null)
                              }}
                            >
                              Remove
                            </button>
                          </>
                        )
                      }
                    </>
                  )
                }
              </div>
            </div>

            <div className="max-w-[40rem]">
              <Info
                label="Email"
                value={user.email}
              />
              <Info
                label="Name"
                value={user.name}
                editable
                onSave={async (value) => updateUser("name", value)}
              />

              <form onSubmit={updatePassword}>
                <h2 className="mt-16 font-bold uppercase">
                  Change Password
                </h2>
                <PasswordField
                  label="Current Password"
                  name="current"
                  required
                />
                <PasswordField
                  label="New Password"
                  name="new"
                  required
                />
                <PasswordField
                  label="Retype Password"
                  name="retype"
                  required
                />
                <div className="flex justify-end gap-2 mt-2">
                  {/* <button className="btn btn-success" form="module-form" type="submit">CLEAR</button> */}
                  <button className="btn btn-success">SAVE</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const Info = ({ label, value, type, editable, onSave }) => {

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value)

  useEffect(() => {
    setText(value)
  }, [editing])

  async function save() {
    setLoading(true);
    await onSave(text);
    setEditing(false);
    setLoading(false);
  }

  return (
    <div className=" mt-8">
      <div className="text-sm text-gray-500">{label}</div>

      <div className="flex items-center my-1 ">
        {
          editing ? (
            <TextField
              value={text}
              onChange={setText}
              type={type}
            />
          ) : (
            <div className="flex-1 px-4 font-semibold text-lg">
              {
                type === "date" ? (
                  moment(value).format("MMMM DD, yyyy")
                ) : value
              }
            </div>
          )

        }

        {
          editable && (
            loading ? (
              <div className="ml-2 w-4">
                <Dots size={8} color={CLR_PRIMARY} />
              </div>
            )
              : editing ? (
                <>
                  <div className="btn btn-ghost btn-circle text-green-400" onClick={save}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <div className="btn btn-ghost btn-circle text-red-400" onClick={() => setEditing(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </div>
                </>
              ) : (
                <div className="btn btn-ghost btn-circle text-info" onClick={() => setEditing(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon>
                  </svg>
                </div>
              )
          )
        }
      </div>
    </div>
  )
}