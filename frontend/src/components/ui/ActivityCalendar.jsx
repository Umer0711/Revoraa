import React, { useMemo, useState } from 'react';

export const ActivityCalendar = ({ history = [], days = 365 }) => {
  const [hoveredDay, setHoveredDay] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const { calendarData, maxTotal } = useMemo(() => {
    const today = new Date();
    const data = [];
    
    // Map of date string (YYYY-MM-DD) to activity metrics
    const historyMap = new Map();
    let max = 1;

    history.forEach(h => {
      const dateKey = h.date || h.activity_date;
      if (dateKey) {
        const solved = Number(h.solved || 0);
        const revised = Number(h.revised || 0);
        const total = Number(h.total || (solved + revised) || 1);
        if (total > max) max = total;
        historyMap.set(dateKey, {
          date: dateKey,
          solved,
          revised,
          total,
          active: true
        });
      }
    });

    // Generate days (default 365 days or current year)
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const iso = `${year}-${month}-${day}`;
      
      const record = historyMap.get(iso);
      data.push({
        date: iso,
        dateObj: d,
        active: !!record,
        solved: record?.solved || 0,
        revised: record?.revised || 0,
        total: record?.total || 0,
      });
    }

    // Grid starts on Sunday
    const firstDayOfWeek = new Date(data[0].date).getDay();
    const paddedData = Array(firstDayOfWeek).fill(null).concat(data);

    return { calendarData: paddedData, maxTotal: max };
  }, [history, days]);

  const getColor = (day) => {
    if (!day || !day.active || day.total === 0) {
      return 'rgba(255, 255, 255, 0.05)';
    }
    const t = day.total;
    if (t === 1) return 'rgba(34, 197, 94, 0.35)';
    if (t <= 3) return 'rgba(34, 197, 94, 0.6)';
    if (t <= 6) return 'rgba(34, 197, 94, 0.85)';
    return 'var(--color-strong)';
  };

  const handleMouseEnter = (day, e) => {
    if (!day) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: rect.left + rect.width / 2,
      y: rect.top - 8
    });
    setHoveredDay(day);
  };

  const formatTooltipDate = (dateStr) => {
    try {
      const [year, month, day] = dateStr.split('-');
      const d = new Date(year, month - 1, day);
      return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="activity-calendar" style={{ width: '100%', position: 'relative' }}>
      <div style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateRows: 'repeat(7, 1fr)', 
            gridAutoFlow: 'column', 
            gap: '4px',
            width: 'max-content'
          }}
        >
          {calendarData.map((day, i) => (
            <div 
              key={i} 
              onMouseEnter={(e) => handleMouseEnter(day, e)}
              onMouseLeave={() => setHoveredDay(null)}
              style={{
                width: '13px',
                height: '13px',
                borderRadius: '3px',
                backgroundColor: getColor(day),
                border: day && day.active ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,255,255,0.03)',
                transition: 'transform 0.12s ease, filter 0.12s ease',
                cursor: day ? 'pointer' : 'default',
                transform: hoveredDay === day ? 'scale(1.3)' : 'scale(1)',
                zIndex: hoveredDay === day ? 10 : 1
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating Tooltip */}
      {hoveredDay && (
        <div
          style={{
            position: 'fixed',
            left: mousePos.x,
            top: mousePos.y,
            transform: 'translate(-50%, -100%)',
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: '8px',
            padding: '0.55rem 0.85rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            zIndex: 1000,
            pointerEvents: 'none',
            minWidth: 150,
            whiteSpace: 'nowrap'
          }}
        >
          <p style={{ fontWeight: 650, fontSize: '0.8rem', color: 'var(--color-text-primary)', margin: '0 0 0.35rem 0' }}>
            {formatTooltipDate(hoveredDay.date)}
          </p>
          {hoveredDay.total > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--color-strong)', fontWeight: 600 }}>
                {hoveredDay.total} {hoveredDay.total === 1 ? 'activity' : 'activities'}
              </span>
              <span style={{ color: 'var(--color-text-muted)' }}>
                • {hoveredDay.solved} {hoveredDay.solved === 1 ? 'problem solved' : 'problems solved'}
              </span>
              <span style={{ color: 'var(--color-text-muted)' }}>
                • {hoveredDay.revised} {hoveredDay.revised === 1 ? 'revision' : 'revisions'}
              </span>
            </div>
          ) : (
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>
              No activity recorded
            </p>
          )}
        </div>
      )}

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
        <span>Less</span>
        <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.03)' }} />
        <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: 'rgba(34, 197, 94, 0.35)' }} />
        <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: 'rgba(34, 197, 94, 0.65)' }} />
        <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: 'var(--color-strong)' }} />
        <span>More</span>
      </div>
    </div>
  );
};
