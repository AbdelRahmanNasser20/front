export interface TimesheetEntry {
  date: string;
  hours: number;
  location: string;
  position: string;
}

export const roles = [
  "Back Office",
  "ISFT Assistant",
  "ISFT Lead",
  "PSS",
  "Special Event",
  "Summer Manager",
  "Summer Teacher",
  "Teacher - Assistant",
  "Teacher - Lead",
  "Teacher - Online Class"
];

export const roleMapping: { [key: string]: string } = {
  "Back Office": "Back Office",
  "ISFT Assistant": "ISFT Assistant",
  "ISFT Lead": "ISFT Lead",
  "PSS": "PSS",
  "Special Event": "Special Event",
  "Summer Manager": "Summer Manager",
  "Summer Teacher": "Summer Teacher",
  "Teacher - Assistant": "Teacher - Assistant",
  "Teacher - Lead": "Teacher - Lead",
  "Teacher - Online Class": "Teacher - Online Class"
};

export const isValidDate = (d: any) => !isNaN(d) && d !== null && d !== undefined;

export const convertExcelDate = (excelDateValue: number) => {
  const dateOrigin = new Date(Date.UTC(1899, 11, 31));
  try {
    const dateOut = new Date(dateOrigin.getTime() + excelDateValue * 86400000);
    return dateOut.toISOString().slice(0, 10);
  } catch (error) {
    console.error('Date conversion error:', error);
    return 'Invalid date';
  }
};
