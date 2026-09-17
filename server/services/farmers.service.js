const prisma = require('../prisma');

async function createFarmerProfile(data) {
  const { name, phone, phoneNumber, email, village, district = 'Mandya', state = 'Karnataka', cropType = 'Paddy / Rice', language = 'en' } = data;
  const contactPhone = phone || phoneNumber;

  const existing = await prisma.user.findUnique({
    where: { phone: contactPhone },
  });

  if (existing) {
    const error = new Error(`Farmer with phone ${contactPhone} already exists.`);
    error.statusCode = 409;
    throw error;
  }

  const user = await prisma.user.create({
    data: {
      name,
      phone: contactPhone,
      phoneNumber: contactPhone,
      email: email || null,
      village: village || null,
      district,
      state,
      role: 'FARMER',
      farmerProfile: {
        create: {
          village: village || 'Shivapur',
          district,
          state,
          cropType,
          language,
        },
      },
    },
    include: {
      farmerProfile: true,
    },
  });

  return user;
}

async function getFarmerById(id) {
  const farmer = await prisma.user.findFirst({
    where: {
      OR: [{ id }, { phone: id }],
    },
    include: {
      farmerProfile: true,
      bookings: {
        where: { status: { in: ['WAITING', 'PROCESSING', 'BOOKED', 'CHECKED_IN'] } },
        include: { center: true, slot: true },
        take: 3,
      },
      notifications: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  });

  return farmer;
}

async function updateFarmer(id, updateData) {
  const { name, email, village, district, state, cropType, language } = updateData;

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(email !== undefined && { email }),
      ...(village && { village }),
      ...(district && { district }),
      ...(state && { state }),
      ...(cropType || language
        ? {
            farmerProfile: {
              upsert: {
                create: {
                  village: village || 'Shivapur',
                  district: district || 'Mandya',
                  state: state || 'Karnataka',
                  cropType: cropType || 'Paddy / Rice',
                  language: language || 'en',
                },
                update: {
                  ...(village && { village }),
                  ...(district && { district }),
                  ...(state && { state }),
                  ...(cropType && { cropType }),
                  ...(language && { language }),
                },
              },
            },
          }
        : {}),
    },
    include: {
      farmerProfile: true,
    },
  });

  return updated;
}

async function deleteFarmer(id) {
  const farmer = await prisma.user.findUnique({ where: { id } });
  if (!farmer || farmer.role !== 'FARMER') {
    const error = new Error('Farmer account not found.');
    error.statusCode = 404;
    throw error;
  }

  await prisma.user.delete({ where: { id } });
}

module.exports = {
  createFarmerProfile,
  getFarmerById,
  updateFarmer,
  deleteFarmer,
};
