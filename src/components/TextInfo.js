
export default function TextInfo ({width, label, value}) {
  
  return (
    <div className={"form-control w-full " + (
      width ? (`max-w-${width}`) : ""
    )}>
      <label className="label justify-start">
        <span className="label-text">{label}</span>
      </label>
      <p className="textarea whitespace-pre-wrap">{value}</p>
    </div>
  )
}