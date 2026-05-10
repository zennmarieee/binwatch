// export interface PublicStudentReport {
//   id: string;
//   title: string;
//   points: number;
// }

// export interface PublicStudentRecord {
//   studentId: string;
//   name: string;
//   course: string;
//   yearLevel: string;
//   campus: string;
//   points: number;
//   reports: number;
//   rank: string;
//   status: "active" | "paused";
//   lastSeen: string;
//   recentReports: PublicStudentReport[];
// }

// export const publicStudentLookupData: PublicStudentRecord[] = [
//   {
//     studentId: "STU-2024-0142",
//     name: "Alyssa D. Santos",
//     course: "BS Information Technology",
//     yearLevel: "3rd Year",
//     campus: "Main Campus",
//     points: 2480,
//     reports: 31,
//     rank: "#142",
//     status: "active",
//     lastSeen: "Today, 10:24 AM",
//     recentReports: [
//       {
//         id: "RPT-1092",
//         title: "North Library Bin Report",
//         points: 50,
//       },
//       {
//         id: "RPT-1084",
//         title: "Science Annex Overflow",
//         points: 25,
//       },
//       {
//         id: "BONUS-2026",
//         title: "Weekly Participation Bonus",
//         points: 200,
//       },
//     ],
//   },
//   {
//     studentId: "STU-2024-0208",
//     name: "Mark J. Velasco",
//     course: "BS Civil Engineering",
//     yearLevel: "2nd Year",
//     campus: "Main Campus",
//     points: 1715,
//     reports: 18,
//     rank: "#238",
//     status: "active",
//     lastSeen: "Yesterday, 4:12 PM",
//     recentReports: [
//       {
//         id: "RPT-1140",
//         title: "Engineering Building Bin",
//         points: 40,
//       },
//       {
//         id: "RPT-1131",
//         title: "Canteen Area Cleanup",
//         points: 30,
//       },
//       {
//         id: "RPT-1119",
//         title: "Walkway Bin Check",
//         points: 25,
//       },
//     ],
//   },
//   {
//     studentId: "STU-2023-0087",
//     name: "Trisha M. Cruz",
//     course: "BS Computer Science",
//     yearLevel: "4th Year",
//     campus: "Main Campus",
//     points: 3120,
//     reports: 39,
//     rank: "#87",
//     status: "paused",
//     lastSeen: "3 days ago",
//     recentReports: [
//       {
//         id: "RPT-1201",
//         title: "Senior High Bin Report",
//         points: 50,
//       },
//       {
//         id: "RPT-1194",
//         title: "Library Overflow Flag",
//         points: 50,
//       },
//       {
//         id: "RPT-1188",
//         title: "Dormitory Bin Check",
//         points: 30,
//       },
//     ],
//   },
// ];

// Mock data removed — student lookup now powered by Supabase
// Interfaces kept for reference only

export interface PublicStudentReport {
  id: string;
  title: string;
  points: number;
}

export interface PublicStudentRecord {
  studentId: string;
  points: number;
  reports: number;
  lastActivity: string;
}