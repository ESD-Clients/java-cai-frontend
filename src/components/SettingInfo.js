import { useEffect, useState } from "react";
import TextField from "./TextField";
import moment from "moment";
import { Dots } from "react-activity";
import { CLR_PRIMARY } from "../values/MyColor";

export default function SettingInfo ({ label, value, type, editable, onSave }) {

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value)

  useEffect(() => {
    setText(value)
  }, [editing])

  async function save() {
    setLoading(true);
    onSave && await onSave(text);
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
                value ? (
                  type === "date" ? (
                    moment(value).format("MMMM DD, yyyy")
                  ) : value
                ) : (
                  <span className="text-xs italic text-gray-400">N/A</span>
                )
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