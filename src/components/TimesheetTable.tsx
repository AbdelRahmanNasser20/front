import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import * as XLSX from 'xlsx';
import TimesheetHeader from './TimesheetHeader';
import TimesheetBody from './TimesheetBody';
import { TimesheetEntry, roles, roleMapping, isValidDate, convertExcelDate } from './timesheetUtils';
import { VerificationResultsAccordion, ReportAccordion } from './AccordionComponent';

const TimesheetTable: React.FC = () => {
  const [timesheetEntries, setTimesheetEntries] = useState<TimesheetEntry[]>([]);
  const [verificationResults, setVerificationResults] = useState<any[]>([]);
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    const storedEntries = localStorage.getItem('timesheetEntries');
    if (storedEntries) {
      setTimesheetEntries(JSON.parse(storedEntries));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('timesheetEntries', JSON.stringify(timesheetEntries));
  }, [timesheetEntries]);

  const addRow = (date: string = '', hours: number = 0, location: string = '', position: string = '') => {
    setTimesheetEntries([...timesheetEntries, { date, hours, location, position }]);
  };

  const handleAddRowClick = () => {
    addRow();
  };

  const removeRow = (index: number) => {
    setTimesheetEntries(timesheetEntries.filter((_, i) => i !== index));
  };

  const handleInputChange = (index: number, field: keyof TimesheetEntry, value: string | number) => {
    const newEntries = [...timesheetEntries];
    if (field === 'hours') {
      newEntries[index][field] = parseFloat(value as string);
    } else {
      newEntries[index][field] = value as string;
    }
    setTimesheetEntries(newEntries);
  };

  const handleFiles = (files: FileList) => {
    if (files.length > 0) {
      const file = files[0];
      if (/\.(xls|xlsx)$/i.test(file.name)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target!.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array', cellDates: true });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const rawData = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });
          const filteredData = rawData.slice(3).filter(row => {
            const [date, hours, location, role] = row;
            return role && isValidDate(date) && location;
          }).map(row => {
            const [date, hours, location, role] = row;
            const formattedDate = typeof date === 'number' ? convertExcelDate(date) : new Date(date).toISOString().slice(0, 10);
            const transformedRole = roleMapping[role] || role;
            return { date: formattedDate, hours, location, position: transformedRole };
          });

          setTimesheetEntries(filteredData);
        };
        reader.readAsArrayBuffer(file);
      } else {
        alert("Please select a valid Excel file (.xls or .xlsx).");
      }
    }
  };

  const sendTableDataToBackend = async () => {
    const email = localStorage.getItem('email');
    const url = "http://127.0.0.1:5001/verify";
  
    if (!email) {
      alert('Email is required');
      return;
    }
  
    if (timesheetEntries.length === 0) {
      alert('Timesheet entries are required');
      return;
    }
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, tableData: timesheetEntries }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        if (response.status === 404) {          
          alert(result.message || "Resource not found");
        } else if (response.status === 400) {
          alert(result.message || "Bad Request");
        } else if (response.status === 422) {
          alert(result.message || "Unprocessable Entity");
        } else if (response.status === 500) {
          alert(result.message || "Internal Server Error");
        } else {
          alert(result.message || `Unexpected error: ${response.status}`);
        }
        return;
      }
  
      const { report, invalidEntries } = result;


      displayReport(report);
      console.log(report);
      displayVerificationResults(invalidEntries);
    } catch (error) {
      console.error('Error sending data to backend:', error);
      alert('An error occurred while sending data to the backend');
    }
  };  

  const displayReport = (report: any) => {
    setReport(report);
  };

  const displayVerificationResults = (results: any) => {
    setVerificationResults(results);
  };

  return (
    <div className="p-3 bg-dark text-white">
      <div className="d-flex mb-3">
        <input
          type="file"
          accept=".xls,.xlsx"
          onChange={(e) => handleFiles(e.target.files!)}
          className="form-control form-control-dark me-3"
          style={{ flex: 3 }}
        />
        <Button variant="primary" onClick={handleAddRowClick} style={{ flex: 1 }}>Add Row</Button>
      </div>
      <Table striped bordered hover variant="dark" className="mt-3">
        <TimesheetHeader />
        <TimesheetBody timesheetEntries={timesheetEntries} handleInputChange={handleInputChange} removeRow={removeRow} />
      </Table>
      {timesheetEntries.length > 0 && (
        <div className="d-flex justify-content-center mt-3">
          <Button variant="success" onClick={sendTableDataToBackend} style={{ width: '50%' }}>
            Verify Timesheet
          </Button>
        </div>
      )}
       {report && <div style={{ marginTop: '20px' }}><ReportAccordion report={report} /></div>}
      {verificationResults.length > 0 && <div style={{ marginTop: '20px' }}><VerificationResultsAccordion results={verificationResults} /></div>}
    </div>
  );
};

export default TimesheetTable;
