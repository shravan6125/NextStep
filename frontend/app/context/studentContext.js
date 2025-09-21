import React, { createContext, useState, useContext } from 'react';

const StudentContext = createContext();

export const useStudent = () => useContext(StudentContext);

export const StudentProvider = ({ children }) => {
  const [student, setStudent] = useState(null); // Student data is stored here

  const login = (studentData) => {
    setStudent(studentData); // Set student data when they log in
  };

  return (
    <StudentContext.Provider value={{ student, login }}>
      {children}
    </StudentContext.Provider>
  );
};