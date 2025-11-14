export default function DoctorCard({ doctor }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition">
      <img
        src={doctor.image}
        alt={doctor.name}
        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
      />
      <h3 className="text-lg font-semibold text-center">{doctor.name}</h3>
      <p className="text-gray-500 text-center">{doctor.specialty}</p>
      <p className="text-gray-400 text-center">{doctor.location}</p>
      <p className="text-sm text-center text-gray-400 mt-1">
        {doctor.experience} years experience
      </p>
      <div className="text-center mt-4">
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700">
          Book Appointment
        </button>
      </div>
    </div>
  );
}
