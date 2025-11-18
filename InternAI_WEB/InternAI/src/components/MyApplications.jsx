import React, { useEffect, useState } from "react";
import axios from "axios";

const MyApplications = ({ userId }) => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/applications/user/${userId}`)
      .then((res) => {
        setApplications(res.data);
      })
      .catch((err) => {
        console.error("Başvurular çekilemedi", err);
      });
  }, [userId]);

  return (
    <div>
      <h2>Başvurularım</h2>
      {applications.length === 0 ? (
        <p>Hiç başvurunuz yok.</p>
      ) : (
        <ul>
          {applications.map((app) => (
            <li key={app.id}>
              <strong>İlan Başlığı:</strong> {app.jobPost.title} <br />
              <strong>Durum:</strong> {app.status} <br />
              <strong>Kapak Mektubu:</strong> {app.coverLetter}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyApplications;
