import React, { useState } from "react";

export const FeedbackPage: React.FC<{
  appointmentId: string;
  doctorId: string;
  onSubmit: () => void;
}> = ({ appointmentId, doctorId, onSubmit }) => {
  const [formData, setFormData] = useState({ rating: 0, comment: "", isAnonymous: false });
  const [submitting, setSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.rating === 0) { alert("Please select a rating"); return; }
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ appointmentId, doctorId, ...formData }),
      });
      if (res.ok) onSubmit();
    } catch (err) { console.error("Failed to submit feedback:", err); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="feedback-page">
      <h2>Rate Your Experience</h2>
      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="rating-section">
          <label>Rating</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star}
                className={`star ${star <= (hoveredStar || formData.rating) ? "filled" : ""}`}
                onClick={() => setFormData({ ...formData, rating: star })}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}>★</span>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Comment (optional)</label>
          <textarea value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            placeholder="Share your experience..." maxLength={500} rows={4} />
          <small>{formData.comment.length}/500</small>
        </div>
        <div className="form-group checkbox-group">
          <label>
            <input type="checkbox" checked={formData.isAnonymous}
              onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })} />
            Submit anonymously
          </label>
        </div>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
};
