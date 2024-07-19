import React from 'react';
import TimesheetRow from './TimesheetRow';
import { TimesheetEntry } from './timesheetUtils';

interface TimesheetBodyProps {
  timesheetEntries: TimesheetEntry[];
  handleInputChange: (index: number, field: keyof TimesheetEntry, value: string | number) => void;
  removeRow: (index: number) => void;
}

const TimesheetBody: React.FC<TimesheetBodyProps> = ({ timesheetEntries, handleInputChange, removeRow }) => {
  return (
    <tbody>
      {timesheetEntries.map((entry, index) => (
        <TimesheetRow
          key={index}
          index={index}
          entry={entry}
          handleInputChange={handleInputChange}
          removeRow={removeRow}
        />
      ))}
    </tbody>
  );
};

export default TimesheetBody;
