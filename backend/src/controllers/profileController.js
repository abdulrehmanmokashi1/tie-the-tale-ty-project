const WeddingProfile = require('../models/WeddingProfile');
const BudgetCategory = require('../models/BudgetCategory');

const createDefaultBudgetCategories = async (userId, totalBudget) => {
  await BudgetCategory.deleteMany({ user: userId });
  
  const categories = [
    { category: 'Venue', allocated: totalBudget * 0.30, color: '#FF6384' },
    { category: 'Food & Catering', allocated: totalBudget * 0.25, color: '#36A2EB' },
    { category: 'Decoration', allocated: totalBudget * 0.15, color: '#FFCE56' },
    { category: 'Photography', allocated: totalBudget * 0.10, color: '#4BC0C0' },
    { category: 'Travel & Stay', allocated: totalBudget * 0.10, color: '#9966FF' },
    { category: 'Other', allocated: totalBudget * 0.10, color: '#C9CBCF' }
  ];

  const docs = categories.map(c => ({ user: userId, ...c }));
  await BudgetCategory.insertMany(docs);
};

exports.getProfile = async (req, res, next) => {
  try {
    const profile = await WeddingProfile.findOne({ user: req.user.id }).populate('wishlistedVenues');
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

exports.createOrUpdateProfile = async (req, res, next) => {
  try {
    const { brideName, groomName, weddingDate, destination, guestCount, totalBudget } = req.body;
    let profile = await WeddingProfile.findOne({ user: req.user.id });
    
    if (profile) {
      profile.brideName = brideName || profile.brideName;
      profile.groomName = groomName || profile.groomName;
      profile.weddingDate = weddingDate || profile.weddingDate;
      profile.destination = destination || profile.destination;
      profile.guestCount = guestCount || profile.guestCount;
      if (totalBudget !== undefined && totalBudget !== profile.totalBudget) {
        profile.totalBudget = totalBudget;
        await createDefaultBudgetCategories(req.user.id, totalBudget);
      }
      await profile.save();
    } else {
      profile = await WeddingProfile.create({
        user: req.user.id, brideName, groomName, weddingDate, destination, guestCount, totalBudget
      });
      await createDefaultBudgetCategories(req.user.id, totalBudget || 0);
    }
    
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

exports.toggleWishlistVenue = async (req, res, next) => {
  try {
    const venueId = req.params.venueId;
    let profile = await WeddingProfile.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });
    
    const index = profile.wishlistedVenues.indexOf(venueId);
    if (index > -1) {
      profile.wishlistedVenues.splice(index, 1);
    } else {
      profile.wishlistedVenues.push(venueId);
    }
    await profile.save();
    res.json({ success: true, data: profile.wishlistedVenues });
  } catch (error) {
    next(error);
  }
};
