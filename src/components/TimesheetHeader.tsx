import React from 'react';

const TimesheetHeader: React.FC = () => {
  return (
    <thead>
      <tr>
        <th>Action</th>
        <th>Date</th>
        <th>Hours</th>
        <th>Location</th>
        <th>Position</th>
      </tr>
    </thead>
  );
};

export default TimesheetHeader;
