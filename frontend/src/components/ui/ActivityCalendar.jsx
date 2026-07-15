import React, { useMemo } from 'react';

export const ActivityCalendar = ({ history = [], days = 140 }) => {
  const calendarData = useMemo(() => {
    const today = new Date();
    const data = [];
    
    // Create a Set of active dates (YYYY-MM-DD)
    const historyMap = new Set(history.map(h => h.activity_date));

    // GitHub aligns columns by week. Let's just generate `days` days.
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      // Get YYYY-MM-DD in local time
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const iso = `${year}-${month}-${day}`;
      
      data.push({
        date: iso,
        active: historyMap.has(iso)
      });
    }

    // To make it flow top-to-bottom, left-to-right (like GitHub), we need to ensure the grid starts on the correct day of the week.
    const firstDayOfWeek = new Date(data[0].date).getDay(); // 0 is Sunday
    const paddedData = Array(firstDayOfWeek).fill(null).concat(data);

    return paddedData;
  }, [history, days]);

  return (
    <div className="activity-calendar" style={{ width: '100%', overflowX: 'auto', paddingBottom: '0.5rem' }}>
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
            title={day ? `${day.date}${day.active ? ' (Active)' : ''}` : ''}
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '3px',
              backgroundColor: !day ? 'transparent' : day.active ? 'var(--color-primary)' : 'var(--color-text-muted)',
              opacity: !day ? 0 : day.active ? 1 : 0.2,
              transition: 'transform 0.1s ease',
              cursor: day ? 'pointer' : 'default'
            }}
            onMouseEnter={(e) => { if (day) e.target.style.transform = 'scale(1.2)' }}
            onMouseLeave={(e) => { if (day) e.target.style.transform = 'scale(1)' }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
        <span>Less</span>
        <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: 'var(--color-text-muted)', opacity: 0.2 }} />
        <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: 'var(--color-primary)', opacity: 0.5 }} />
        <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: 'var(--color-primary)', opacity: 1 }} />
        <span>More</span>
      </div>
    </div>
  );
};
