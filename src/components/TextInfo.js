import moment from "moment";
import { Helper } from "../controllers/_Controllers";

export default function TextInfo ({width, label, value, type}) {
  
  return (
    <div className={"form-control w-full " + (
      width ? (`max-w-${width}`) : ""
    )}>
      <label className="label justify-start">
        <span className="label-text">{label}</span>
      </label>
      <p className="textarea textarea-disabled whitespace-pre-wrap">
        {
          type === "date" ? (
            moment(value).format("MMMM DD, yyyy")
          ) :
          type === "datetime" ? (
            moment(value).format("MMMM DD, yyyy - hh:mm A")
          ) : (
            value
          )
        }
      </p>
    </div>
  )
}