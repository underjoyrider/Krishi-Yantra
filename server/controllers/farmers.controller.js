const farmersService = require('../services/farmers.service');
const { successResponse, errorResponse } = require('../utils/response.util');

async function createFarmer(req, res, next) {
  try {
    const farmer = await farmersService.createFarmerProfile(req.body);
    return successResponse(res, { farmer }, 'Farmer profile created successfully', 201);
  } catch (err) {
    next(err);
  }
}

async function getFarmerById(req, res, next) {
  try {
    const { id } = req.params;
    const farmer = await farmersService.getFarmerById(id);
    if (!farmer) {
      return errorResponse(res, `Farmer not found with identifier: ${id}`, 404);
    }
    return successResponse(res, { farmer }, 'Farmer details retrieved successfully');
  } catch (err) {
    next(err);
  }
}

async function updateFarmer(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await farmersService.updateFarmer(id, req.body);
    return successResponse(res, { farmer: updated }, 'Farmer profile updated successfully');
  } catch (err) {
    next(err);
  }
}

async function deleteFarmer(req, res, next) {
  try {
    await farmersService.deleteFarmer(req.params.id);
    return successResponse(res, null, 'Farmer account deleted successfully');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createFarmer,
  getFarmerById,
  updateFarmer,
  deleteFarmer,
};
