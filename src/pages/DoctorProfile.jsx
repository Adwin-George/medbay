import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { doctors, bookAppointment } = useData();
  const doctor = doctors.find((d) => d.id === Number(id));

  const [selectedDay, setSelectedDay] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Doctor Not Found</h1>
        <button
          onClick={() => navigate("/doctors")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Doctors
        </button>
      </div>
    );
  }

  const handleBook = (e) => {
    e.preventDefault();

    if (!selectedDay || !selectedSlot || !patientName || !patientPhone) {
      alert("Please fill in all fields before booking.");
      return;
    }

    const dateTime = `${selectedDay} ${selectedSlot}`;
    bookAppointment(doctor.id, dateTime, patientName, patientPhone);

    alert(`Appointment booked with ${doctor.name} on ${dateTime}!`);

    setSelectedDay("");
    setSelectedSlot("");
    setPatientName("");
    setPatientPhone("");

    navigate("/doctors");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6">
      {/* HEADER */}
      <header className="w-full max-w-5xl flex justify-between items-center mb-10">
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-blue-700 cursor-pointer"
        >
          🏥 MedBay
        </h1>

        <button
          onClick={() => navigate("/doctors")}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Back to Doctors
        </button>
      </header>

      {/* DOCTOR DETAILS CARD */}
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-4xl text-center">
        <img
          src={doctor.image}
          alt={doctor.name}
          onError={(e) =>
            (e.target.src =
              "https://cdn-icons-png.flaticon.com/512/3774/3774299.png")
          }
          className="w-32 h-32 mx-auto rounded-full object-cover mb-4 border"
        />

        <h2 className="text-3xl font-bold text-gray-800 mb-2">{doctor.name}</h2>
        <p className="text-gray-600 mb-1">{doctor.specialty}</p>
        <p className="text-gray-500 mb-1">{doctor.department}</p>
        <p className="text-gray-500 mb-1">{doctor.location}</p>
        <p className="text-gray-600 mb-4">
          {doctor.experience} years experience • Fee: ₹{doctor.fee}
        </p>

        {/* Availability */}
        <div className="bg-gray-50 border rounded-lg p-4 mb-6 text-left">
          <h3 className="text-lg font-semibold mb-3 text-blue-700">Availability</h3>

          {doctor.availability &&
          Object.keys(doctor.availability).length > 0 ? (
            <ul className="space-y-2">
              {Object.entries(doctor.availability).map(([day, slots]) => (
                <li key={day}>
                  <strong className="text-gray-800">{day}: </strong>
                  <span className="text-gray-600">{slots.join(", ")}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Availability not set yet.</p>
          )}
        </div>

        {/* BOOKING FORM */}
        <form
          onSubmit={handleBook}
          className="bg-gray-100 rounded-xl p-6 text-left"
        >
          <h3 className="text-lg font-semibold mb-4 text-blue-700">
            Book an Appointment
          </h3>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Day
              </label>
              <select
                value={selectedDay}
                onChange={(e) => {
                  setSelectedDay(e.target.value);
                  setSelectedSlot("");
                }}
                className="border rounded p-2 w-full"
              >
                <option value="">-- Select Day --</option>

                {doctor.availability &&
                  Object.keys(doctor.availability).map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Time Slot
              </label>
              <select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                className="border rounded p-2 w-full"
                disabled={!selectedDay}
              >
                <option value="">-- Select Time --</option>

                {selectedDay &&
                  doctor.availability[selectedDay]?.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* PATIENT INFO */}
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient Name
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Your full name"
                className="border rounded p-2 w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                placeholder="10-digit phone"
                className="border rounded p-2 w-full"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition w-full sm:w-auto"
          >
            Confirm Appointment
          </button>
        </form>
      </div>

      {/* FOOTER */}
      <footer className="mt-12 text-gray-500 text-sm">
        © 2025 MedBay — All rights reserved.
      </footer>
    </div>
  );
};

export default DoctorProfile;
