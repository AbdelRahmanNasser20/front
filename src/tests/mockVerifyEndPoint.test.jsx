import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TimesheetTable from './TimesheetTable';
import '@testing-library/jest-dom/extend-expect';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ report: { invalidEntries: [] } }),
    ok: true,
  })
) as jest.Mock;

test('sends data to the backend on Verify Timesheet click', async () => {
  render(<TimesheetTable />);

  // Add a new row
  const addButton = screen.getByText(/Add Row/i);
  fireEvent.click(addButton);

  // Add some data to the row
  const dateInput = screen.getByLabelText(/date/i);
  fireEvent.change(dateInput, { target: { value: '2023-12-03' } });

  const hoursInput = screen.getByLabelText(/hours/i);
  fireEvent.change(hoursInput, { target: { value: '2.25' } });

  const locationInput = screen.getByLabelText(/location/i);
  fireEvent.change(locationInput, { target: { value: 'Good Shepherd' } });

  const positionInput = screen.getByLabelText(/position/i);
  fireEvent.change(positionInput, { target: { value: 'Teacher - Lead' } });

  // Click Verify Timesheet
  const verifyButton = screen.getByText(/Verify Timesheet/i);
  fireEvent.click(verifyButton);

  // Ensure fetch was called with correct URL and payload
  expect(global.fetch).toHaveBeenCalledWith(
    expect.stringContaining('/verify'),
    expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
  );

  // Ensure report is rendered
  const reportElement = await screen.findByText(/Reported Hours/i);
  expect(reportElement).toBeInTheDocument();
});
