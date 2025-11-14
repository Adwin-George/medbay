import React, { useState } from "react";
import { useData } from "../context/DataContext.jsx";
import { Link } from "react-router-dom";

export default function TopSpecialists() {
  const { doctors, defaultAvatar } = useData();
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(doctors.map((d) => d.specialty)))];
  const filtered = activeCategory === "All" ? doctors : doctors.filter((d) => d.specialty === activeCategory);

  const handleImgError = (e) => {
    if (e && e.target) e.target.src = defaultAvatar;
  };

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Browse by Department</h2>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${activeCategory===cat ? "bg-blue-600 text-white" : "bg-white border text-gray-700"}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-2xl shadow-md p-6 text-center">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-32 h-32 mx-auto rounded-full mb-4 object-cover"
                onError={handleImgError}
              />
              <h3 className="text-lg font-semibold text-gray-800">{doctor.name}</h3>
              <p className="text-blue-600">{doctor.specialty}</p>
              <p className="text-gray-500 text-sm mb-4">{doctor.location}</p>
              <div className="flex justify-center gap-3">
                <Link to={`/doctor/${doctor.id}`} className="px-4 py-2 bg-blue-600 text-white rounded-lg">View Profile</Link>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-gray-500">No doctors in this category.</p>}
        </div>
      </div>
    </section>
  );
}
