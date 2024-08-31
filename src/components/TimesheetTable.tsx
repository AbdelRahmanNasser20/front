import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import * as XLSX from 'xlsx';
import TimesheetHeader from './TimesheetHeader';
import TimesheetBody from './TimesheetBody';
import { TimesheetEntry, roleMapping, isValidDate, convertExcelDate } from './timesheetUtils';
// import { ReportAccordion } from './AccordionComponent';
import { VerificationResultsAccordion, ReportAccordion } from './AccordionComponent';

const API_URL = process.env.REACT_APP_API_URL;

console.log("lodaded " , API_URL);

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


  const addRow = (date: string = '', hours: number = 0, location: string = '', position: string = '') => {
    const newEntries = [...timesheetEntries, { date, hours, location, position }];
    setTimesheetEntries(newEntries);
    saveEntriesToLocalStorage(newEntries);
  };

  const handleAddRowClick = () => {
    addRow();
  };

  const removeRow = (index: number) => {
    const newEntries = timesheetEntries.filter((_, i) => i !== index);
    setTimesheetEntries(newEntries);
    saveEntriesToLocalStorage(newEntries);
  };

  const handleInputChange = (index: number, field: keyof TimesheetEntry, value: string | number) => {
    const newEntries = [...timesheetEntries];
    if (field === 'hours') {
      newEntries[index][field] = parseFloat(value as string);
    } else {
      newEntries[index][field] = value as string;
    }
    setTimesheetEntries(newEntries);
    saveEntriesToLocalStorage(newEntries);
  };


  const handleFiles = (files: FileList) => {
    if (files.length > 0) {
      const file = files[0];
      if (/\.(xls|xlsx)$/i.test(file.name)) {
        const reader = new FileReader();
  
        reader.onload = (e: ProgressEvent<FileReader>) => {
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
  
          setTimesheetEntries([]);
          setTimesheetEntries(filteredData);
          saveEntriesToLocalStorage(filteredData);
        };
  
        reader.readAsArrayBuffer(file);
      } else {
        alert("Please select a valid Excel file (.xls or .xlsx).");
      }
    }
  };
  
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Temporarily reset the value to ensure the change event fires for the same file
      const input = e.target;
      handleFiles(e.target.files);
      input.value = ''; // Reset input value to ensure change event triggers again
    }
  };
  
  const saveEntriesToLocalStorage = (entries: TimesheetEntry[]) => {
    localStorage.setItem('timesheetEntries', JSON.stringify(entries));
  };

  const sendTableDataToBackend = async () => {
    const email = localStorage.getItem('email');
    // const url = API_URL;
    // const url = "http://127.0.0.1:5001/verify";
    const verifyEndpoint =  API_URL + "/verify";  
    alert(`sending to backend ${verifyEndpoint}`);
    // const deployed_url = "http://backend:5001/" + "verify"
    
    // console.log("API_URL " + API_URL + " and url that I created is " + url);    

    if (!email) {
      alert('Email is required');
      return;
    }
  
    if (timesheetEntries.length === 0) {
      alert('Timesheet entries are required');
      return;
    }
    console.log("sending timesheet entries to backend: " , timesheetEntries);
  
    try {
      const response = await fetch(verifyEndpoint, {
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
  
      const report = result.report;

      const invalidEntries = report["invalidEntries"];
      console.log("Setting REPORT:" , report)
      setReport(report);      
      console.log("Setting invalidEntries: ", invalidEntries);
      setVerificationResults(invalidEntries);
    } catch (error) {
      console.error('Error sending data to backend:', error);
      // alert('An error occurred while sending data to the backend at ,' + url + ' ' + "error" + ' ' + error);
    }
  };  

  return (
    <div className="p-3 bg-dark text-white">
      <div className="d-flex mb-3">
        <input
          type="file"
          accept=".xls,.xlsx"
          onChange={onFileChange}
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
      {verificationResults.length > 0 && <div style={{ marginTop: '20px' }}>
        <VerificationResultsAccordion invalidEntries={verificationResults} /></div>
      }
    </div>
  );
};

export default TimesheetTable;
