const centersService = require('../services/centers.service');
const recommendationsService = require('../services/recommendations.service');
const { successResponse, errorResponse } = require('../utils/response.util');

async function getCenters(req, res, next) {
  try {
    const { sort, status, search } = req.query;
    const centers = await centersService.getAllCenters({ sort, status, search });
    return successResponse(res, { centers }, 'Procurement centers retrieved successfully');
  } catch (err) {
    next(err);
  }
}

async function getCenterById(req, res, next) {
  try {
    const { id } = req.params;
    const center = await centersService.getCenterById(id);
    if (!center) {
      return errorResponse(res, `Procurement center not found with ID: ${id}`, 404);
    }

    // Check alternative if center is crowded
    const alternative = await recommendationsService.getAlternativeCenterIfCrowded(center.id);

    return successResponse(
      res,
      { center, alternative: alternative.hasAlternative ? alternative : null },
      'Procurement center details retrieved successfully'
    );
  } catch (err) {
    next(err);
  }
}

async function getRecommendation(req, res, next) {
  try {
    const recommendation = await recommendationsService.getBestRecommendation();
    return successResponse(res, { recommendation }, 'Top procurement center recommendation retrieved');
  } catch (err) {
    next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return errorResponse(res, 'Status field is required', 400);
    }
    const updated = await centersService.updateCenterStatus(id, status);
    return successResponse(res, { center: updated }, 'Center status updated successfully');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCenters,
  getCenterById,
  getRecommendation,
  updateStatus,
};
