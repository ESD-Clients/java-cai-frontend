
export default function Select ({width, label, type, placeholder, name, required, value, onChange, options, disabled}) {
  
  return (
    <div className={"form-control " + (
      width ? (`max-w-${width}`) : ""
    )}>
      <label className="label justify-start">
        <span className="label-text">{label}</span>
        {required && <span className="text-red-500 ml-2">*</span>}
      </label>
      <select
        className="input input-bordered w-full" 
        type={type} 
        placeholder={placeholder}
        name={name}
        required={required}
        value={value}
        disabled={disabled}
        onChange={ e => onChange && onChange(e.target.value)}
      >
        {
          options.map((item, index) => (
            <option key={index.toString()} value={item.value}>{item.label}</option>
          ))
        }
      </select>
    </div>
  )
}