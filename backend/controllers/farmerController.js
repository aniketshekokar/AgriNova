import { inMemoryStore } from '../config/database.js';

// 1. GET /api/farmers
export const getFarmers = async (req, res, next) => {
  try {
    const { district, crop, search } = req.query;
    let farmers = [...inMemoryStore.farmers];

    if (district && district !== 'All') {
      farmers = farmers.filter(f => f.district?.toLowerCase().includes(district.toLowerCase()));
    }
    if (crop && crop !== 'All') {
      farmers = farmers.filter(f => f.mainCrop?.toLowerCase().includes(crop.toLowerCase()));
    }
    if (search) {
      farmers = farmers.filter(f =>
        f.name?.toLowerCase().includes(search.toLowerCase()) ||
        f.district?.toLowerCase().includes(search.toLowerCase()) ||
        f.mainCrop?.toLowerCase().includes(search.toLowerCase())
      );
    }

    return res.status(200).json({
      success: true,
      data: farmers
    });
  } catch (error) {
    next(error);
  }
};

// 2. GET /api/farmers/:id
export const getFarmerById = async (req, res, next) => {
  try {
    const farmer = inMemoryStore.farmers.find(f => f.id === req.params.id || f.user_id === req.params.id);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found',
        errorCode: 'FARMER_NOT_FOUND'
      });
    }

    return res.status(200).json({
      success: true,
      data: farmer
    });
  } catch (error) {
    next(error);
  }
};

// 3. POST /api/farmers
export const createFarmerListing = async (req, res, next) => {
  try {
    const { name, district, crop, quantity, unit, expectedPrice, taluka, village, phone } = req.body;

    if (!name || !district || (!crop && !req.body.mainCrop)) {
      return res.status(400).json({
        success: false,
        message: 'Name, district, and crop are required fields.',
        errorCode: 'VALIDATION_ERROR'
      });
    }

    const newFarmerListing = {
      id: 'f_' + Date.now(),
      name,
      district,
      taluka: taluka || 'Baramati',
      village: village || 'Malegaon',
      mainCrop: crop || req.body.mainCrop,
      crop: crop || req.body.mainCrop,
      quantity: parseFloat(quantity) || 50,
      unit: unit || 'Quintal',
      expectedPrice: parseFloat(expectedPrice) || 2500,
      phone: phone || '9823456789',
      farmSize: req.body.farmSize || '5.0 Acres',
      verification: 'VERIFIED',
      status: 'Active',
      created_at: new Date().toISOString()
    };

    inMemoryStore.farmers.push(newFarmerListing);

    // Also add to crops store for unified marketplace discovery
    inMemoryStore.crops.unshift({
      id: 'crop_' + Date.now(),
      name: newFarmerListing.mainCrop,
      category: 'Vegetables',
      quantity: newFarmerListing.quantity,
      unit: newFarmerListing.unit,
      expectedPrice: newFarmerListing.expectedPrice,
      location: `${district} Mandi`,
      harvestDate: new Date().toISOString().split('T')[0],
      quality: 'Good',
      farmer: name,
      phone: newFarmerListing.phone,
      description: `Fresh ${newFarmerListing.mainCrop} listed directly from farm in ${district}.`
    });

    return res.status(201).json({
      success: true,
      message: 'Farmer listing created successfully',
      data: newFarmerListing
    });
  } catch (error) {
    next(error);
  }
};

// 4. PUT /api/farmers/:id
export const updateFarmerListing = async (req, res, next) => {
  try {
    const index = inMemoryStore.farmers.findIndex(f => f.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Farmer listing not found',
        errorCode: 'FARMER_NOT_FOUND'
      });
    }

    const updated = {
      ...inMemoryStore.farmers[index],
      ...req.body,
      updated_at: new Date().toISOString()
    };

    inMemoryStore.farmers[index] = updated;

    return res.status(200).json({
      success: true,
      message: 'Farmer listing updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// 5. DELETE /api/farmers/:id
export const deleteFarmerListing = async (req, res, next) => {
  try {
    const index = inMemoryStore.farmers.findIndex(f => f.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Farmer listing not found',
        errorCode: 'FARMER_NOT_FOUND'
      });
    }

    inMemoryStore.farmers.splice(index, 1);

    return res.status(200).json({
      success: true,
      message: 'Farmer listing deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
