import React from 'react';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import { TimesheetEntry, roles } from './timesheetUtils';

interface TimesheetRowProps {
  index: number;
  entry: TimesheetEntry;
  handleInputChange: (index: number, field: keyof TimesheetEntry, value: string | number) => void;
  removeRow: (index: number) => void;
}

const TimesheetRow: React.FC<TimesheetRowProps> = ({ index, entry, handleInputChange, removeRow }) => {
  return (
    <tr>
      <td>
        <Button variant="danger" onClick={() => removeRow(index)}>Delete</Button>
      </td>
      <td>
        <FormControl
          type="date"
          value={entry.date}
          onChange={(e) => handleInputChange(index, 'date', e.target.value)}
        />
      </td>
      <td>
        <FormControl
          type="number"
          value={entry.hours}
          onChange={(e) => handleInputChange(index, 'hours', parseFloat(e.target.value))}
        />
      </td>
      <td>
        <FormControl
          type="text"
          value={entry.location}
          onChange={(e) => handleInputChange(index, 'location', e.target.value)}
        />
      </td>
      <td>
        <Form.Select
          value={entry.position}
          onChange={(e) => handleInputChange(index, 'position', e.target.value)}
        >
          <option value="" disabled>Select Role</option>
          {roles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </Form.Select>
      </td>
    </tr>
  );
};

export default TimesheetRow;
