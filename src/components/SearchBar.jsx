export default function SearchBar({ onSearch }) {
  return (
    <div className="flex items-center bg-white rounded-full shadow-lg overflow-hidden">
      <input
        type="text"
        placeholder="🔍  Search by name, specialty, or location..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full px-5 py-3 text-gray-700 focus:outline-none"
      />
    </div>
  );
}
