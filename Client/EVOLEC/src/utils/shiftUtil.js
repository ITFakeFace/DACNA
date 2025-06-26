// shiftUtil.js

const shifts = [
  { id: 1, days: ["Mon", "Wed", "Fri"], start: "08:00", end: "09:30" },
  { id: 2, days: ["Mon", "Wed", "Fri"], start: "09:30", end: "11:00" },
  { id: 3, days: ["Mon", "Wed", "Fri"], start: "11:00", end: "12:30" },
  { id: 4, days: ["Mon", "Wed", "Fri"], start: "13:00", end: "14:30" },
  { id: 5, days: ["Mon", "Wed", "Fri"], start: "14:30", end: "16:00" },
  { id: 6, days: ["Mon", "Wed", "Fri"], start: "16:00", end: "17:30" },
  { id: 7, days: ["Mon", "Wed", "Fri"], start: "17:30", end: "19:00" },
  { id: 8, days: ["Mon", "Wed", "Fri"], start: "19:00", end: "20:30" },
  { id: 9, days: ["Mon", "Wed", "Fri"], start: "20:30", end: "22:00" },

  { id: 10, days: ["Sat", "Sun"], start: "08:00", end: "10:00" },
  { id: 11, days: ["Sat", "Sun"], start: "10:00", end: "12:00" },
  { id: 12, days: ["Sat", "Sun"], start: "13:00", end: "15:00" },
  { id: 13, days: ["Sat", "Sun"], start: "15:00", end: "17:00" },
  { id: 14, days: ["Sat", "Sun"], start: "17:00", end: "19:00" },

  { id: 15, days: ["Tue", "Thu", "Sat"], start: "08:00", end: "09:30" },
  { id: 16, days: ["Tue", "Thu", "Sat"], start: "09:30", end: "11:00" },
  { id: 17, days: ["Tue", "Thu", "Sat"], start: "11:00", end: "12:30" },
  { id: 18, days: ["Tue", "Thu", "Sat"], start: "13:00", end: "14:30" },
  { id: 19, days: ["Tue", "Thu", "Sat"], start: "14:30", end: "16:00" },
  { id: 20, days: ["Tue", "Thu", "Sat"], start: "16:00", end: "17:30" },
  { id: 21, days: ["Tue", "Thu", "Sat"], start: "17:30", end: "19:00" },
  { id: 22, days: ["Tue", "Thu", "Sat"], start: "19:00", end: "20:30" },
  { id: 23, days: ["Tue", "Thu", "Sat"], start: "20:30", end: "22:00" },
];

// Hàm lấy chuỗi mô tả ca học từ id
export function getShiftDescription(shiftId) {
  const shift = shifts.find(s => s.id === shiftId);
  if (!shift) return "Unknown shift";
  return `${shift.start}-${shift.end} ${shift.days.join(", ")}`;
}

// Hàm lấy toàn bộ map id => mô tả
export function getAllShiftDescriptions() {
  return shifts.map(shift => ({
    id: shift.id,
    description: `${shift.start}-${shift.end} ${shift.days.join(", ")}`,
  }));
}
