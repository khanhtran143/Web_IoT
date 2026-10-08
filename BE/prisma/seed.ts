import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Clean existing records if any
  await prisma.action.deleteMany();
  await prisma.dataSensor.deleteMany();
  await prisma.sensors.deleteMany();
  await prisma.devices.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed Default User
  const hashedPassword = await bcrypt.hash("123456", 10);
  const user = await prisma.user.create({
    data: {
      username: "admin",
      email: "khanhtq143@gmail.com",
      password: hashedPassword,
      full_name: "Trần Quốc Khánh",
      student_id: "B23DCAT150",
      class: "D23CQAT05-B",
      major: "IoT & Embedded Systems",
      avatar: "/avatar.jpg",
      github_url: "https://github.com/iot-smart-dashboard",
      figma_url: "https://www.figma.com/design/w9ja9VJ2rXH9RoI4eKTiGa/IoT?node-id=0-1&p=f&t=JodBVVmmPualFsZ4-0",
      postman_url: "https://postman.com/collections/smarthome-iot",
    },
  });
  console.log(`✅ Seeded User: ${user.email}`);

  // 3. Seed Devices
  const led = await prisma.devices.create({
    data: {
      name: "LED",
      type: "LIGHT",
      status: "ON",
      description: "Đèn LED Smart Living Room (ESP32 GPIO 2)",
    },
  });

  const fan = await prisma.devices.create({
    data: {
      name: "FAN",
      type: "FAN",
      status: "OFF",
      description: "Quạt làm mát thông minh (ESP32 GPIO 4)",
    },
  });
  console.log("✅ Seeded Devices: LED, FAN");

  // 4. Seed Sensors
  const tempSensor = await prisma.sensors.create({
    data: {
      name: "AHT20",
      type: "TEMPERATURE",
      unit: "°C",
      status: "ACTIVE",
      description: "Cảm biến nhiệt độ AHT20 độ chính xác cao",
    },
  });

  const humSensor = await prisma.sensors.create({
    data: {
      name: "AHT20",
      type: "HUMIDITY",
      unit: "%",
      status: "ACTIVE",
      description: "Cảm biến độ ẩm không khí AHT20",
    },
  });

  const lightSensor = await prisma.sensors.create({
    data: {
      name: "BH1750",
      type: "LIGHT",
      unit: "lux",
      status: "ACTIVE",
      description: "Cảm biến cường độ ánh sáng kỹ thuật số BH1750",
    },
  });
  console.log("✅ Seeded Sensors: AHT20 Temp, AHT20 Hum, BH1750 Light");

  // 5. Seed Historical Sensor Data
  const now = new Date();
  const sensorDataList = [];

  // Generate 60 historical readings (one per minute over the last hour + some today)
  for (let i = 60; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 1000);
    
    // Realistic temperature: 27.5 - 29.5
    const tempVal = parseFloat((28.0 + Math.sin(i / 5) * 1.2 + (Math.random() * 0.4 - 0.2)).toFixed(1));
    // Realistic humidity: 62 - 72%
    const humVal = parseFloat((67.0 + Math.cos(i / 6) * 4.0 + (Math.random() * 1.0 - 0.5)).toFixed(1));
    // Realistic light: 450 - 600 lux
    const lightVal = parseFloat((520 + Math.sin(i / 4) * 80 + Math.floor(Math.random() * 20 - 10)).toFixed(0));

    sensorDataList.push({
      sensor_id: tempSensor.id,
      value: tempVal,
      recorded_at: timestamp,
    });
    sensorDataList.push({
      sensor_id: humSensor.id,
      value: humVal,
      recorded_at: timestamp,
    });
    sensorDataList.push({
      sensor_id: lightSensor.id,
      value: lightVal,
      recorded_at: new Date(timestamp.getTime() + 1000), // 1 sec offset
    });
  }

  await prisma.dataSensor.createMany({
    data: sensorDataList,
  });
  console.log(`✅ Seeded ${sensorDataList.length} Sensor Data records`);

  // 6. Seed Action History
  const actionsData = [
    {
      user_id: user.id,
      device_id: led.id,
      action: "ON",
      status: "ON",
      activation_time: new Date(now.getTime() - 45 * 60 * 1000),
      response_time: 2400,
      response_at: new Date(now.getTime() - 45 * 60 * 1000 + 2400),
    },
    {
      user_id: user.id,
      device_id: fan.id,
      action: "ON",
      status: "ON",
      activation_time: new Date(now.getTime() - 30 * 60 * 1000),
      response_time: 1800,
      response_at: new Date(now.getTime() - 30 * 60 * 1000 + 1800),
    },
    {
      user_id: user.id,
      device_id: fan.id,
      action: "OFF",
      status: "OFF",
      activation_time: new Date(now.getTime() - 15 * 60 * 1000),
      response_time: 2150,
      response_at: new Date(now.getTime() - 15 * 60 * 1000 + 2150),
    },
    {
      user_id: user.id,
      device_id: fan.id,
      action: "ON",
      status: "DISCONNECT",
      activation_time: new Date(now.getTime() - 8 * 60 * 1000),
      response_time: 7200,
      response_at: new Date(now.getTime() - 8 * 60 * 1000 + 7200),
    },
    {
      user_id: user.id,
      device_id: led.id,
      action: "OFF",
      status: "OFF",
      activation_time: new Date(now.getTime() - 5 * 60 * 1000),
      response_time: 1950,
      response_at: new Date(now.getTime() - 5 * 60 * 1000 + 1950),
    },
    {
      user_id: user.id,
      device_id: led.id,
      action: "ON",
      status: "ON",
      activation_time: new Date(now.getTime() - 2 * 60 * 1000),
      response_time: 2300,
      response_at: new Date(now.getTime() - 2 * 60 * 1000 + 2300),
    },
  ];

  for (const act of actionsData) {
    await prisma.action.create({ data: act });
  }
  console.log(`✅ Seeded ${actionsData.length} Action History records`);

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
