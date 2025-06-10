import React from 'react';

interface TimeSlotSelectorProps {
  selectedTimeSlot: string;
  setSelectedTimeSlot: (slot: string) => void;
}

export const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  selectedTimeSlot,
  setSelectedTimeSlot
}) => {
  // Generate time slots for today and tomorrow
  const generateTimeSlots = () => {
    const slots: string[] = [];
    const now = new Date();
    const today = now.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    // Start from the current hour + 2 (minimum prep time)
    let startHour = now.getHours() + 2;

    // Today's slots
    for (let hour = startHour; hour <= 21; hour++) {
      slots.push(
        `Today, ${today} - ${hour % 12 || 12}:00 ${hour >= 12 ? 'PM' : 'AM'}`
      );
      slots.push(
        `Today, ${today} - ${hour % 12 || 12}:30 ${hour >= 12 ? 'PM' : 'AM'}`
      );
    }

    // Tomorrow's slots
    for (let hour = 10; hour <= 21; hour++) {
      slots.push(
        `Tomorrow, ${tomorrowStr} - ${hour % 12 || 12}:00 ${hour >= 12 ? 'PM' : 'AM'}`
      );
      slots.push(
        `Tomorrow, ${tomorrowStr} - ${hour % 12 || 12}:30 ${hour >= 12 ? 'PM' : 'AM'}`
      );
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div>
      <p className="text-gray-600 mb-4 text-lg">Select a delivery time slot:</p>
      <select
        value={selectedTimeSlot}
        onChange={(e) => setSelectedTimeSlot(e.target.value)}
        className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50C878] focus:border-transparent text-gray-700 bg-white shadow-sm"
      >
        <option value="">Select a time slot</option>
        {timeSlots.map((slot, index) => (
          <option key={index} value={slot} className="py-2">
            {slot}
          </option>
        ))}
      </select>
      <p className="text-sm text-gray-500 mt-3 flex items-center">
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Orders must be placed at least 2 hours before delivery time
      </p>
    </div>
  );
}; 