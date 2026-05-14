const { gql } = require('graphql-tag');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Movie {
    id: ID!
    title: String!
    genre: String
    rating: String
    duration: Int
    description: String
    poster: String
    language: String
    releaseDate: String
    cast: String
    director: String
    trailer: String
    status: String
    shows: [Show]
  }

  type Theatre {
    id: ID!
    name: String!
    location: String
  }

  type Show {
    id: ID!
    time: String!
    date: String!
    price: Float!
    premiumPrice: Float!
    movieId: ID
    theatreId: ID
    theatre: Theatre
    movie: Movie
  }

  type Seat {
    id: ID!
    showId: ID!
    seatNumber: String!
    type: String
    isBooked: Boolean
    lockedBy: String
    lockExpiry: String
  }

  type Booking {
    id: ID!
    bookingRef: String
    seats: [String!]
    totalAmount: Float
    discount: Float
    promoCode: String
    status: String
    createdAt: String
    show: Show
    foodOrder: FoodOrder
  }

  type FoodItem {
    id: ID!
    theatreId: ID!
    name: String!
    description: String
    price: Float!
    availableQuantity: Int!
  }

  type FoodOrderItem {
    id: ID!
    quantity: Int!
    unitPrice: Float!
    lineTotal: Float!
    foodItem: FoodItem!
  }

  type FoodOrder {
    id: ID!
    totalAmount: Float!
    status: String!
    items: [FoodOrderItem!]!
  }

  input FoodSelectionInput {
    foodItemId: ID!
    quantity: Int!
  }

  type PromoResult {
    valid: Boolean!
    discount: Float
    message: String
  }

  type Query {
    getMovies(genre: String): [Movie]
    getMovieById(id: ID!): Movie
    getShows(movieId: ID!): [Show]
    getSeats(showId: ID!): [Seat]
    getMyBookings: [Booking]
    getFoodItems(theatreId: ID!): [FoodItem]
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload
    signup(name: String!, email: String!, password: String!): AuthPayload
    
    bookTicket(showId: ID!, seats: [String!]!, promoCode: String, food: [FoodSelectionInput!]): Booking
    applyPromo(code: String!, amount: Float!): PromoResult
    cancelBooking(bookingId: ID!): Boolean
  }
`;

module.exports = typeDefs;
