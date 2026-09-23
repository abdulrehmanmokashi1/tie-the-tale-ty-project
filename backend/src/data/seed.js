require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Venue = require('../models/Venue');
const Vendor = require('../models/Vendor');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Venue.deleteMany();
    await Vendor.deleteMany();
    console.log('Cleared existing Venues and Vendors');

    const venues = [
      { name: 'Taj Exotica Resort & Spa', city: 'Goa', type: 'Beach Resort', description: 'Luxury beachfront resort in Benaulim.', capacity: 800, pricePerDay: 500000, photos: ['https://picsum.photos/seed/venue1/800/600'], facilities: ['Pool', 'AC', 'Parking'], location: 'Benaulim, Goa', rating: 4.8 },
      { name: 'The Leela Goa', city: 'Goa', type: 'Beach Resort', description: 'Riverside and beach resort.', capacity: 1000, pricePerDay: 600000, photos: ['https://picsum.photos/seed/venue2/800/600'], facilities: ['Pool', 'AC', 'Spa'], location: 'Cavelossim, Goa', rating: 4.9 },
      { name: 'W Goa', city: 'Goa', type: 'Beachfront Hotel', description: 'Vibrant resort on Vagator beach.', capacity: 500, pricePerDay: 400000, photos: ['https://picsum.photos/seed/venue3/800/600'], facilities: ['Pool', 'Bar', 'Parking'], location: 'Vagator, Goa', rating: 4.6 },
      { name: 'Rambagh Palace', city: 'Jaipur', type: 'Palace', description: 'The Jewel of Jaipur.', capacity: 1500, pricePerDay: 1000000, photos: ['https://picsum.photos/seed/venue4/800/600'], facilities: ['AC', 'Parking', 'Gardens'], location: 'Bhawani Singh Road, Jaipur', rating: 4.9 },
      { name: 'Fairmont Jaipur', city: 'Jaipur', type: 'Heritage Hotel', description: 'Luxury hotel inspired by Mughal architecture.', capacity: 1200, pricePerDay: 800000, photos: ['https://picsum.photos/seed/venue5/800/600'], facilities: ['AC', 'Pool', 'Parking'], location: 'Kukas, Jaipur', rating: 4.8 },
      { name: 'Shiv Vilas Resort', city: 'Jaipur', type: 'Palace Resort', description: 'A majestic palace theme resort.', capacity: 2000, pricePerDay: 700000, photos: ['https://picsum.photos/seed/venue6/800/600'], facilities: ['AC', 'Pool', 'Parking'], location: 'Delhi-Jaipur Highway', rating: 4.5 },
      { name: 'Chomu Palace', city: 'Jaipur', type: 'Heritage Hotel', description: 'A historic fort palace.', capacity: 800, pricePerDay: 500000, photos: ['https://picsum.photos/seed/venue7/800/600'], facilities: ['AC', 'Parking'], location: 'Chomu, Jaipur', rating: 4.4 },
      { name: 'The Oberoi Udaivilas', city: 'Udaipur', type: 'Lakeside Palace', description: 'Spectacular views of Lake Pichola.', capacity: 800, pricePerDay: 1200000, photos: ['https://picsum.photos/seed/venue8/800/600'], facilities: ['AC', 'Pool', 'Spa'], location: 'Lake Pichola, Udaipur', rating: 5.0 },
      { name: 'Taj Lake Palace', city: 'Udaipur', type: 'Lakeside Palace', description: 'Iconic palace floating on the lake.', capacity: 500, pricePerDay: 1500000, photos: ['https://picsum.photos/seed/venue9/800/600'], facilities: ['AC', 'Spa', 'Boat transfer'], location: 'Lake Pichola, Udaipur', rating: 4.9 },
      { name: 'RAAS Devigarh', city: 'Udaipur', type: 'Luxury Resort', description: '18th-century palace converted into a luxury resort.', capacity: 600, pricePerDay: 600000, photos: ['https://picsum.photos/seed/venue10/800/600'], facilities: ['AC', 'Pool', 'Parking'], location: 'Delwara, Udaipur', rating: 4.7 }
    ];
    await Venue.insertMany(venues);
    console.log('Inserted Venues');

    const vendors = [
      // Goa
      { name: 'Goa Snapshots', city: 'Goa', category: 'Photographer', description: 'Candid wedding photography.', startingPrice: 50000, photos: ['https://picsum.photos/seed/vendor1/800/600'], contactEmail: 'goasnaps@example.com', contactPhone: '9876543210', rating: 4.5 },
      { name: 'Beachfront Decor', city: 'Goa', category: 'Decorator', description: 'Specialists in beach wedding setups.', startingPrice: 150000, photos: ['https://picsum.photos/seed/vendor2/800/600'], contactEmail: 'beachdecor@example.com', contactPhone: '9876543211', rating: 4.7 },
      { name: 'Goa Feast Caterers', city: 'Goa', category: 'Caterer', description: 'Seafood and multi-cuisine catering.', startingPrice: 1000, photos: ['https://picsum.photos/seed/vendor3/800/600'], contactEmail: 'goafeast@example.com', contactPhone: '9876543212', rating: 4.6 },
      { name: 'Glam by Rita', city: 'Goa', category: 'Makeup Artist', description: 'Bridal makeup artist.', startingPrice: 20000, photos: ['https://picsum.photos/seed/vendor4/800/600'], contactEmail: 'ritaglam@example.com', contactPhone: '9876543213', rating: 4.8 },
      { name: 'DJ Sunburn', city: 'Goa', category: 'DJ', description: 'Best party tracks for your sangeet.', startingPrice: 30000, photos: ['https://picsum.photos/seed/vendor5/800/600'], contactEmail: 'djsunburn@example.com', contactPhone: '9876543214', rating: 4.9 },
      
      // Jaipur
      { name: 'Royal Clicks', city: 'Jaipur', category: 'Photographer', description: 'Pre-wedding and royal style photography.', startingPrice: 80000, photos: ['https://picsum.photos/seed/vendor6/800/600'], contactEmail: 'royalclicks@example.com', contactPhone: '9876543215', rating: 4.7 },
      { name: 'Maharaja Decorators', city: 'Jaipur', category: 'Decorator', description: 'Grand palace style decorations.', startingPrice: 250000, photos: ['https://picsum.photos/seed/vendor7/800/600'], contactEmail: 'maharajadecor@example.com', contactPhone: '9876543216', rating: 4.9 },
      { name: 'Rajwadi Caterers', city: 'Jaipur', category: 'Caterer', description: 'Authentic Rajasthani thali and modern cuisines.', startingPrice: 1500, photos: ['https://picsum.photos/seed/vendor8/800/600'], contactEmail: 'rajwadicater@example.com', contactPhone: '9876543217', rating: 4.6 },
      { name: 'Kavya Makeovers', city: 'Jaipur', category: 'Makeup Artist', description: 'HD and Airbrush makeup.', startingPrice: 25000, photos: ['https://picsum.photos/seed/vendor9/800/600'], contactEmail: 'kavyamakeover@example.com', contactPhone: '9876543218', rating: 4.8 },
      { name: 'Mehendi by Meera', city: 'Jaipur', category: 'Mehendi Artist', description: 'Intricate Rajasthani mehendi designs.', startingPrice: 15000, photos: ['https://picsum.photos/seed/vendor10/800/600'], contactEmail: 'meerahenna@example.com', contactPhone: '9876543219', rating: 4.9 },
      
      // Udaipur
      { name: 'Lake City Studios', city: 'Udaipur', category: 'Photographer', description: 'Capturing moments by the lake.', startingPrice: 75000, photos: ['https://picsum.photos/seed/vendor11/800/600'], contactEmail: 'lakecitystudios@example.com', contactPhone: '9876543220', rating: 4.6 },
      { name: 'Udaipur Event Planners', city: 'Udaipur', category: 'Decorator', description: 'Elegant floral and lighting setup.', startingPrice: 200000, photos: ['https://picsum.photos/seed/vendor12/800/600'], contactEmail: 'uep@example.com', contactPhone: '9876543221', rating: 4.8 },
      { name: 'Mewar Flavours', city: 'Udaipur', category: 'Caterer', description: 'Premium catering services for royal weddings.', startingPrice: 1800, photos: ['https://picsum.photos/seed/vendor13/800/600'], contactEmail: 'mewarflavours@example.com', contactPhone: '9876543222', rating: 4.7 },
      { name: 'Beauty by Anjali', city: 'Udaipur', category: 'Makeup Artist', description: 'Flawless bridal looks.', startingPrice: 22000, photos: ['https://picsum.photos/seed/vendor14/800/600'], contactEmail: 'anjalibeauty@example.com', contactPhone: '9876543223', rating: 4.5 },
      { name: 'DJ Beats Udaipur', city: 'Udaipur', category: 'DJ', description: 'Bollywood and international tracks.', startingPrice: 25000, photos: ['https://picsum.photos/seed/vendor15/800/600'], contactEmail: 'djbeatsudpr@example.com', contactPhone: '9876543224', rating: 4.6 }
    ];
    await Vendor.insertMany(vendors);
    console.log('Inserted Vendors');

    mongoose.disconnect();
    console.log('Disconnected');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding DB:', error);
    process.exit(1);
  }
};

seedDB();
