import React, { useState, useEffect } from "react";

interface MedicalRecord {
  id: string;
  date: string;
  doctorName: string;
  department: string;
  diagnosis: string;
  notes: string;
}

export const MedicalHistory: React.FC = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { fetchRecords(); }, []);

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/medical-records/patient/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setRecords(data.data);
    } catch (err) { console.error("Failed to fetch records:", err); }
    finally { setLoading(false); }
  };

  const filteredRecords = records.filter(
    (r) => r.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading medical history...</div>;

  return (
    <div className="medical-history">
      <h2>Medical History</h2>
      <div className="search-bar">
        <input type="text" placeholder="Search by diagnosis, doctor, or department..."
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
      </div>
      <div className="records-list">
        {filteredRecords.length === 0 ? (
          <p className="no-records">No medical records found.</p>
        ) : (
          filteredRecords.map((record) => (
            <div key={record.id} className="record-card" onClick={() => setSelectedRecord(record)}>
              <div className="record-header">
                <span className="record-date">{record.date}</span>
                <span className="record-dept">{record.department}</span>
              </div>
              <h4 className="record-diagnosis">{record.diagnosis}</h4>
              <p className="record-doctor">Dr. {record.doctorName}</p>
            </div>
          ))
        )}
      </div>
      {selectedRecord && (
        <div className="record-detail-overlay" onClick={() => setSelectedRecord(null)}>
          <div className="record-detail" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedRecord.diagnosis}</h3>
            <p><strong>Date:</strong> {selectedRecord.date}</p>
            <p><strong>Doctor:</strong> Dr. {selectedRecord.doctorName}</p>
            <p><strong>Department:</strong> {selectedRecord.department}</p>
            <p><strong>Notes:</strong> {selectedRecord.notes}</p>
            <button onClick={() => setSelectedRecord(null)} className="btn">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
