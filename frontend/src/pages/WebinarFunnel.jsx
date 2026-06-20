import React, { useState, useEffect } from 'react';

const TIME_SLOTS = [
  "10:00 AM – 10:30 AM",
  "10:30 AM – 11:00 AM",
  "11:00 AM – 11:30 AM",
  "11:30 AM – 12:00 PM",
  "12:00 PM – 12:30 PM",
  "12:30 PM – 1:00 PM",
  "1:00 PM – 1:30 PM",
  "1:30 PM – 2:00 PM",
  "2:00 PM – 2:30 PM",
  "2:30 PM – 3:00 PM",
  "3:00 PM – 3:30 PM",
  "3:30 PM – 4:00 PM",
  "4:00 PM – 4:30 PM",
  "4:30 PM – 5:00 PM",
  "5:00 PM – 5:30 PM",
  "5:30 PM – 6:00 PM",
  "6:00 PM – 6:30 PM",
  "6:30 PM – 7:00 PM",
  "7:00 PM – 7:30 PM",
  "7:30 PM – 8:00 PM",
  "8:00 PM – 8:30 PM",
  "8:30 PM – 9:00 PM",
  "9:00 PM – 9:30 PM",
  "9:30 PM – 10:00 PM"
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function WebinarFunnel() {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 3 }, (_, i) => currentYear + i);
  const months = MONTHS;

  const [funnelMode, setFunnelMode] = useState('book'); // 'book' or 'cancel'
  const [step, setStep] = useState(1); // 1 = Select Date/Time, 2 = Complete Form, 3 = Confirmation Ticket
  
  // Calendar States
  const [currentDate, setCurrentDate] = useState(new Date()); // Tracks current displayed month
  const [selectedDate, setSelectedDate] = useState(null); // Selected date object
  const [takenSlots, setTakenSlots] = useState([]); // List of booked slots for the selected date
  const [selectedTime, setSelectedTime] = useState(''); // Selected slot string
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Form Details
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    studentEmail: '',
    parentEmail: '',
    phone: '',
    grade: '',
    school: '',
    city: '',
    state: '',
    interests: '',
    goals: '',
    referral: '',
    gpa: '',
    extracurriculars: '',
    targetPrograms: ''
  });

  // Ticket Receipt
  const [ticketDetails, setTicketDetails] = useState(null);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Manage Bookings States
  const [cancelEmail, setCancelEmail] = useState('');
  const [userBookings, setUserBookings] = useState([]);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelStatus, setCancelStatus] = useState({ type: '', message: '' });

  // Fetch taken slots when a date is selected
  useEffect(() => {
    if (selectedDate) {
      fetchTakenSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchTakenSlots = async (dateObj) => {
    setLoadingSlots(true);
    const dateStr = formatDateKey(dateObj);
    try {
      const response = await fetch(`/api/bookings/taken?date=${dateStr}`);
      if (response.ok) {
        const result = await response.json();
        setTakenSlots(result.takenTimes || []);
      }
    } catch (err) {
      console.error('Error fetching taken slots:', err);
    } finally {
      setLoadingSlots(false);
    }
  };

  const formatDateKey = (dateObj) => {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Generate calendar days
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    
    // Previous month info
    const prevLastDate = new Date(year, month, 0).getDate();

    const days = [];

    // Fill preceding cells (previous month's ending dates)
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevLastDate - i),
        isCurrentMonth: false
      });
    }

    // Fill dates of current month
    for (let d = 1; d <= lastDate; d++) {
      days.push({
        date: new Date(year, month, d),
        isCurrentMonth: true
      });
    }

    // Fill trailing cells (next month's starting dates) to make exactly 42 cells (6 rows)
    const totalCells = 42;
    const remainingCells = totalCells - days.length;
    for (let d = 1; d <= remainingCells; d++) {
      days.push({
        date: new Date(year, month + 1, d),
        isCurrentMonth: false
      });
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value);
    setCurrentDate(new Date(currentDate.getFullYear(), newMonth, 1));
  };

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value);
    setCurrentDate(new Date(newYear, currentDate.getMonth(), 1));
  };

  const handleDateClick = (dateObj, isCurrentMonth) => {
    if (!isCurrentMonth || isDatePast(dateObj)) return; // Disable past dates & other month dates
    setSelectedDate(dateObj);
    setSelectedTime(''); // Reset time selection on date change
  };

  const isDatePast = (dateObj) => {
    if (!dateObj) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dateObj < today;
  };

  const handleTimeClick = (timeStr) => {
    setSelectedTime(timeStr);
  };

  const handleProceedToForm = () => {
    if (selectedDate && selectedTime) {
      setStep(2);
      setFormError('');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Core inputs verification
    if (
      !formData.studentName || !formData.parentName || !formData.studentEmail ||
      !formData.parentEmail || !formData.phone || !formData.grade ||
      !formData.school || !formData.city || !formData.state ||
      !formData.interests || !formData.goals || !formData.referral
    ) {
      setFormError('Please fill out all required fields.');
      return;
    }

    setFormLoading(true);
    setFormError('');

    const bookingDateStr = formatDateKey(selectedDate);

    try {
      const response = await fetch('/api/bookings/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingDate: bookingDateStr,
          bookingTime: selectedTime,
          ...formData
        })
      });

      const data = await response.json();

      if (response.ok) {
        setTicketDetails({
          studentName: formData.studentName,
          bookingDate: selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
          bookingTime: selectedTime,
          ticketId: `NGS-${data.registrationId}-${bookingDateStr.replace(/-/g, '')}`
        });
        setStep(3);
        trackRegistrationEvent();
      } else {
        setFormError(data.message || 'Booking failed. This slot may have just been taken.');
      }
    } catch (err) {
      console.error(err);
      setFormError('A network error occurred. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const trackRegistrationEvent = async () => {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType: 'registration', url: '/register' })
      });
    } catch (err) {
      console.debug(err);
    }
  };

  // self-service query bookings
  const handleQueryBookings = async (e) => {
    e.preventDefault();
    if (!cancelEmail) return;

    setCancelLoading(true);
    setCancelStatus({ type: '', message: '' });
    setUserBookings([]);

    try {
      const response = await fetch('/api/bookings/my-registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cancelEmail })
      });

      if (response.ok) {
        const list = await response.json();
        setUserBookings(list);
        if (list.length === 0) {
          setCancelStatus({ type: 'error', message: 'No active bookings found for this email address.' });
        }
      } else {
        setCancelStatus({ type: 'error', message: 'Failed to retrieve active bookings.' });
      }
    } catch (err) {
      console.error(err);
      setCancelStatus({ type: 'error', message: 'Server connection failed.' });
    } finally {
      setCancelLoading(false);
    }
  };

  // self-service cancel booking
  const handleCancelBooking = async (regId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? This will immediately free up the slot for other students.')) return;

    setCancelLoading(true);
    setCancelStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/bookings/unregister', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId: regId })
      });

      if (response.ok) {
        setCancelStatus({ type: 'success', message: 'Your booking has been successfully cancelled. A confirmation email has been dispatched.' });
        setUserBookings(userBookings.filter(b => b.id !== regId));
      } else {
        const result = await response.json();
        setCancelStatus({ type: 'error', message: result.message || 'Failed to cancel the booking.' });
      }
    } catch (err) {
      console.error(err);
      setCancelStatus({ type: 'error', message: 'Server connection failed.' });
    } finally {
      setCancelLoading(false);
    }
  };

  const resetFunnel = () => {
    setSelectedDate(null);
    setSelectedTime('');
    setFormData({
      studentName: '',
      parentName: '',
      studentEmail: '',
      parentEmail: '',
      phone: '',
      grade: '',
      school: '',
      city: '',
      state: '',
      interests: '',
      goals: '',
      referral: '',
      gpa: '',
      extracurriculars: '',
      targetPrograms: ''
    });
    setStep(1);
    setFunnelMode('book');
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="funnel-page">
      <section className="funnel-header text-center">
        <div className="container">
          <h1 className="white-text mb-2">Webinar Registration Funnel</h1>
          <p className="subtitle-text">Select an assessment slot on our interactive calendar to lock in your admissions mentoring review.</p>
          
          <div className="funnel-toggle-group mt-4">
            <button 
              className={`funnel-mode-btn ${funnelMode === 'book' ? 'active' : ''}`}
              onClick={() => { setFunnelMode('book'); setStep(1); }}
            >
              🗓️ Book Assessment
            </button>
            <button 
              className={`funnel-mode-btn ${funnelMode === 'cancel' ? 'active' : ''}`}
              onClick={() => setFunnelMode('cancel')}
            >
              ❌ Manage My Bookings
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: step === 1 && funnelMode === 'book' ? '1100px' : '800px' }}>
          
          {/* 1. BOOKING MODE */}
          {funnelMode === 'book' && (
            <div>
              {/* STEP PROGRESS INDICATOR */}
              <div className="step-indicator mb-5" style={{ maxWidth: '600px', margin: '0 auto 3rem auto' }}>
                <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1. Select Date &amp; Time</div>
                <div className="step-line"></div>
                <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2. Complete Profile</div>
                <div className="step-line"></div>
                <div className={`step-dot ${step >= 3 ? 'active' : ''}`}>3. Access Ticket</div>
              </div>

              {/* STEP 1: CALENDAR & TIME SLOTS SELECTOR */}
              {step === 1 && (
                <div className="calendar-scheduler-grid animate-fade-in">
                  
                  {/* CALENDAR COLUMN */}
                  <div className="card text-center">
                    <div className="calendar-month-header">
                      <button className="month-nav-btn" onClick={handlePrevMonth} title="Previous Month">&larr;</button>
                      <div className="calendar-selectors">
                        <select 
                          className="calendar-select"
                          value={currentDate.getMonth()} 
                          onChange={handleMonthChange}
                        >
                          {months.map((m, index) => (
                            <option key={m} value={index}>{m}</option>
                          ))}
                        </select>
                        <select 
                          className="calendar-select"
                          value={currentDate.getFullYear()} 
                          onChange={handleYearChange}
                        >
                          {years.map(y => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>
                      <button className="month-nav-btn" onClick={handleNextMonth} title="Next Month">&rarr;</button>
                    </div>

                    <div className="calendar-grid-header">
                      {WEEKDAYS.map(w => <div key={w} className="weekday-label">{w}</div>)}
                    </div>

                    <div className="calendar-grid-body">
                      {getCalendarDays().map(({ date, isCurrentMonth }, idx) => {
                        const isPast = !isCurrentMonth || isDatePast(date);
                        const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
                        const isToday = new Date().toDateString() === date.toDateString();
                        
                        return (
                          <button
                            key={date.toISOString()}
                            className={`calendar-cell day ${!isCurrentMonth ? 'other-month' : ''} ${isPast ? 'past' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                            disabled={isPast}
                            onClick={() => handleDateClick(date, isCurrentMonth)}
                          >
                            <span className="day-num">{date.getDate()}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="calendar-legend mt-3">
                      <div><span className="legend-dot today-dot"></span> Today</div>
                      <div><span className="legend-dot selected-dot"></span> Selected</div>
                      <div><span className="legend-dot disabled-dot"></span> Unavailable</div>
                    </div>
                  </div>

                  {/* TIME SLOTS COLUMN */}
                  <div className="card text-center flex-column justify-between">
                    <div>
                      <h3 className="mb-2">Available Time Slots</h3>
                      {selectedDate ? (
                        <p className="mb-4 text-muted">
                          Select a slot for <strong>{selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>
                        </p>
                      ) : (
                        <p className="mb-4 text-muted">Please select a date on the calendar first.</p>
                      )}

                      {selectedDate && (
                        <div>
                          {loadingSlots ? (
                            <div className="py-5">Loading available times...</div>
                          ) : (
                            <div className="time-slots-grid">
                              {TIME_SLOTS.map((time) => {
                                const isBooked = takenSlots.includes(time);
                                const isSlotSelected = selectedTime === time;
                                
                                if (isBooked) return null; // Remove slot altogether if filled
                                
                                return (
                                  <button
                                    key={time}
                                    className={`time-slot-btn ${isSlotSelected ? 'selected' : ''}`}
                                    onClick={() => handleTimeClick(time)}
                                  >
                                    {time.replace(' – ', ' - ')}
                                  </button>
                                );
                              })}
                              
                              {/* If all 24 slots are booked */}
                              {TIME_SLOTS.filter(t => !takenSlots.includes(t)).length === 0 && (
                                <div className="no-slots-toast py-4">All slots are booked for this date. Please choose another date.</div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {selectedDate && selectedTime && (
                      <div className="slots-action-box mt-4">
                        <div className="selected-confirmation-summary mb-3">
                          Assessment: <strong>{selectedDate.toLocaleDateString()} @ {selectedTime}</strong>
                        </div>
                        <button 
                          className="btn btn-secondary btn-block"
                          onClick={handleProceedToForm}
                        >
                          Proceed to Registration Profile &rarr;
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* STEP 2: REGISTRATION DETAILS FORM */}
              {step === 2 && (
                <div className="card">
                  <div className="form-back-header mb-4">
                    <button className="back-link-btn" onClick={() => setStep(1)}>&larr; Back to Calendar selection</button>
                    <div className="selected-slot-banner">
                      Selected Slot: <strong>{selectedDate?.toLocaleDateString()} @ {selectedTime}</strong>
                    </div>
                  </div>

                  <h2 className="mb-4 text-center">Student &amp; Parent Profile Setup</h2>
                  
                  {formError && <div className="form-error-toast mb-4">{formError}</div>}

                  <form onSubmit={handleFormSubmit}>
                    
                    <h3 className="form-section-title mb-3">1. Student Details</h3>
                    <div className="form-grid mb-4">
                      <div className="form-group">
                        <label htmlFor="studentName">Student Name *</label>
                        <input
                          type="text"
                          name="studentName"
                          id="studentName"
                          className="form-control"
                          placeholder="Jane Doe"
                          value={formData.studentName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="studentEmail">Student Email Address *</label>
                        <input
                          type="email"
                          name="studentEmail"
                          id="studentEmail"
                          className="form-control"
                          placeholder="jane.doe@example.com"
                          value={formData.studentEmail}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-grid mb-4">
                      <div className="form-group">
                        <label htmlFor="phone">Phone Number (SMS Alert Ready) *</label>
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          className="form-control"
                          placeholder="555-0199"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="grade">Current High School Grade *</label>
                        <select
                          name="grade"
                          id="grade"
                          className="form-control"
                          value={formData.grade}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select Grade</option>
                          <option value="9th Grade">9th Grade</option>
                          <option value="10th Grade">10th Grade</option>
                          <option value="11th Grade">11th Grade</option>
                          <option value="12th Grade">12th Grade</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group mb-4">
                      <label htmlFor="school">School Name *</label>
                      <input
                        type="text"
                        name="school"
                        id="school"
                        className="form-control"
                        placeholder="Oakridge High School"
                        value={formData.school}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-grid mb-4">
                      <div className="form-group">
                        <label htmlFor="city">City *</label>
                        <input
                          type="text"
                          name="city"
                          id="city"
                          className="form-control"
                          placeholder="Charlotte"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="state">State *</label>
                        <select
                          name="state"
                          id="state"
                          className="form-control"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select State</option>
                          <option value="NC">North Carolina</option>
                          <option value="SC">South Carolina</option>
                          <option value="VA">Virginia</option>
                          <option value="GA">Georgia</option>
                          <option value="OTHER">Other State</option>
                        </select>
                      </div>
                    </div>

                    <h3 className="form-section-title mb-3">2. Parent / Guardian Details</h3>
                    <div className="form-grid mb-4">
                      <div className="form-group">
                        <label htmlFor="parentName">Parent Name *</label>
                        <input
                          type="text"
                          name="parentName"
                          id="parentName"
                          className="form-control"
                          placeholder="John Doe"
                          value={formData.parentName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="parentEmail">Parent Email Address *</label>
                        <input
                          type="email"
                          name="parentEmail"
                          id="parentEmail"
                          className="form-control"
                          placeholder="john.doe@example.com"
                          value={formData.parentEmail}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <h3 className="form-section-title mb-3">3. Academic &amp; Portfolio Profile</h3>
                    <div className="form-group mb-4">
                      <label htmlFor="interests">Primary Academic Interests *</label>
                      <input
                        type="text"
                        name="interests"
                        id="interests"
                        className="form-control"
                        placeholder="e.g. STEM, computer science, biological research, math contests"
                        value={formData.interests}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group mb-4">
                      <label htmlFor="goals">What are your academic &amp; career goals? *</label>
                      <textarea
                        name="goals"
                        id="goals"
                        rows="3"
                        className="form-control"
                        placeholder="Describe what boarding programs, universities, or careers you aspire to reach..."
                        value={formData.goals}
                        onChange={handleInputChange}
                        required
                        style={{ resize: 'none' }}
                      ></textarea>
                    </div>

                    <div className="form-group mb-4">
                      <label htmlFor="referral">How did you hear about NextGen Scholars? *</label>
                      <select
                        name="referral"
                        id="referral"
                        className="form-control"
                        value={formData.referral}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Option</option>
                        <option value="Search Engine">Search Engine (Google, Bing)</option>
                        <option value="School Counselor">School Counselor</option>
                        <option value="Friend/Family Member">Friend or Family</option>
                        <option value="Social Media">Social Media (Instagram, TikTok)</option>
                        <option value="Other">Other Referral</option>
                      </select>
                    </div>

                    <h3 className="form-section-title mb-3" style={{ color: 'var(--text-muted)' }}>4. Optional Competitiveness Audit Data (Recommended)</h3>
                    
                    <div className="form-grid mb-4">
                      <div className="form-group">
                        <label htmlFor="gpa">Current GPA (Weighted or Unweighted)</label>
                        <input
                          type="text"
                          name="gpa"
                          id="gpa"
                          className="form-control"
                          placeholder="e.g. 3.98 UW"
                          value={formData.gpa}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="targetPrograms">Target High Schools / Colleges</label>
                        <input
                          type="text"
                          name="targetPrograms"
                          id="targetPrograms"
                          className="form-control"
                          placeholder="e.g. NCSSM, Duke, UNC"
                          value={formData.targetPrograms}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group mb-4">
                      <label htmlFor="extracurriculars">Extracurricular Activities &amp; Clubs</label>
                      <textarea
                        name="extracurriculars"
                        id="extracurriculars"
                        rows="3"
                        className="form-control"
                        placeholder="List Science Olympiad, robotics, varsity sports, or volunteer leadership positions..."
                        value={formData.extracurriculars}
                        onChange={handleInputChange}
                        style={{ resize: 'none' }}
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={formLoading}
                      className="btn btn-secondary btn-lg"
                      style={{ width: '100%', marginTop: '1rem' }}
                    >
                      {formLoading ? 'Reserving Slot...' : 'Reserve Calendar Seat & Send Confirmation Email'}
                    </button>
                  </form>
                </div>
              )}

              {/* STEP 3: CONFIRMATION TICKET */}
              {step === 3 && (
                <div className="card text-center animate-fade-in">
                  <div className="success-icon-badge">🎉</div>
                  <h2 className="mb-2">Registration Confirmed!</h2>
                  <p className="mb-4 text-muted">Confirmation emails have been dispatched to the student and parent inbox.</p>
                  
                  {/* PRINTABLE TICKET */}
                  <div className="ticket-container">
                    <div className="ticket-side left">
                      <div className="ticket-logo">NextGen Scholars</div>
                      <div className="ticket-title">Admissions Assessment Ticket</div>
                      
                      <div className="ticket-row">
                        <div>
                          <span className="ticket-label">ATTENDEE</span>
                          <span className="ticket-val">{ticketDetails?.studentName}</span>
                        </div>
                        <div>
                          <span className="ticket-label">DATE</span>
                          <span className="ticket-val">{ticketDetails?.bookingDate}</span>
                        </div>
                      </div>

                      <div className="ticket-row">
                        <div>
                          <span className="ticket-label">TICKET ID</span>
                          <span className="ticket-val">{ticketDetails?.ticketId}</span>
                        </div>
                        <div>
                          <span className="ticket-label">TIME SLOT</span>
                          <span className="ticket-val">{ticketDetails?.bookingTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="ticket-side right">
                      <div className="ticket-qr-box">
                        <span className="qr-emoji">🔳</span>
                        <span className="qr-desc">ADMISSION CODE</span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 mb-3" style={{ fontSize: '0.95rem' }}>
                    A confirmation email has been sent to your inbox with your session details and Zoom link. For support, contact <a href="mailto:scholar.nextgens@gmail.com">scholar.nextgens@gmail.com</a>.
                  </p>

                  <div className="spam-notice">
                    <span className="spam-notice-icon">📬</span>
                    <div>
                      <strong>Don't see the email?</strong> Please check your <strong>Spam</strong> or <strong>Junk</strong> folder — our emails occasionally get filtered. Mark it as "Not Spam" so you don't miss your Zoom link!
                    </div>
                  </div>

                  <button className="btn btn-primary" onClick={resetFunnel}>
                    Book Another Session
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 2. CANCELLATION / MANAGE MODE */}
          {funnelMode === 'cancel' && (
            <div className="card animate-fade-in" style={{ maxWidth: '650px', margin: '0 auto' }}>
              <h2 className="mb-3 text-center">Manage Your Bookings</h2>
              <p className="mb-4 text-center text-muted">Enter the student or parent email used during booking to retrieve and cancel active assessment registrations.</p>

              {cancelStatus.message && (
                <div className={`form-error-toast mb-4 text-center ${cancelStatus.type === 'success' ? 'success-alert' : ''}`}>
                  {cancelStatus.message}
                </div>
              )}

              <form onSubmit={handleQueryBookings} className="query-bookings-form mb-4">
                <div className="form-group" style={{ flexGrow: 1, marginBottom: 0 }}>
                  <label htmlFor="cancelEmail" className="sr-only">Email Address</label>
                  <input
                    type="email"
                    id="cancelEmail"
                    className="form-control"
                    placeholder="Enter email address"
                    value={cancelEmail}
                    onChange={(e) => setCancelEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" disabled={cancelLoading} className="btn btn-secondary">
                  {cancelLoading ? 'Searching...' : 'Search Bookings'}
                </button>
              </form>

              {userBookings.length > 0 && (
                <div className="user-bookings-list mt-4">
                  <h3 className="mb-3" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Active Registrations</h3>
                  <div className="bookings-grid">
                    {userBookings.map((b) => (
                      <div key={b.id} className="booking-item-card glass-card">
                        <div>
                          <div className="booking-student">Student: <strong>{b.student_name}</strong></div>
                          <div className="booking-time-details mt-1">
                            📅 {b.booking_date} &bull; ⏰ {b.booking_time}
                          </div>
                          <div className="booking-interests mt-1" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Interests: {b.interests}
                          </div>
                        </div>
                        <button
                          className="btn btn-outline btn-sm cancel-booking-btn"
                          disabled={cancelLoading}
                          onClick={() => handleCancelBooking(b.id)}
                          style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}
                        >
                          Cancel Booking
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      <style>{`
        .funnel-header {
          padding: 8rem 0 4rem 0;
          background-color: rgba(12, 35, 64, 0.15);
          border-bottom: 1px solid var(--border-color);
          color: #ffffff;
        }
        
        .subtitle-text {
          color: var(--text-secondary);
          font-size: 1.25rem;
          max-width: 650px;
          margin: 0 auto;
        }
        
        .funnel-toggle-group {
          display: inline-flex;
          gap: 0.5rem;
          background-color: rgba(3, 8, 14, 0.6);
          border: 1px solid var(--border-color);
          padding: 0.35rem;
          border-radius: var(--radius-md);
        }
        
        .funnel-mode-btn {
          background: none;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        
        .funnel-mode-btn:hover {
          color: #ffffff;
        }
        
        .funnel-mode-btn.active {
          background-color: var(--color-primary);
          color: #ffffff;
          border: 1px solid var(--color-secondary);
        }
        
        .step-indicator {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .step-dot {
          font-family: var(--font-sans);
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--text-muted);
          padding: 0.5rem 1rem;
          background-color: var(--bg-secondary);
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
        }
        
        .step-dot.active {
          background-color: var(--color-secondary);
          color: #03080e;
          border-color: var(--color-secondary);
        }
        
        .step-line {
          flex-grow: 1;
          height: 2px;
          background-color: var(--border-color);
          margin: 0 0.5rem;
        }
        
        /* CALENDAR SCHEDULER GRID */
        .calendar-scheduler-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 2rem;
        }
        
        /* CALENDAR MONTH STYLING */
        .calendar-month-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          gap: 0.5rem;
        }
        
        .month-nav-btn {
          background: rgba(12, 35, 64, 0.4);
          border: 1px solid var(--border-color);
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-sm);
          color: #ffffff;
          font-weight: bold;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        
        .month-nav-btn:hover {
          border-color: var(--color-secondary);
          background-color: rgba(12, 35, 64, 0.7);
        }
        
        .month-title {
          font-size: 1.35rem;
          font-family: var(--font-serif);
          color: #ffffff;
        }

        .calendar-selectors {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .calendar-select {
          background-color: rgba(12, 35, 64, 0.4);
          border: 1px solid var(--border-color);
          color: #ffffff;
          padding: 0.4rem 0.8rem;
          border-radius: var(--radius-sm);
          font-weight: 600;
          font-size: 0.95rem;
          outline: none;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .calendar-select:focus {
          border-color: var(--color-secondary);
        }

        .calendar-select option {
          background-color: #03080e;
          color: #ffffff;
        }
        
        .calendar-grid-header {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          margin-bottom: 0.75rem;
        }
        
        .weekday-label {
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--color-secondary);
          text-align: center;
          padding: 0.5rem 0;
        }
        
        .calendar-grid-body {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.5rem;
        }
        
        .calendar-cell {
          aspect-ratio: 1.1;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-sm);
          font-size: 0.95rem;
          background: none;
          border: 1px solid transparent;
        }
        
        .calendar-cell.empty {
          cursor: default;
        }
        
        .calendar-cell.day {
          background-color: rgba(12, 35, 64, 0.15);
          border: 1px solid var(--border-color);
          color: #ffffff;
          cursor: pointer;
          font-weight: 600;
          transition: all var(--transition-fast);
        }
        
        .calendar-cell.day:hover:not(.past) {
          border-color: var(--color-secondary);
          background-color: rgba(12, 35, 64, 0.4);
        }
        
        .calendar-cell.day.past {
          opacity: 0.25;
          cursor: not-allowed;
        }
        
        .calendar-cell.day.other-month {
          opacity: 0.25;
          cursor: not-allowed;
          background-color: rgba(12, 35, 64, 0.05);
        }
        
        .calendar-cell.day.selected {
          background-color: var(--color-secondary) !important;
          color: #03080e !important;
          border-color: var(--color-secondary) !important;
          font-weight: 800;
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.4);
        }
        
        .calendar-cell.day.today {
          border: 1px solid var(--color-accent);
          color: var(--color-accent);
        }
        
        .calendar-cell.day.today.selected {
          color: #03080e;
        }
        
        .calendar-legend {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        
        .legend-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 0.35rem;
        }
        
        .today-dot { background-color: var(--color-accent); }
        .selected-dot { background-color: var(--color-secondary); }
        .disabled-dot { background-color: rgba(12, 35, 64, 0.15); opacity: 0.25; }
        
        /* TIME SLOTS GRID */
        .time-slots-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.6rem;
          max-height: 250px;
          overflow-y: auto;
          padding-right: 0.35rem;
        }
        
        .time-slot-btn {
          width: 100%;
          padding: 0.75rem 1rem;
          background-color: rgba(12, 35, 64, 0.15);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          color: #ffffff;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        
        .time-slot-btn:hover {
          border-color: var(--color-secondary);
          background-color: rgba(12, 35, 64, 0.4);
        }
        
        .time-slot-btn.selected {
          background-color: rgba(212, 175, 55, 0.1) !important;
          border-color: var(--color-secondary) !important;
          color: var(--color-secondary) !important;
          box-shadow: 0 0 8px rgba(212, 175, 55, 0.15);
        }
        
        .no-slots-toast {
          color: var(--color-danger);
          font-size: 0.9rem;
          font-weight: 600;
        }
        
        .selected-confirmation-summary {
          font-size: 0.9rem;
          background-color: var(--bg-secondary);
          padding: 0.5rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
        }
        
        .form-back-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 1rem;
        }
        
        .back-link-btn {
          background: none;
          border: none;
          color: var(--color-secondary);
          font-weight: 600;
          cursor: pointer;
          font-size: 0.9rem;
        }
        
        .back-link-btn:hover {
          color: #ffffff;
        }
        
        .selected-slot-banner {
          font-size: 0.85rem;
          background-color: rgba(12, 35, 64, 0.2);
          padding: 0.4rem 0.8rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
        }
        
        .form-section-title {
          font-size: 1.15rem;
          border-bottom: 2px solid var(--border-color);
          padding-bottom: 0.35rem;
          margin-top: 2rem;
          color: #ffffff;
        }
        
        .form-error-toast {
          padding: 0.75rem 1rem;
          background-color: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: var(--color-danger);
          font-size: 0.9rem;
          font-weight: 600;
          border-radius: var(--radius-md);
        }
        
        .form-error-toast.success-alert {
          background-color: rgba(34, 197, 94, 0.1);
          border: 1px solid var(--color-success);
          color: var(--color-success);
        }

        .spam-notice {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.4);
          border-left: 4px solid var(--color-secondary);
          border-radius: var(--radius-md);
          padding: 0.9rem 1.1rem;
          margin-bottom: 1.5rem;
          font-size: 0.88rem;
          color: #e2c97e;
          line-height: 1.55;
          text-align: left;
        }

        .spam-notice strong {
          color: var(--color-secondary);
        }

        .spam-notice-icon {
          font-size: 1.4rem;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .success-icon-badge {
          font-size: 3.5rem;
          margin-bottom: 1rem;
          line-height: 1;
        }
        
        /* TICKET STYLING */
        .ticket-container {
          display: flex;
          background-color: var(--color-primary);
          border-radius: var(--radius-lg);
          color: #ffffff;
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          border: 2px solid var(--color-secondary);
          text-align: left;
          margin: 2rem auto;
          max-width: 600px;
        }
        
        .ticket-side {
          padding: 1.75rem;
        }
        
        .ticket-side.left {
          flex-grow: 1;
          border-right: 2px dashed rgba(255, 255, 255, 0.2);
          position: relative;
        }
        
        .ticket-side.left::before, .ticket-side.left::after {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          background-color: #03080e;
          border-radius: 50%;
          right: -10px;
        }
        
        .ticket-side.left::before { top: -10px; }
        .ticket-side.left::after { bottom: -10px; }
        
        .ticket-logo {
          font-family: var(--font-serif);
          font-weight: 800;
          color: var(--color-secondary);
          font-size: 0.85rem;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }
        
        .ticket-title {
          font-family: var(--font-serif);
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }
        
        .ticket-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
          margin-bottom: 1rem;
        }
        
        .ticket-row:last-child {
          margin-bottom: 0;
        }
        
        .ticket-label {
          display: block;
          font-size: 0.7rem;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.15rem;
        }
        
        .ticket-val {
          font-size: 0.95rem;
          font-weight: 600;
          color: #ffffff;
        }
        
        .ticket-side.right {
          width: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(3, 8, 14, 0.3);
        }
        
        .ticket-qr-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        
        .qr-emoji {
          font-size: 4rem;
          line-height: 1;
        }
        
        .qr-desc {
          font-size: 0.65rem;
          color: var(--color-secondary);
          font-weight: 700;
          letter-spacing: 1px;
        }
        
        /* CANCELLATION / MANAGE STYLES */
        .query-bookings-form {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }
        
        .booking-item-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem;
          margin-top: 1rem;
          flex-wrap: wrap;
          gap: 1rem;
          text-align: left;
        }
        
        .booking-student {
          font-size: 1rem;
          color: #ffffff;
        }
        
        .booking-time-details {
          font-size: 0.9rem;
          color: var(--color-secondary);
          font-weight: 600;
        }
        
        @media (max-width: 900px) {
          .calendar-scheduler-grid {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 600px) {
          .ticket-container {
            flex-direction: column;
          }
          .ticket-side.right {
            width: 100%;
            border-top: 2px dashed rgba(255, 255, 255, 0.2);
            padding: 1.5rem;
          }
          .ticket-side.left::before, .ticket-side.left::after {
            display: none;
          }
          .query-bookings-form {
            flex-direction: column;
            align-items: stretch;
          }
          .booking-item-card {
            flex-direction: column;
            align-items: stretch;
          }
          .cancel-booking-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
