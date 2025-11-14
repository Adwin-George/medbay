import React from "react";

const DoctorTable = ({ doctors, onDelete }) => {
  if (doctors.length === 0)
    return (
      <p className="text-gray-500 text-center mt-6">
        No doctors added yet. Use the form above.
      </p>
    );

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">All Doctors</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Specialty</th>
            <th className="p-2">Location</th>
            <th className="p-2">Experience</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doc) => (
            <tr key={doc.id} className="border-t">
              <td className="p-2">{doc.name}</td>
              <td className="p-2">{doc.specialty}</td>
              <td className="p-2">{doc.location}</td>
              <td className="p-2">{doc.experience}</td>
              <td className="p-2">
                <button
                  onClick={() => onDelete(doc.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorTable;
