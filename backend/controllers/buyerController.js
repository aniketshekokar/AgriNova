import { inMemoryStore } from '../config/database.js';

// 1. GET /api/buyers
export const getBuyers = async (req, res, next) => {
  try {
    const { district, type, search } = req.query;
    let buyers = [...inMemoryStore.buyers];

    if (district && district !== 'All') {
      buyers = buyers.filter(b => b.district?.toLowerCase().includes(district.toLowerCase()));
    }
    if (type && type !== 'All') {
      buyers = buyers.filter(b => b.businessType?.toLowerCase().includes(type.toLowerCase()));
    }
    if (search) {
      buyers = buyers.filter(b =>
        b.businessName?.toLowerCase().includes(search.toLowerCase()) ||
        b.contactPerson?.toLowerCase().includes(search.toLowerCase()) ||
        b.district?.toLowerCase().includes(search.toLowerCase())
      );
    }

    return res.status(200).json({
      success: true,
      data: buyers
    });
  } catch (error) {
    next(error);
  }
};

// 2. GET /api/buyers/:id
export const getBuyerById = async (req, res, next) => {
  try {
    const buyer = inMemoryStore.buyers.find(b => b.id === req.params.id || b.user_id === req.params.id);
    if (!buyer) {
      return res.status(404).json({
        success: false,
        message: 'Buyer not found',
        errorCode: 'BUYER_NOT_FOUND'
      });
    }

    return res.status(200).json({
      success: true,
      data: buyer
    });
  } catch (error) {
    next(error);
  }
};

// 3. POST /api/buyers
export const registerBuyer = async (req, res, next) => {
  try {
    const {
      businessName,
      businessType,
      contactPerson,
      email,
      mobile,
      state,
      district,
      taluka,
      city,
      address,
      pincode,
      gstNumber
    } = req.body;

    if (!businessName || !contactPerson || !mobile) {
      return res.status(400).json({
        success: false,
        message: 'Business Name, Contact Person, and Mobile Number are required.',
        errorCode: 'VALIDATION_ERROR'
      });
    }

    const newBuyer = {
      id: 'b_' + Date.now(),
      businessName,
      businessType: businessType || 'Wholesaler',
      contactPerson,
      email: email || `${mobile}@agrinova.in`,
      mobile,
      state: state || 'Maharashtra',
      district: district || 'Pune',
      taluka: taluka || 'Haveli',
      city: city || 'Pune',
      address: address || `${district}, Maharashtra`,
      pincode: pincode || '411001',
      gstNumber: gstNumber || '',
      verificationStatus: 'VERIFIED',
      created_at: new Date().toISOString()
    };

    inMemoryStore.buyers.push(newBuyer);

    return res.status(201).json({
      success: true,
      message: 'Business registered successfully',
      data: newBuyer
    });
  } catch (error) {
    next(error);
  }
};

// 4. PUT /api/buyers/:id
export const updateBuyer = async (req, res, next) => {
  try {
    const index = inMemoryStore.buyers.findIndex(b => b.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Buyer not found',
        errorCode: 'BUYER_NOT_FOUND'
      });
    }

    const updated = {
      ...inMemoryStore.buyers[index],
      ...req.body,
      updated_at: new Date().toISOString()
    };

    inMemoryStore.buyers[index] = updated;

    return res.status(200).json({
      success: true,
      message: 'Buyer details updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};
