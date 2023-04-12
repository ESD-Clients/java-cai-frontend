export default function SearchField ({placeholder, setFilter}) {

  return (
    <div className="relative input">
      <input 
        type="text" 
        placeholder={placeholder ? placeholder : "Search here…"}
        className="input input-bordered pr-10 lg:w-[20rem]" 
        onChange={e => setFilter(e.target.value)}
      />
      <div className="absolute right-6 top-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  )
}