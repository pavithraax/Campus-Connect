import React, { useState, useEffect } from "react";
import {
  Edit,
  Trash2,
  Users,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Calendar,
  MapPin,
} from "lucide-react";
import CommentSection from "./CommentSection";

export default function EventCard({
  event = {},
  user = {},
  onRSVP,
  onEdit,
  onDelete,
  token,
  onCommentPosted,
}) {
  const [showAttendees, setShowAttendees] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);

  const rsvps = event.rsvps || [];
  const comments = event.comments || [];
  const isAdmin = user?.role === "admin";

  // BUG FIX: Use consistent ID comparison — user.id comes from JWT (string ObjectId)
  // rsvps are populated objects with ._id (ObjectId), so we compare toString()
  const currentUserId = user?.id || user?._id;

  useEffect(() => {
    const enrolled = rsvps.some(
      (r) =>
        // Populated object: r._id is an ObjectId, compare as string
        r?._id?.toString() === currentUserId?.toString() ||
        r?.toString() === currentUserId?.toString()
    );
    setIsEnrolled(enrolled);
  }, [rsvps, currentUserId]);

  const handleEnroll = async () => {
    if (loading || isEnrolled) return;
    try {
      setLoading(true);
      await onRSVP(event._id);
    } catch (err) {
      console.error("Enroll failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // BUG FIX: Guard against undefined date
  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Date TBD";

  const isPast = event.date && new Date(event.date) < new Date();

  return (
    <div className={`event-card fade-in ${isPast ? "event-card-past" : ""}`}>
      {isPast && <span className="past-badge">Past Event</span>}

      {event.image && (
        <div
          className="event-media"
          style={{
            height: 140,
            borderRadius: 10,
            marginBottom: 12,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundImage: `url(${event.image})`,
          }}
        />
      )}

      <div>
        <h3>{event.title}</h3>
        <p className="event-description">{event.description}</p>

        <p className="event-detail">
          <Calendar size={14} />
          <strong>Date:</strong> {formattedDate}
        </p>
        <p className="event-detail">
          <MapPin size={14} />
          {/* BUG FIX: Guard against null/undefined location */}
          <strong>Venue:</strong> {event.location || "Not specified"}
        </p>

        {event.tags && event.tags.length > 0 && event.tags[0] !== "" && (
          <div className="event-tags">
            {event.tags.map((tag, i) => (
              <span key={i} className="event-tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="event-footer" style={{ marginTop: "1rem" }}>
        <div className="event-stats">
          <div className="stat-item">
            <Users size={16} />
            <span>{rsvps.length} Enrolled</span>
          </div>
          <div className="stat-item">
            <MessageSquare size={16} />
            <span>{comments.length} Comments</span>
          </div>
        </div>

        <div className="event-actions">
          {!isAdmin && (
            <button
              className={`btn-primary ${isEnrolled ? "btn-enrolled" : ""}`}
              onClick={handleEnroll}
              disabled={loading || isEnrolled || isPast}
              style={{ minWidth: "120px" }}
            >
              {loading
                ? "Enrolling..."
                : isEnrolled
                ? "✓ Enrolled"
                : isPast
                ? "Event Ended"
                : "Enroll Now"}
            </button>
          )}

          {isAdmin && (
            <>
              <button
                className="btn-outline"
                onClick={() => onEdit(event)}
                title="Edit event"
              >
                <Edit size={15} /> Edit
              </button>
              <button
                className="btn-outline btn-danger"
                onClick={() => onDelete(event._id)}
                title="Delete event"
              >
                <Trash2 size={15} /> Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="event-toggle-bar">
        {isAdmin && rsvps.length > 0 && (
          <button
            className="btn-toggle"
            onClick={() => setShowAttendees(!showAttendees)}
          >
            {showAttendees ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            {showAttendees ? "Hide" : "View"} Enrolled ({rsvps.length})
          </button>
        )}
        <button
          className="btn-toggle"
          onClick={() => setShowComments(!showComments)}
        >
          {showComments ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          {showComments ? "Hide" : "Show"} Discussion
        </button>
      </div>

      {isAdmin && showAttendees && (
        <div className="rsvp-dropdown">
          <strong>Enrolled Students:</strong>
          <ul className="rsvp-list">
            {rsvps.map((r, i) => (
              <li key={i}>
                <span className="rsvp-name">{r?.name || "Unknown"}</span>
                <span className="rsvp-email">{r?.email}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showComments && (
        <CommentSection
          eventId={event._id}
          comments={comments}
          token={token}
          onCommentPosted={onCommentPosted}
        />
      )}
    </div>
  );
}
