import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "./context/DataContext";

const App = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { doctors = [] } = useData();

  // Normalize department to avoid duplicates — ENT fix + Dentist + others
  const normalizeDept = (s = "") => {
    const key = s.trim().toLowerCase();

    if (
      key === "ent" ||
      key === "e.n.t" ||
      key === "ent specialist" ||
      key === "ear nose throat"
    ) {
      return "ENT";
    }

    return s
      .trim()
      .replace(/\s+/g, " ")
      .replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
  };

  // Build proper department list based on real stored doctors
  const departments = useMemo(() => {
    const map = new Map();

    doctors.forEach((doc) => {
      const dep = normalizeDept(doc.department || doc.specialty || "General");
      const icon = getDepartmentIcon(dep);

      if (!map.has(dep)) {
        map.set(dep, { name: dep, icon, count: 1 });
      } else {
        map.get(dep).count += 1;
      }
    });

    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [doctors]);

  const topDoctors = doctors.slice(0, 4);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/doctors?search=${encodeURIComponent(query)}`);
    }
  };

  const handleDepartmentClick = (dept) => {
    navigate(`/doctors?department=${dept}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center text-gray-800">

      {/* HEADER */}
      <header className="w-full max-w-6xl flex justify-between items-center py-6 px-6">
        <h1
          onClick={() => navigate("/")}
          className="text-3xl font-bold text-blue-700 flex items-center gap-2 cursor-pointer"
        >
          🩺 MedBay
        </h1>

        <nav className="flex gap-6 text-gray-700 font-medium">
          <a href="/" className="hover:text-blue-600">Home</a>
          <a href="/doctors" className="hover:text-blue-600">Doctors</a>
          <a href="#" className="hover:text-blue-600">About</a>
          <a href="#" className="hover:text-blue-600">Contact</a>

          <a
            href="/admin"
            className="ml-4 bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition"
          >
            Admin Login
          </a>
        </nav>
      </header>

      {/* HERO */}
      <section className="text-center mt-12 px-6">
        <h2 className="text-5xl font-extrabold text-gray-800 mb-4 tracking-tight">
          Find the <span className="text-blue-700">Right Doctor</span> for You
        </h2>

        <p className="text-gray-600 max-w-xl mx-auto text-lg">
          Browse top specialists, view profiles, and book appointments instantly — all in one place.
        </p>

        <button
          onClick={() => navigate("/doctors")}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-full shadow hover:bg-blue-700 transition transform hover:scale-105"
        >
          Book Instantly →
        </button>
      </section>

      {/* SEARCH BAR */}
      <form
        onSubmit={handleSearch}
        className="mt-10 w-full max-w-xl bg-white/80 backdrop-blur-md shadow-lg rounded-full flex items-center px-4 py-2 border border-blue-100"
      >
        <span className="text-gray-400 text-xl mr-3">🔍</span>

        <input
          type="text"
          placeholder="Search by name, specialty, or location..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent focus:outline-none text-gray-700 text-base"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      {/* DEPARTMENTS */}
      <section className="max-w-6xl w-full mt-16 px-6">
        <h3 className="text-2xl font-semibold text-blue-700 mb-8 text-center">
          Browse by Department
        </h3>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {departments.map((dept) => (
            <button
              key={dept.name}
              onClick={() => handleDepartmentClick(dept.name)}
              className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1 border border-blue-100 text-center"
            >
              <div className="text-4xl mb-3">{dept.icon}</div>
              <h3 className="text-lg font-semibold text-blue-700">{dept.name}</h3>

              <p className="text-gray-500 text-sm mt-1">
                {dept.count} doctor{dept.count > 1 ? "s" : ""}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="w-32 h-1 bg-blue-200 my-12 rounded-full"></div>

      {/* TOP SPECIALISTS */}
      <section className="max-w-6xl w-full text-center px-6">
        <h3 className="text-2xl font-semibold text-blue-700 mb-8">
          Top Specialists
        </h3>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          {topDoctors.map((doc, index) => (
            <div
              key={doc.id}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-all text-center animate-fadeIn"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={doc.image}
                alt={doc.name}
                onError={(e) =>
                  (e.target.src = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png")
                }
                className="w-24 h-24 mx-auto rounded-full mb-3 border border-blue-100 object-cover"
              />

              <h4 className="text-lg font-semibold text-gray-800">{doc.name}</h4>
              <p className="text-gray-500 text-sm">{doc.specialty}</p>
              <p className="text-gray-600 text-sm mb-3">{doc.location}</p>

              <button
                onClick={() => navigate(`/doctors?search=${doc.name}`)}
                className="bg-blue-600 text-white text-sm px-4 py-2 rounded-full hover:bg-blue-700 transition"
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-20 py-6 text-gray-500 text-sm text-center border-t border-blue-100 w-full">
        © 2025 MedBay — All rights reserved.
      </footer>
    </div>
  );
};

// Icons by department
function getDepartmentIcon(name) {
  const n = name.toLowerCase();
  if (n.includes("cardio")) return "❤️";
  if (n.includes("derma")) return "🧴";
  if (n.includes("pedia")) return "🧸";
  if (n.includes("ortho")) return "🦴";
  if (n.includes("psych")) return "🧠";
  if (n.includes("neuro")) return "⚡";
  if (n.includes("gyne")) return "🌸";
  if (n.includes("ophthal") || n.includes("eye")) return "👁️";
  if (n.includes("dent")) return "🦷";
  if (n.includes("ent")) return "👂";
  return "💊";
}

export default App;
