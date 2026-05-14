/* ═══════════════════════════════════════════════════════════════
   CineVault — GraphQL API Client
   ═══════════════════════════════════════════════════════════════ */

const API_URL = window.location.origin + '/graphql';

/**
 * Execute a GraphQL query or mutation
 */
async function graphqlRequest(query, variables = {}) {
  const token = localStorage.getItem('cv_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    });

    const json = await response.json();

    if (json.errors) {
      const msg = json.errors[0]?.message || 'GraphQL Error';
      throw new Error(msg);
    }

    return json.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/* ── Movie Queries ──────────────────────────────────────── */

async function fetchMovies(genre = null) {
  const query = `
    query GetMovies($genre: String) {
      getMovies(genre: $genre) {
        id title genre rating duration description poster language releaseDate cast director
      }
    }
  `;
  const data = await graphqlRequest(query, { genre });
  return data.getMovies;
}

async function fetchMovieById(id) {
  const query = `
    query GetMovieById($id: ID!) {
      getMovieById(id: $id) {
        id title genre rating duration description poster language releaseDate cast director trailer
        shows {
          id time date price premiumPrice
          theatre { id name location }
        }
      }
    }
  `;
  const data = await graphqlRequest(query, { id });
  return data.getMovieById;
}

/* ── Show Queries ───────────────────────────────────────── */

async function fetchShows(movieId) {
  const query = `
    query GetShows($movieId: ID!) {
      getShows(movieId: $movieId) {
        id movieId theatreId time date price premiumPrice
        theatre { id name location }
      }
    }
  `;
  const data = await graphqlRequest(query, { movieId });
  return data.getShows;
}

/* ── Seat Queries ───────────────────────────────────────── */

async function fetchSeats(showId) {
  const query = `
    query GetSeats($showId: ID!) {
      getSeats(showId: $showId) {
        id showId seatNumber type isBooked lockedBy lockExpiry
      }
    }
  `;
  const data = await graphqlRequest(query, { showId });
  return data.getSeats;
}

/* ── Food Queries ───────────────────────────────────────── */

async function fetchFoodItems(theatreId) {
  const query = `
    query GetFoodItems($theatreId: ID!) {
      getFoodItems(theatreId: $theatreId) {
        id theatreId name description price availableQuantity
      }
    }
  `;
  const data = await graphqlRequest(query, { theatreId });
  return data.getFoodItems;
}

/* ── Booking Mutations ──────────────────────────────────── */

async function bookTicket(showId, seats, promoCode = null, food = null) {
  const query = `
    mutation BookTicket($showId: ID!, $seats: [String!]!, $promoCode: String, $food: [FoodSelectionInput!]) {
      bookTicket(showId: $showId, seats: $seats, promoCode: $promoCode, food: $food) {
        id bookingRef seats totalAmount discount status createdAt
        foodOrder {
          id totalAmount status
          items {
            id quantity unitPrice lineTotal
            foodItem { id name price }
          }
        }
        show {
          time date price premiumPrice
          movie { title poster }
          theatre { name location }
        }
      }
    }
  `;
  const data = await graphqlRequest(query, { showId, seats, promoCode, food });
  return data.bookTicket;
}

async function applyPromoCode(code, amount) {
  const query = `
    mutation ApplyPromo($code: String!, $amount: Float!) {
      applyPromo(code: $code, amount: $amount) {
        valid discount message
      }
    }
  `;
  const data = await graphqlRequest(query, { code, amount });
  return data.applyPromo;
}

async function fetchMyBookings() {
  const query = `
    query GetMyBookings {
      getMyBookings {
        id bookingRef seats totalAmount discount promoCode status createdAt
        show {
          time date price premiumPrice
          movie { id title poster genre duration rating }
          theatre { name location }
        }
      }
    }
  `;
  const data = await graphqlRequest(query);
  return data.getMyBookings;
}

async function cancelBookingAPI(bookingId) {
  const query = `
    mutation CancelBooking($bookingId: ID!) {
      cancelBooking(bookingId: $bookingId)
    }
  `;
  const data = await graphqlRequest(query, { bookingId });
  return data.cancelBooking;
}

/* ── Auth Mutations ─────────────────────────────────────── */

async function loginUser(email, password) {
  const query = `
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        user { id name email }
      }
    }
  `;
  const data = await graphqlRequest(query, { email, password });
  return data.login;
}

async function signupUser(name, email, password) {
  const query = `
    mutation Signup($name: String!, $email: String!, $password: String!) {
      signup(name: $name, email: $email, password: $password) {
        token
        user { id name email }
      }
    }
  `;
  const data = await graphqlRequest(query, { name, email, password });
  return data.signup;
}
