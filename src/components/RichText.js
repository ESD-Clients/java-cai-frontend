
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function RichText ({label, value, width}) {

  return (
    <div className={"form-control w-full " + (
      width ? (`max-w-${width}`) : ""
    )}>
      <label className="label justify-start">
        <span className="label-text">{label}</span>
      </label>
      
      <div className="">
        <ReactQuill
          value={value}
          readOnly={true}
          theme="bubble"
        />
      </div>
    </div>
  )
}