import Airtable from 'airtable';
import { useState } from 'react';

const base = new Airtable({ apiKey:'keyZmq5LdISv8gDdB' }).base('app8ZbcPx7dkpOnP0');


export default function GetStudents() {
  const [studentName, setStudentName] = useState('')

  const searchStudent = () => {
    const studentRecord: Record<string, any> = {name: '', class : []};
    base("Students").select({ filterByFormula: `({Name} = '${studentName}')`, view: "Grid view" }).eachPage((records, fetchNextPage) => {
      records.forEach(function(record) {
      studentRecord.name = studentName
      const classes = (record.get("Classes") || []) as string[];
        
       classes?.forEach((classId) => {
             base("Classes").find(classId, function (err, record) {
        if (err) {
          console.error(err);
          return;
        }
        const className = record?.get('Name');
        const classDetails: Record<string, any> = {
          name: className,
          students: []
        } 
        const students = (record?.get("Students") || []) as string[];
        students?.forEach(studentId => {
            base("Students").find(studentId, function (err, record) {
              if (err) {
                console.error(err);
                return;
              }
              const studentName = record?.get("Name");
              classDetails.students.push(studentName);
            });
        })
        studentRecord.class.push(classDetails);
      });
       })
    });
      fetchNextPage();
    })
  }
 
  return (
    <div>
    <input onChange={(e) => setStudentName(e.target.value)} />
    <button onClick={searchStudent}>Login</button>
    </div> 
  );
} 


