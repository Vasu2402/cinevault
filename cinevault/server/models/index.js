const User = require('./User');
const Movie = require('./Movie');
const Theatre = require('./Theatre');
const Show = require('./Show');
const Seat = require('./Seat');
const Booking = require('./Booking');
const FoodItem = require('./FoodItem');
const FoodOrder = require('./FoodOrder');
const FoodOrderItem = require('./FoodOrderItem');

// Associations
Movie.hasMany(Show, { foreignKey: 'movieId', as: 'shows' });
Show.belongsTo(Movie, { foreignKey: 'movieId', as: 'movie' });

Theatre.hasMany(Show, { foreignKey: 'theatreId', as: 'shows' });
Show.belongsTo(Theatre, { foreignKey: 'theatreId', as: 'theatre' });

Show.hasMany(Seat, { foreignKey: 'showId', as: 'seats' });
Seat.belongsTo(Show, { foreignKey: 'showId', as: 'show' });

User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Show.hasMany(Booking, { foreignKey: 'showId', as: 'bookings' });
Booking.belongsTo(Show, { foreignKey: 'showId', as: 'show' });

// Food & Beverages
Theatre.hasMany(FoodItem, { foreignKey: 'theatreId', as: 'foodItems' });
FoodItem.belongsTo(Theatre, { foreignKey: 'theatreId', as: 'theatre' });

Booking.hasOne(FoodOrder, { foreignKey: 'bookingId', as: 'foodOrder' });
FoodOrder.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });

User.hasMany(FoodOrder, { foreignKey: 'userId', as: 'foodOrders' });
FoodOrder.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Theatre.hasMany(FoodOrder, { foreignKey: 'theatreId', as: 'foodOrders' });
FoodOrder.belongsTo(Theatre, { foreignKey: 'theatreId', as: 'theatre' });

FoodOrder.hasMany(FoodOrderItem, { foreignKey: 'foodOrderId', as: 'items' });
FoodOrderItem.belongsTo(FoodOrder, { foreignKey: 'foodOrderId', as: 'foodOrder' });

FoodItem.hasMany(FoodOrderItem, { foreignKey: 'foodItemId', as: 'orderItems' });
FoodOrderItem.belongsTo(FoodItem, { foreignKey: 'foodItemId', as: 'foodItem' });

module.exports = { User, Movie, Theatre, Show, Seat, Booking, FoodItem, FoodOrder, FoodOrderItem };
