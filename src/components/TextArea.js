
export default function TextArea ({width, label, type, placeholder, name, required, value, onChange, className}) {
  
  return (
    <div className={"form-control w-full mr-4 " + (
      width ? (`max-w-${width}`) : ""
    )}>
      <label className="label justify-start">
        <span className="label-text">{label}</span>
        {required && <span className="text-red-500 ml-2">*</span>}
      </label>
      <textarea
        className={"textarea textarea-bordered w-full " + className}
        type={type} 
        placeholder={placeholder}
        name={name}
        required={required}
        value={value}
        onChange={ e => onChange && onChange(e.target.value)}
      />
    </div>
  )
}