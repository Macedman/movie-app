import starIcon from '../assets/star-icon.svg'

const MovieCard = ({ movie: { title, vote_average, poster_path, release_date, original_language } }) => {
  return (
    <li className='movie-card flex flex-col bg-blue-950 rounded-xl overflow-hidden'>
        <img
         className='w-full aspect-[2/3] object-cover'
         src={poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : `${import.meta.env.BASE_URL}vite.svg`}
         alt={title}
        />

        <div className='p-4'>
            <h3 className='font-bold text-white line-clamp-1'>{title}</h3>

            <div className='mt-2 flex items-center justify-center gap-2 text-gray-300'>
                <div className='flex items-center gap-1'>
                    <img className='size-4' src={starIcon} alt="Star icon" />
                    <p className='font-bold text-white'>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                </div>

                <span>•</span>
                <p className="lang capitalize">{original_language}</p>

                <span>•</span>
                <p className="year">{release_date ? release_date.split('-')[0] : 'N/A'}</p>
            </div>
        </div>
    </li>
  )
}

export default MovieCard
