import React from 'react'

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className='search'>
        <div>
            <label>
               <input 
             className='bg-gray-900 input-transparent-bg text-white w-full sm:w-3/5 rounded-lg'
             type='text'
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