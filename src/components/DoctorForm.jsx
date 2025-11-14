import React, { useState } from "react";

const DoctorForm = ({ onAddDoctor }) => {
  const [form, setForm] = useState({
    name: "",
    specialty: "",
    location: "",
    experience: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.specialty) return;
    onAddDoctor({ ...form, id: Date.now() });
    setForm({ name: "", specialty: "", location: "", experience: "" });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Add New Doctor</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Doctor Name"
          value={form.name}
          onChange={handleChange}
          className="p-2 border rounded-lg"
        />
        <input
          type="text"
          name="specialty"
          placeholder="Specialty"
          value={form.specialty}
          onChange={handleChange}
          className="p-2 border rounded-lg"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="p-2 border rounded-lg"
        />
        <input
          type="number"
          name="experience"
          placeholder="Experience (Years)"
          value={form.experience}
          onChange={handleChange}
          className="p-2 border rounded-lg"
        />
        <button
          type="submit"
          className="col-span-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add Doctor
        </button>
      </form>
    </div>
  );
};

export default DoctorForm;
