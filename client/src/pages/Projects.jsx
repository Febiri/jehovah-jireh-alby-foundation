import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import ProjectCard from '../components/ProjectCard';
import { Calendar, CheckCircle2, Clock, Filter, Sparkles } from 'lucide-react';

export default function Projects() {
  const { projects } = useContent();
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredProjects = projects.filter((p) => {
    if (activeFilter === 'all') return true;
    return (p.status || '').toLowerCase() === activeFilter;
  });

  const upcomingCount = projects.filter(p => (p.status || '').toLowerCase() === 'upcoming').length;
  const currentCount = projects.filter(p => (p.status || '').toLowerCase() === 'current').length;
  const completedCount = projects.filter(p => (p.status || '').toLowerCase() === 'completed').length;

  return (
    <div>
      {/* Header */}
      <section className="section-navy" style={{ padding: '4.5rem 0 3.5rem', textAlign: 'center' }}>
        <div className="container">
          <span className="section-tag" style={{ background: 'rgba(212, 175, 55, 0.2)', color: 'var(--gold-300)', borderColor: 'rgba(212, 175, 55, 0.35)' }}>
            Outreach Initiatives
          </span>
          <h1 className="hero-title" style={{ fontSize: '2.75rem', marginBottom: '1rem' }}>
            Projects &amp; Charity Events
          </h1>
          <p style={{ maxWidth: '720px', margin: '0 auto', fontSize: '1.15rem', color: '#cbd5e1', lineHeight: '1.7' }}>
            Explore our completed, ongoing, and upcoming charity missions across Cherubs and other orphanage homes in Ghana.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section">
        <div className="container">
          {/* Filter Bar */}
          <div className="gallery-filter-bar">
            <button
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All Projects ({projects.length})
            </button>
            <button
              className={`filter-btn ${activeFilter === 'upcoming' ? 'active' : ''}`}
              onClick={() => setActiveFilter('upcoming')}
            >
              Upcoming ({upcomingCount})
            </button>
            <button
              className={`filter-btn ${activeFilter === 'current' ? 'active' : ''}`}
              onClick={() => setActiveFilter('current')}
            >
              Current ({currentCount})
            </button>
            <button
              className={`filter-btn ${activeFilter === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveFilter('completed')}
            >
              Completed ({completedCount})
            </button>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--bg-light)', borderRadius: 'var(--radius-lg)' }}>
              <Sparkles size={36} style={{ color: 'var(--gold-500)', marginBottom: '1rem' }} />
              <h3 style={{ color: 'var(--navy-900)', marginBottom: '0.5rem' }}>No projects found in this category</h3>
              <p style={{ color: 'var(--text-muted)' }}>The foundation administrator can add or schedule new projects at any time from the dashboard.</p>
            </div>
          ) : (
            <div className="activities-grid">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
