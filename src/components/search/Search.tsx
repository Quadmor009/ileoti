import { ImagesAndIcons } from '../../shared/images-icons/ImagesAndIcons'

interface searchType {
    placeholder:string,
    value:string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    className?: string
}

const Search = ({placeholder, value, onChange, className}: searchType) => {
  return (
    <div className='border border-[#D8D8D8] rounded-full flex items-center gap-2 lg:w-75 px-4 h-14'>
      <img src={ImagesAndIcons.search} alt="" />
      <input type="text" className={`outline-none flex-auto text-base ${className}`} placeholder={placeholder} value={value} onChange={onChange}/>
    </div>
  )
}

export default Search
