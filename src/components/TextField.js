
export default function TextField ({className, width, label, type, placeholder, name, required, value, onChange, maxLength}) {
  
  return (
    <div className={"form-control w-full " + (
      width ? (`max-w-${width}`) : ""
    )}>
      {
        label && (
          <label className="label justify-start">
            <span className="label-text">{label}</span>
            {required && <span className="text-red-500 ml-2">*</span>}
          </label>
        )
      }
      <input
        className={"input input-bordered w-full " + className} 
        type={type} 
        placeholder={placeholder}
        name={name}
        required={required}
        value={value}
        onChange={ e => onChange && onChange(e.target.value)}
        maxLength={maxLength}
      />
    </div>
  )
}