import { Search } from 'lucide-react'

function SearchInput({ value, onChange, placeholder = 'Buscar' }) {
  return (
    <label className="search-input">
      <Search size={16} aria-hidden="true" />
      <input
        type="search"
        aria-label={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  )
}

export default SearchInput
