import React, { useState, useMemo } from "react";
import EventForm from "../components/EventForm";
import EventCard from "../components/EventCard";
import { Search, SlidersHorizontal } from "lucide-react";

export default function EventPage({
  user,
  events,
  editEvent,
  onEventChange,
  onEventSubmit,
  onRSVP,
  onEdit,
  onDelete,
  token,
  onCommentPosted,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);

  const filteredEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return events
      .filter((event) => {
        const searchLower = searchTerm.toLowerCase();
        const searchMatch =
          event.title?.toLowerCase().includes(searchLower) ||
          // BUG FIX: Guard against null location before calling .toLowerCase()
          (event.location || "").toLowerCase().includes(searchLower) ||
          event.tags?.some((tag) =>
            tag.toLowerCase().includes(searchLower)
          );

        if (!searchMatch) return false;

        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);

        switch (dateFilter) {
          case "today":
            return eventDate.getTime() === today.getTime();
          case "week":
            return eventDate >= today && eventDate <= endOfWeek;
          case "month":
            return eventDate >= today && eventDate <= endOfMonth;
          case "upcoming":
            return eventDate >= today;
          case "past":
            return eventDate < today;
          default:
            return true;
        }
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [events, searchTerm, dateFilter]);

  const handleEditAndScroll = (event) => {
    onEdit(event);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    await onEventSubmit(e);
    setShowForm(false);
  };

  return (
    <>
      {user.role === "admin" && (
        <div className="admin-form-section">
          <button
            className="btn-outline toggle-form-btn"
            onClick={() => {
              setShowForm((v) => !v);
              if (showForm) onEdit(null); // clear edit state when closing
            }}
          >
            {showForm ? "✕ Close Form" : editEvent?._id ? "✎ Edit Event" : "+ Create Event"}
          </button>

          {(showForm || editEvent?._id) && (
            <EventForm
              editEvent={editEvent}
              onChange={onEventChange}
              onSubmit={handleSubmit}
              onCancel={() => { setShowForm(false); onEdit(null); }}
            />
          )}
        </div>
      )}

      <div className="filter-container fade-in">
        <div className="filter-header">
          <SlidersHorizontal size={18} />
          <span>Filter Events</span>
          <span className="event-count">
            {filteredEvents.length} of {events.length} events
          </span>
        </div>

        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by title, location, or tag…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="clear-search"
              onClick={() => setSearchTerm("")}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="filter-buttons">
          {["all", "upcoming", "today", "week", "month", "past"].map((f) => (
            <button
              key={f}
              className={dateFilter === f ? "active" : ""}
              onClick={() => setDateFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="event-grid fade-in" style={{ marginTop: "2rem" }}>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              user={user}
              onRSVP={onRSVP}
              onEdit={handleEditAndScroll}
              onDelete={onDelete}
              token={token}
              onCommentPosted={onCommentPosted}
            />
          ))
        ) : (
          <div className="empty-state">
            <p>🔍 No events found matching your criteria.</p>
            {searchTerm && (
              <button className="btn-outline" onClick={() => setSearchTerm("")}>
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
