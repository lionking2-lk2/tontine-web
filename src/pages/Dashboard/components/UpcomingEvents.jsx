import "./UpcomingEvents.css";

const events = [
  {
    group: "Tontine Famille",
    contribution: "20 000 FCFA",
    remaining: "Dans 2 jours",
  },
  {
    group: "Tontine Étudiants",
    contribution: "10 000 FCFA",
    remaining: "Dans 5 jours",
  },
];

const UpcomingEvents = () => {
  return (
    <section className="upcoming-events">
      <div className="section-header">
        <h2>📅 Échéances importantes</h2>
      </div>

      <div className="events-list">
        {events.map((event, index) => (
          <div className="event-card" key={index}>
            <div className="event-time">
              <span className="event-icon">⏰</span>
              <span>{event.remaining}</span>
            </div>

            <div className="event-details">
              <h4>{event.group}</h4>
              <p>
                Cotisation : <strong>{event.contribution}</strong>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UpcomingEvents;