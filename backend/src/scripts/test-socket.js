const { io } = require("socket.io-client");

const socket = io("http://localhost:5000", {
  auth: { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTM2Yzc1YmU3YWEwNDBmOGQ5MzE2MTkiLCJyb2xlIjoiZmFybWVyIiwiaWF0IjoxNzgyNzg5ODQ4LCJleHAiOjE3ODI3OTA3NDh9.yRn4M_MAp2DUwMEBX6gsbwRgdT9tSxlKqUkzy8XE3Yo"  },
});

socket.on("connect", () => {
  console.log("✅ Connected:", socket.id);
  socket.emit("notification:test");
});

socket.on("notification:new", (payload) => {
  console.log("✅ Got notification:", payload);
});

socket.on("connect_error", (err) => {
  console.log("❌ Connection failed:", err.message);
});

socket.emit("market:subscribe", "wheat");
socket.on("market:update", (payload) => console.log("✅ Market update:", payload));