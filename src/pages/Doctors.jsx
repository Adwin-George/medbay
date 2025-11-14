import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";

const Doctors = () => {
  const { doctors } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    patientName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
  });

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("search")?.toLowerCase() || "";
  const department = searchParams.get("department")?.toLowerCase() || "";

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(query) ||
      doc.specialty.toLowerCase().includes(query) ||
      doc.location.toLowerCase().includes(query);

    const matchesDept = department
      ? doc.department.toLowerCase() === department ||
        doc.specialty.toLowerCase() === department
      : true;

    return matchesSearch && matchesDept;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { patientName, email, phone, date, time } = formData;

    if (!patientName || !email || !phone || !date || !time) {
      alert("⚠️ Please fill all required fields.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert("⚠️ Please enter a valid 10-digit phone number.");
      return;
    }

    const allAppointments = JSON.parse(localStorage.getItem("appointments")) || [];

    const newAppointment = {
      id: Date.now(),
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      patientName,
      email,
      phone,
      date,
      time,
      status: "Pending",
    };

    const updatedAppointments = [...allAppointments, newAppointment];
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments));

    alert(`✅ Appointment booked with ${selectedDoctor.name}!`);
    setFormData({
      patientName: "",
      email: "",
      phone: "",
      date: "",
      time: "",
    });
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}>
          🩺 MedBay
        </h1>

        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
        >
          ← Back to Home
        </button>
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Available Doctors
      </h2>

      {filteredDoctors.length > 0 ? (
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-all text-center border border-blue-100"
            >
              <img
                src={doc.image}
                alt={doc.name}
                onError={(e) => {
                  e.target.src =
                    "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";
                }}
                className="w-24 h-24 mx-auto rounded-full mb-3 border border-blue-100 object-cover"
              />

              <h3 className="text-lg font-semibold text-gray-800">{doc.name}</h3>
              <p className="text-gray-500 text-sm">{doc.specialty}</p>
              <p className="text-gray-600 text-sm">{doc.location}</p>
              <p className="text-gray-700 text-sm font-medium mt-2">
                Fee: ₹{doc.fee}
              </p>

              <button
                onClick={() => {
                  setSelectedDoctor(doc);
                  setShowModal(true);
                }}
                className="mt-3 bg-blue-600 text-white text-sm px-4 py-2 rounded-full hover:bg-blue-700 transition"
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-20 text-lg">
          No doctors found for your search.
        </p>
      )}

      {/* BOOKING MODAL */}
      {showModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Book Appointment with {selectedDoctor.name}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Patient Name"
                className="w-full p-2 border rounded-lg"
                value={formData.patientName}
                onChange={(e) =>
                  setFormData({ ...formData, patientName: e.target.value })
                }
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-2 border rounded-lg"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full p-2 border rounded-lg"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />

              <div className="flex gap-2">
                <input
                  type="date"
                  className="w-1/2 p-2 border rounded-lg"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
                <input
                  type="time"
                  className="w-1/2 p-2 border rounded-lg"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;
