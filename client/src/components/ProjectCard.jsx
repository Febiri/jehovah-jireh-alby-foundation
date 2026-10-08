import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Heart, ArrowRight } from 'lucide-react';

export default function ProjectCard({ project }) {
  if (!project) return null;

  const getStatusBadge = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'completed':
        return <span className="project-status-badge status-completed">Completed Outreach</span>;
      case 'current':
        return <span className="project-status-badge status-current">Current Project</span>;
      default:
        return <span className="project-status-badge status-upcoming">Upcoming Project</span>;
    }
  };

  const formattedDate = project.date
    ? new Date(project.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  return (
    <div className="activity-card" style={{ height: '100%' }}>
      <div className="activity-image-box" style={{ height: '240px' }}>
        <img
          src={project.image || '/images/cherubs-outreach.jpg'}
          alt={project.title}
          loading="lazy"
        />
        {getStatusBadge(project.status)}
      </div>

      <div className="activity-content">
        <div className="project-meta-pills" style={{ marginBottom: '0.85rem' }}>
          {project.location && (
            <span className="project-meta-pill">
              <MapPin size={13} style={{ color: 'var(--gold-600)' }} />
              {project.location}
            </span>
          )}
          {project.date && (
            <span className="project-meta-pill">
              <Calendar size={13} style={{ color: 'var(--navy-600)' }} />
              {formattedDate}
            </span>
          )}
          {project.time && (
            <span className="project-meta-pill">
              <Clock size={13} style={{ color: 'var(--navy-600)' }} />
              {project.time}
            </span>
          )}
        </div>

        <h3 className="activity-title" style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>
          {project.title}
        </h3>

        <p className="activity-description" style={{ marginBottom: '1.5rem', flexGrow: 1 }}>
          {project.description}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
          <Link to="/donate" className="btn btn-sm btn-gold">
            <Heart size={14} fill="var(--navy-950)" />
            <span>Support This Work</span>
          </Link>

          <Link to={`/projects`} className="btn btn-sm btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>Details</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
