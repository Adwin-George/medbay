import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";

// helper to format 24h -> 12h
const formatTimeToAMPM = (time24) => {
  if (!time24) return "";
  const [hh, mm] = time24.split(":").map(Number);
  const ampm = hh >= 12 ? "PM" : "AM";
  const h12 = ((hh + 11) % 12) + 1;
  return `${h12}:${mm.toString().padStart(2, "0")} ${ampm}`;
};

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    doctors,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    appointments,
    approveAppointment,
    deleteAppointment,
  } = useData();

  // form / UI state
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    department: "",
    location: "",
    experience: "",
    fee: "",
    image: "",
    availability: {},
  });

  const [deptSelection, setDeptSelection] = useState("");
  const [customDept, setCustomDept] = useState("");
  const [expandedDoctorId, setExpandedDoctorId] = useState(null);
  const [tmpDay, setTmpDay] = useState("Monday");
  const [tmpStart, setTmpStart] = useState("09:00");
  const [tmpEnd, setTmpEnd] = useState("10:00");

  const formRef = useRef(null);
  const nameInputRef = useRef(null);

  // build dynamic department list
  const departmentOptions = useMemo(() => {
    const setNames = new Set();
    (doctors || []).forEach((d) => {
      const dep = (d.department || d.specialty || "").trim();
      if (dep) setNames.add(dep);
    });
    return Array.from(setNames).sort((a, b) => a.localeCompare(b));
  }, [doctors]);

  useEffect(() => {
    if (editingDoctor && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [editingDoctor]);

  const scrollToForm = () => {
    if (!formRef.current) return;
    formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    formRef.current.classList.add("ring-4", "ring-blue-300");
    setTimeout(
      () =>
        formRef.current && formRef.current.classList.remove("ring-4", "ring-blue-300"),
      1400
    );
  };

  // start editing an existing doctor
  const startEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name || "",
      specialty: doctor.specialty || "",
      department: doctor.department || "",
      location: doctor.location || "",
      experience: doctor.experience || "",
      fee: doctor.fee || "",
      image: doctor.image || "",
      availability: JSON.parse(JSON.stringify(doctor.availability || {})),
    });
    if (departmentOptions.includes(doctor.department)) {
      setDeptSelection(doctor.department);
      setCustomDept("");
    } else {
      setDeptSelection("custom");
      setCustomDept(doctor.department || "");
    }
    setTimeout(() => {
      scrollToForm();
      nameInputRef.current?.focus();
    }, 80);
  };

  // open blank add form
  const openAddForm = () => {
    setEditingDoctor(null);
    setFormData({
      name: "",
      specialty: "",
      department: "",
      location: "",
      experience: "",
      fee: "",
      image: "",
      availability: {},
    });
    setDeptSelection(departmentOptions.length ? departmentOptions[0] : "");
    setCustomDept("");
    setTimeout(scrollToForm, 80);
  };

  const cancelEdit = () => {
    setEditingDoctor(null);
    setFormData({
      name: "",
      specialty: "",
      department: "",
      location: "",
      experience: "",
      fee: "",
      image: "",
      availability: {},
    });
    setDeptSelection("");
    setCustomDept("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const department = deptSelection === "custom" ? customDept.trim() : deptSelection;
    if (!formData.name || !formData.specialty || !formData.location) {
      alert("Please fill required fields: name, specialty, location.");
      return;
    }
    const payload = {
      ...formData,
      department: department || formData.department || formData.specialty,
    };

    if (editingDoctor) {
      payload.id = editingDoctor.id;
      updateDoctor(payload);
      setEditingDoctor(null);
    } else {
      addDoctor(payload);
    }

    // reset
    setFormData({
      name: "",
      specialty: "",
      department: "",
      location: "",
      experience: "",
      fee: "",
      image: "",
      availability: {},
    });
    setDeptSelection("");
    setCustomDept("");
  };

  const handleDeleteDoctor = (id) => {
    if (!confirm("Delete this doctor? This will remove availability and related appointments.")) return;
    deleteDoctor(id);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  // Backup / Restore / Fix images / Fix duplicate departments
  const handleBackup = () => {
    const backup = {
      doctors: JSON.parse(localStorage.getItem("doctors") || "[]"),
      appointments: JSON.parse(localStorage.getItem("appointments") || "[]"),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "finddoctor-backup.json";
    link.click();
  };

  const handleRestore = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data.doctors) localStorage.setItem("doctors", JSON.stringify(data.doctors));
        if (data.appointments) localStorage.setItem("appointments", JSON.stringify(data.appointments));
        alert("✅ Backup restored! Refreshing...");
        window.location.reload();
      } catch {
        alert("❌ Invalid backup file");
      }
    };
    reader.readAsText(file);
  };

  const handleFixImages = () => {
    const defaultImg = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";
    const docs = JSON.parse(localStorage.getItem("doctors") || "[]");
    const updated = docs.map((d) => ({ ...d, image: d.image && d.image.trim() ? d.image : defaultImg }));
    localStorage.setItem("doctors", JSON.stringify(updated));
    alert("✅ Missing images fixed!");
    window.location.reload();
  };

  const handleFixDepartments = () => {
    // simple canonical mapping + capitalization
    const canonicalMap = {
      ent: "ENT",
      "ent specialist": "ENT",
      "e.n.t": "ENT",
      emt: "EMT",
      "emergency medicine": "Emergency Medicine",
    };
    const docs = JSON.parse(localStorage.getItem("doctors") || "[]");
    const normalize = (s) => {
      const key = (s || "").trim().toLowerCase();
      if (!key) return "";
      if (canonicalMap[key]) return canonicalMap[key];
      return s
        .replace(/\s+/g, " ")
        .replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
    };
    let changed = 0;
    const updated = docs.map((d) => {
      const nd = normalize(d.department);
      if ((d.department || "") !== nd) changed++;
      return { ...d, department: nd };
    });
    localStorage.setItem("doctors", JSON.stringify(updated));
    alert(`✅ Fixed ${changed} department(s). Reloading...`);
    window.location.reload();
  };

  // Availability helpers (add/remove slots)
  const addAvailabilitySlot = (doctor, day, start24, end24) => {
    if (!start24 || !end24) {
      alert("Please select valid start and end times.");
      return;
    }
    if (end24 <= start24) {
      alert("End time must be later than start time.");
      return;
    }
    const start = formatTimeToAMPM(start24);
    const end = formatTimeToAMPM(end24);
    const slot = `${start} - ${end}`;
    const newAvail = { ...(doctor.availability || {}) };
    if (!newAvail[day]) newAvail[day] = [];
    if (!newAvail[day].includes(slot)) newAvail[day].push(slot);
    updateDoctor({ ...doctor, availability: newAvail });
    setExpandedDoctorId(doctor.id);
  };

  const removeAvailabilitySlot = (doctor, day, slot) => {
    if (!confirm(`Remove slot "${slot}" from ${day} for ${doctor.name}?`)) return;
    const newAvail = { ...(doctor.availability || {}) };
    if (!newAvail[day]) return;
    newAvail[day] = newAvail[day].filter((s) => s !== slot);
    if (newAvail[day].length === 0) delete newAvail[day];
    updateDoctor({ ...doctor, availability: newAvail });
  };

  const sortedDoctors = [...(doctors || [])].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">🩺 Admin Dashboard</h1>
        <div className="flex items-center gap-3">
          <button onClick={openAddForm} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            + Add New Doctor
          </button>
          <button onClick={handleLogout} className="text-red-600 underline hover:text-red-800">
            Logout
          </button>
        </div>
      </div>

      {/* utilities */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button onClick={handleBackup} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          💾 Backup Data
        </button>

        <label className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer">
          📂 Restore Backup
          <input type="file" accept="application/json" className="hidden" onChange={handleRestore} />
        </label>

        <button onClick={handleFixImages} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          🖼 Fix Missing Images
        </button>

        <button onClick={handleFixDepartments} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          🔁 Fix Duplicate Departments
        </button>
      </div>

      {/* form */}
      <div ref={formRef} className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-2xl font-semibold mb-4">{editingDoctor ? `Editing: ${editingDoctor.name}` : "Add New Doctor"}</h2>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          <input ref={nameInputRef}
            value={formData.name}
            onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
            placeholder="Full name"
            className="border rounded p-2"
            required
          />

          <input
            value={formData.specialty}
            onChange={(e) => setFormData((f) => ({ ...f, specialty: e.target.value }))}
            placeholder="Specialty (e.g., Cardiology)"
            className="border rounded p-2"
            required
          />

          <div>
            <label className="text-sm text-gray-600 block mb-1">Department</label>
            <select
              value={deptSelection}
              onChange={(e) => {
                setDeptSelection(e.target.value);
                if (e.target.value !== "custom") setCustomDept("");
              }}
              className="border rounded p-2 w-full"
            >
              <option value="">-- select department --</option>
              {departmentOptions.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
              <option value="custom">Custom...</option>
            </select>
            {deptSelection === "custom" && (
              <input value={customDept} onChange={(e) => setCustomDept(e.target.value)} placeholder="Custom department (e.g., Emergency Medicine)" className="border rounded p-2 mt-2 w-full" />
            )}
          </div>

          <input
            value={formData.location}
            onChange={(e) => setFormData((f) => ({ ...f, location: e.target.value }))}
            placeholder="Location (City)"
            className="border rounded p-2"
            required
          />

          <input type="number"
            value={formData.experience}
            onChange={(e) => setFormData((f) => ({ ...f, experience: e.target.value }))}
            placeholder="Experience (years)"
            className="border rounded p-2"
          />

          <input type="number"
            value={formData.fee}
            onChange={(e) => setFormData((f) => ({ ...f, fee: e.target.value }))}
            placeholder="Fee (₹)"
            className="border rounded p-2"
          />

          <div className="col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Profile Image (optional)</label>
            <input type="file" accept="image/*" onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onloadend = () => setFormData((f) => ({ ...f, image: reader.result }));
              reader.readAsDataURL(file);
            }} className="w-full" />
            <div className="mt-2">
              <small className="text-gray-500">If left empty a professional default avatar will be used.</small>
            </div>
          </div>

          <div className="col-span-2 flex gap-3 mt-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              {editingDoctor ? "Save Changes" : "Add Doctor"}
            </button>
            {editingDoctor && (
              <button type="button" onClick={cancelEdit} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* doctors grid */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Doctors & Availability</h2>

        {sortedDoctors.length === 0 ? (
          <p className="text-gray-500">No doctors found.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedDoctors.map((doc) => (
              <div key={doc.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center gap-4">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"; }}
                    className="w-20 h-20 rounded-full object-cover border"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{doc.name}</h3>
                    <p className="text-sm text-gray-600">{doc.specialty} • {doc.department}</p>
                    <p className="text-sm text-gray-500">{doc.location}</p>
                    <p className="text-sm text-gray-500">Fee: ₹{doc.fee ?? "N/A"}</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button onClick={() => startEdit(doc)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Edit</button>
                  <button onClick={() => handleDeleteDoctor(doc.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                  <button onClick={() => setExpandedDoctorId((id) => (id === doc.id ? null : doc.id))} className="ml-auto bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                    {expandedDoctorId === doc.id ? "Close" : "Edit Availability"}
                  </button>
                </div>

                {expandedDoctorId === doc.id && (
                  <div className="mt-4 bg-gray-50 p-3 rounded">
                    <h4 className="font-semibold mb-2">Availability</h4>

                    {doc.availability && Object.keys(doc.availability).length > 0 ? (
                      Object.entries(doc.availability).map(([day, slots]) => (
                        <div key={day} className="mb-2">
                          <div className="font-medium">{day}</div>
                          <ul className="mt-1">
                            {slots.map((slot) => (
                              <li key={slot} className="flex justify-between bg-white p-2 rounded mt-1">
                                <span>{slot}</span>
                                <button onClick={() => removeAvailabilitySlot(doc, day, slot)} className="text-red-600 underline text-sm">Remove</button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 mb-3">No availability set yet.</p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-end">
                      <select value={tmpDay} onChange={(e) => setTmpDay(e.target.value)} className="border rounded p-2">
                        {daysOfWeek.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>

                      <div>
                        <label className="text-xs text-gray-600">Start</label>
                        <input type="time" value={tmpStart} onChange={(e) => setTmpStart(e.target.value)} className="border rounded p-2 w-full" />
                      </div>

                      <div>
                        <label className="text-xs text-gray-600">End</label>
                        <input type="time" value={tmpEnd} onChange={(e) => setTmpEnd(e.target.value)} className="border rounded p-2 w-full" />
                      </div>

                      <button onClick={() => addAvailabilitySlot(doc, tmpDay, tmpStart, tmpEnd)} className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700">
                        + Add
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Appointments */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-blue-700 flex items-center gap-2">🗓️ Appointments</h2>

        {(!appointments || appointments.length === 0) ? (
          <div className="text-gray-500 bg-white rounded-lg shadow p-6 text-center">No appointments yet.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((a) => (
              <div key={a.id} className={`bg-white p-5 rounded-xl shadow border border-gray-100 hover:shadow-lg transition ${a.status === "Confirmed" ? "opacity-80" : ""}`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-1">🧑‍⚕️ {a.doctorName}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">👤 {a.patientName || "Unknown"}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">📞 {a.patientPhone || "No phone"}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-sm font-semibold ${a.status === "Confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {a.status}
                  </div>
                </div>

                <div className="border-t border-gray-200 my-2" />

                <div className="flex items-center gap-2 text-sm text-gray-700 mb-4">📅 <span>{a.time}</span></div>

                <div className="flex gap-2">
                  {a.status !== "Confirmed" && (
                    <button onClick={() => approveAppointment(a.id)} className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700">Confirm</button>
                  )}
                  <button onClick={() => deleteAppointment(a.id)} className="flex-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
