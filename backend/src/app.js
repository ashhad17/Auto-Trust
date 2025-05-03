const carListingRoutes = require('./routes/carListings');
const serviceProviderRoutes = require('./routes/serviceProviders');

// Mount routes
app.use('/api/v1/car-listings', carListingRoutes);
app.use('/api/v1/service-providers', serviceProviderRoutes); 