const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className='search'>
        <div>
            <label>
               <span className='sr-only'>Search movies</span>
               <input
             className='bg-gray-900 input-transparent-bg text-white w-full sm:w-3/5 rounded-lg'
             type='search'
             placeholder='Search through thousands of movies'
             value={searchTerm}
             onChange={(event) => setSearchTerm(event.target.value)}
             />
            </label>
        </div>
    </div>
  )
}

export default Search
