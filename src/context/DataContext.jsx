import React, { createContext, useContext, useState, useEffect } from "react";

const DataContext = createContext();

// Default avatar for all doctors
const defaultDoctorImage = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";

export const DataProvider = ({ children }) => {
  // Normalize department/specialty
  const normalize = (text) => {
    if (!text) return "";
    return text
      .trim()
      .replace(/\s+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Load doctors
  const [doctors, setDoctors] = useState(() => {
    try {
      const saved = localStorage.getItem("doctors");
      if (saved) return JSON.parse(saved);
    } catch (err) {
      console.error("Error loading doctors:", err);
    }

    // Default seed doctors
    return [
      {
        id: 1,
        name: "Dr. Rohan Patel",
        specialty: "Cardiology",
        department: "Cardiology",
        location: "Ahmedabad",
        experience: 12,
        fee: 1000,
        image: defaultDoctorImage,
        availability: { Monday: ["9:00 AM - 12:00 PM"], Thursday: ["2:00 PM - 5:00 PM"] },
      },
      {
        id: 2,
        name: "Dr. Meera Sharma",
        specialty: "Dermatology",
        department: "Dermatology",
        location: "Mumbai",
        experience: 9,
        fee: 700,
        image: defaultDoctorImage,
        availability: { Tuesday: ["10:00 AM - 1:00 PM"], Friday: ["3:00 PM - 6:00 PM"] },
      },
      {
        id: 3,
        name: "Dr. Arjun Rao",
        specialty: "Orthopedics",
        department: "Orthopedics",
        location: "Hyderabad",
        experience: 11,
        fee: 850,
        image: defaultDoctorImage,
        availability: { Wednesday: ["9:00 AM - 11:00 AM"], Saturday: ["1:00 PM - 4:00 PM"] },
      },
      {
        id: 4,
        name: "Dr. Anjali Verma",
        specialty: "Pediatrics",
        department: "Pediatrics",
        location: "Bangalore",
        experience: 10,
        fee: 800,
        image: defaultDoctorImage,
        availability: { Monday: ["10:00 AM - 12:00 PM"], Thursday: ["4:00 PM - 6:00 PM"] },
      },
      {
        id: 5,
        name: "Dr. Vikram Singh",
        specialty: "Neurology",
        department: "Neurology",
        location: "Delhi",
        experience: 14,
        fee: 1200,
        image: defaultDoctorImage,
        availability: { Tuesday: ["9:00 AM - 11:00 AM"], Friday: ["2:00 PM - 5:00 PM"] },
      },
      {
        id: 6,
        name: "Dr. Sneha Iyer",
        specialty: "Gynecology",
        department: "Gynecology",
        location: "Chennai",
        experience: 8,
        fee: 750,
        image: defaultDoctorImage,
        availability: { Wednesday: ["10:00 AM - 12:00 PM"], Saturday: ["3:00 PM - 5:00 PM"] },
      },
      {
        id: 7,
        name: "Dr. Rajesh Khanna",
        specialty: "Psychiatry",
        department: "Psychiatry",
        location: "Pune",
        experience: 13,
        fee: 900,
        image: defaultDoctorImage,
        availability: { Monday: ["11:00 AM - 1:00 PM"], Friday: ["2:00 PM - 4:00 PM"] },
      },
      {
        id: 8,
        name: "Dr. Priya Desai",
        specialty: "Ophthalmology",
        department: "Ophthalmology",
        location: "Surat",
        experience: 7,
        fee: 650,
        image: defaultDoctorImage,
        availability: { Tuesday: ["9:00 AM - 11:00 AM"], Thursday: ["1:00 PM - 3:00 PM"] },
      },
      {
        id: 9,
        name: "Dr. Aakash Nair",
        specialty: "Dentistry",
        department: "Dentistry",
        location: "Kochi",
        experience: 6,
        fee: 600,
        image: defaultDoctorImage,
        availability: { Wednesday: ["10:00 AM - 12:00 PM"], Friday: ["3:00 PM - 5:00 PM"] },
      },
      {
        id: 10,
        name: "Dr. Kavita Joshi",
        specialty: "ENT",
        department: "ENT",
        location: "Jaipur",
        experience: 9,
        fee: 700,
        image: defaultDoctorImage,
        availability: { Monday: ["9:00 AM - 12:00 PM"], Thursday: ["2:00 PM - 6:00 PM"] },
      },
    ];
  });

  // Load appointments
  const [appointments, setAppointments] = useState(() => {
    try {
      const saved = localStorage.getItem("appointments");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save doctors
  useEffect(() => {
    try {
      localStorage.setItem("doctors", JSON.stringify(doctors));
    } catch (err) {
      console.error("Failed saving doctors:", err);
    }
  }, [doctors]);

  // Save appointments
  useEffect(() => {
    try {
      localStorage.setItem("appointments", JSON.stringify(appointments));
    } catch (err) {
      console.error("Failed saving appointments:", err);
    }
  }, [appointments]);

  // CRUD Operations
  const addDoctor = (newDoctor) =>
    setDoctors((prev) => [
      ...prev,
      {
        ...newDoctor,
        id: Date.now(),
        image: newDoctor.image || defaultDoctorImage,
        department: normalize(newDoctor.department),
        specialty: normalize(newDoctor.specialty),
      },
    ]);

  const updateDoctor = (updatedDoctor) =>
    setDoctors((prev) =>
      prev.map((doc) =>
        doc.id === updatedDoctor.id
          ? {
              ...updatedDoctor,
              department: normalize(updatedDoctor.department),
              specialty: normalize(updatedDoctor.specialty),
            }
          : doc
      )
    );

  const deleteDoctor = (id) =>
    setDoctors((prev) => prev.filter((d) => d.id !== id));

  const bookAppointment = (doctorId, time, patientName, patientPhone) => {
    const doctor = doctors.find((d) => d.id === doctorId);
    if (!doctor) return;

    const newAppointment = {
      id: Date.now(),
      doctorId,
      doctorName: doctor.name,
      time,
      patientName,
      patientPhone,
      status: "Pending",
    };

    setAppointments((prev) => [...prev, newAppointment]);
  };

  const approveAppointment = (id) =>
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Confirmed" } : a))
    );

  const deleteAppointment = (id) =>
    setAppointments((prev) => prev.filter((a) => a.id !== id));

  return (
    <DataContext.Provider
      value={{
        doctors,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        appointments,
        bookAppointment,
        approveAppointment,
        deleteAppointment,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
