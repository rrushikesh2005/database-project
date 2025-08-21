const multer = require("multer");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
const cors = require("cors");
const { Pool } = require("pg");
const app = express();
const port = 4000;
const default_addr = "data:image/png;base64,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";

// PostgreSQL connection
// NOTE: use YOUR postgres username and password here
const pool = new Pool({
  user: 'project',
  host: 'localhost',
  database: 'rating_system',
  password: 'project',
  port: 5432,
});

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dgapsjcnv', // Replace with your Cloudinary Cloud Name
  api_key: '537498145941987',       // Replace with your API Key
  api_secret: 'xeDQL0SWW8hIHO94iW8RBJ5q9J4',  // Replace with your API Secret
});

module.exports = cloudinary;
const upload = multer({ storage: multer.memoryStorage() });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// CORS: Give permission to localhost:3000 (ie our React app)
// to use this backend API
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Session information
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);

/////////////////////////////////////////////////////////////
// Authentication APIs
// Signup, Login, IsLoggedIn and Logout

// TODO: Implement authentication middleware
// Redirect unauthenticated users to the login page with respective status code
function isAuthenticated(req, res, next) {
  if (!req.session.userId) {
   return res.status(400).json({message : "Unauthorized"});
  }
  next();
}

// TODO: Implement user signup logic
// return JSON object with the following fields: {username, email, password}
// use correct status codes and messages mentioned in the lab document
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  // console.log(username,email,password);
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO Users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id',
      [username, email, hashedPassword]
    );

    req.session.userId = result.rows[0].user_id;

    // Instead of res.redirect(), send a JSON response
    res.status(200).json({ success: true, message: "User Registered Successfully" });

  } catch (err) {
    if (err.code === '23505') {
      res.status(400).json({ message: "Error: Email is already registered" });
    } else {
      console.error(err);
      res.status(500).json({ message: "Error signing up" });
    }
  }
});

// TODO: Implement user signup logic
// return JSON object with the following fields: {email, password}
// use correct status codes and messages mentioned in the lab document
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // console.log(email,password);

  try {
    // console.log("hii");
    const result = await pool.query("SELECT user_id, username, password_hash FROM users WHERE email = $1", [email]);
    // console.log(result);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password_hash);

      if (passwordMatch) {
        req.session.userId = user.user_id;
        req.session.username = user.username; // Store username in session
        return res.status(200).json({ message: "Login successful", username: user.username });
      } else {
        return res.status(400).json({ message: "Invaid credentials" });
      }
    } else {
      return res.status(400).json({ message: "Invaid credentials" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging in" });
  }
});

// TODO: Implement API used to check if the client is currently logged in or not.
// use correct status codes and messages mentioned in the lab document
app.get("/isLoggedIn", async (req, res) => {
  if (!req.session.userId) {
    return res.status(400).json({ loggedIn: false });
  }

  try {
    const result = await pool.query(
      "SELECT username,email FROM users WHERE user_id = $1",
      [req.session.userId]
    );

    if (result.rows.length > 0) {
      res.status(200).json({message : "Logged in", loggedIn: true, username: result.rows[0].username, email: result.rows[0].email });
    } else {
      res.status(400).json({message : "Not logged in", loggedIn: false });
    }
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).json({ loggedIn: false });
  }
});

// TODO: Implement API used to logout the user
// use correct status codes and messages mentioned in the lab document
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to log out" });
    }
    res.clearCookie("connect.sid"); // Clear session cookie
    res.status(200).json({ message: "Logged out successfully" });
  });
});

////////////////////////////////////////////////////
// APIs for the products
// use correct status codes and messages mentioned in the lab document
// TODO: Fetch and display all products from the database
app.get("/list-movies", isAuthenticated, async (req, res) => {
  try {
    // const searchQuery = req.query.search || "";
    let query = "SELECT * FROM Items WHERE category = 'Movie'";
    // const values = [];

    // if (searchQuery) {
    //   query += " AND title ILIKE $1";
    //   values.push(`%${searchQuery}%`);
    // }
    // console.log(values);
    query += " ORDER BY item_id ASC";

    const result = await pool.query(query);
    // console.log("hii",result.rows);
    res.status(200).json({
      message: "Movies fetched successfully",
      result: result.rows,
    });

  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ message: "Error listing movies" });
  }
});

app.get("/list-books", isAuthenticated, async (req, res) => {
  try {
    // const searchQuery = req.query.search || "";
    let query = "SELECT * FROM Items WHERE category = 'Book'";
    // const values = [];

    // if (searchQuery) {
    //   query += " AND title ILIKE $1";
    //   values.push(`%${searchQuery}%`);
    // }

    query += " ORDER BY item_id ASC";

    const result = await pool.query(query);
    res.status(200).json({
      message: "Books fetched successfully",
      result: result.rows,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Error listing books" });
  }
});

app.get("/list-tvshows", isAuthenticated, async (req, res) => {
  try {
    // const searchQuery = req.query.search || "";
    let query = "SELECT * FROM Items WHERE category = 'TV Show'";
    // const values = [];

    // if (searchQuery) {
    //   query += " AND title ILIKE $1";
    //   values.push(`%${searchQuery}%`);
    // }

    query += " ORDER BY item_id ASC";

    const result = await pool.query(query);
    res.status(200).json({
      message: "TV Shows fetched successfully",
      result: result.rows,
    });
  } catch (error) {
    console.error("Error fetching TV shows:", error);
    res.status(500).json({ message: "Error listing TV shows" });
  }
});

app.get("/api/items/:category/:itemId", async (req, res) => {
  const { category, itemId } = req.params;

  try {
    // console.log(10, itemId, category);
    const result = await pool.query("SELECT * FROM Items WHERE item_id = $1 and category = $2", [itemId, category]);

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]); // this should be JSON
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    console.error("Error fetching item details:", error);
    res.status(500).json({ message: "Error fetching item details" });
  }
});

app.get("/mark", async(req, res) => {
  const { itemId, category, mark } = req.query;
  const userId = req.session.userId;
  const boolmark = mark === 'true';

  try {
    const markstring = 'Already Done';
    const result = await pool.query("SELECT * FROM Watchlist WHERE user_id = $1 AND item_id = $2 AND category = $3 AND type = $4", [userId, itemId, category, markstring]);

    if(result.rows.length > 0){
      if(boolmark){
        const result = await pool.query("DELETE FROM Watchlist WHERE user_id = $1 AND item_id = $2 AND category = $3 AND type = $4", [userId, itemId, category, markstring]);
        res.status(200).json({message : "Unmarked", mark: false});
      }
      else{
        res.status(404).json({ message: "Marked Wrongly" });
      }
    }
    else{
      if(boolmark){
        res.status(404).json({ message: "Marked Wrongly" });
      }
      else{
        const result1 = await pool.query("SELECT * FROM Watchlist WHERE user_id = $1 AND item_id = $2 AND category = $3 AND type = $4", [userId, itemId, category, markstring]);
        if(result1.rows.length === 0){
          const result = await pool.query("INSERT INTO Watchlist VALUES ($1, $2, $3, $4)", [userId, itemId, category, markstring]);
        }
        res.status(200).json({message : "Marked", mark: true});
      }
    }
  }
  catch(error){
    console.error("Error Marking:", error);
    res.status(500).json({ message: "Error Marking" });
  }
});

app.get("/watchlist", async(req, res) => {
  const { itemId, category, watchlist } = req.query;
  const userId = req.session.userId;
  const boolwatch = watchlist === 'true';

  try {
    const watchstring = 'To be done';
    const result = await pool.query("SELECT * FROM Watchlist WHERE user_id = $1 AND item_id = $2 AND category = $3 AND type = $4", [userId, itemId, category, watchstring]);

    if(result.rows.length > 0){
      if(boolwatch){
        const result = await pool.query("DELETE FROM Watchlist WHERE user_id = $1 AND item_id = $2 AND category = $3 AND type = $4", [userId, itemId, category, watchstring]);
        res.status(200).json({message : "Removed", watchlist: false});
      }
      else{
        res.status(404).json({ message: "Error" });
      }
    }
    else{
      if(boolwatch){
        res.status(404).json({ message: "Error" });
      }
      else{
        const result1 = await pool.query("SELECT * FROM Watchlist WHERE user_id = $1 AND item_id = $2 AND category = $3 AND type = $4", [userId, itemId, category, watchstring]);
        if(result1.rows.length === 0){
          const result = await pool.query("INSERT INTO Watchlist VALUES ($1, $2, $3, $4)", [userId, itemId, category, watchstring]);
        }
        res.status(200).json({message : "Added", watchlist: true});
      }
    }
  }
  catch(error){
    console.error("Error in watchlist", error);
    res.status(500).json({ message: "Error in watchlist" });
  }
});

// POST /rate-item - Handle item rating
app.post('/rate-item', isAuthenticated, async (req, res) => {
  // console.log("3");
  const { itemId, category, rating } = req.body;
  // console.log("4",category);
  const userId = req.session.userId; // Assuming user is authenticated and user ID is stored in the session
  // console.log(itemId,rating , "dj");

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
  }

  try {
    // Check if the user already rated this item
    const existingRating = await pool.query(
      'SELECT * FROM UserRatings WHERE user_id = $1 AND item_id = $2 and category = $3',
      [userId, itemId,category]
    );

    if (existingRating.rows.length > 0) {
      // If user has already rated this item, update their rating
      await pool.query(
        'UPDATE UserRatings SET rating = $1, rated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND item_id = $3 AND category = $4',
        [rating, userId, itemId, category]
      );
    } else {
      // If the user has not rated this item, insert their rating
      await pool.query(
        'INSERT INTO UserRatings (user_id, item_id, rating, category) VALUES ($1, $2, $3, $4)',
        [userId, itemId, rating, category]
      );
    }

    // Update average rating in the Ratings table
    const ratingsResult = await pool.query(
      'SELECT AVG(rating) AS average_rating, COUNT(rating) AS num_reviews FROM UserRatings WHERE item_id = $1',
      [itemId]
    );

    const { average_rating, num_reviews } = ratingsResult.rows[0];

    // Update the Ratings table with new average and review count
    // await pool.query(
    //   'UPDATE Ratings SET average_rating = $1, num_reviews = $2 WHERE item_id = $3',
    //   [average_rating, num_reviews, itemId]
    // );

    res.status(200).json({ message: 'Rating submitted successfully!' });
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.post('/add-genres', async(req, res) => {
  const { id, category, genres } = req.body;
  const userId = req.session.userId;

  try{
    const result = await pool.query('SELECT item_id FROM ItemGenres WHERE item_id = $1 AND category = $2', [id, category]);
    if(result.rows.length > 0){return res.status(200).json({ message: 'Genres added successfully' });}
    for (const genre of genres) {
      const res = await pool.query('SELECT genre_id FROM Genres WHERE genre_id = $1 AND name = $2', [genre.id, genre.name]);
      if(res.rows.length > 0) continue;
      await pool.query(`INSERT INTO Genres (genre_id, name) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [genre.id, genre.name]);
    }

    for (const genre of genres) {
      const res = await pool.query('SELECT item_id FROM ItemGenres WHERE item_id = $1 AND genre_id = $2 AND category = $3', [id, genre.id, category]);
      if(res.rows.length > 0) continue;
      await pool.query(`INSERT INTO ItemGenres (item_id, genre_id, category) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`, [id, genre.id, category]);
    }
    res.status(200).json({ message: 'Genres added successfully' });
  } catch (error) {
    console.error('Error adding genres:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/add-to-db', async(req, res) => {
  const { id, title, category, description, release_date, director, poster_path } = req.body;
  const userId = req.session.userId;
  // console.log("Item: ", id, title, poster_path);
  image_url = ``;
  if(category !== 'Book'){
    image_url = `https://image.tmdb.org/t/p/w500${poster_path}`;
  }
  else{
    image_url = `https://covers.openlibrary.org/b/id/${poster_path}-L.jpg`
  }
  const result = await pool.query("SELECT item_id FROM Items WHERE item_id = $1 and category = $2", [id, category]);
  if(result.rows.length > 0) {return res.status(200).json({ message: 'Movie added succesfully' });}
  try {
    const release_date_value = release_date ? release_date : null;
    await pool.query(
      'INSERT INTO Items (item_id, title, category, description, release_date, author_creator, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [id, title, category, description, release_date_value, director, image_url] 
    );

    res.status(200).json({ message: 'Movie added succesfully' });
  }
  catch (error) {
    console.error('Error adding movie: ', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// GET /api/items/:itemId/average-rating - Fetch the average rating of a specific item
app.get('/api/items/:category/:itemId/average-rating', async (req, res) => {
  const { category, itemId } = req.params;
  // const { category} = req.query;
  // console.log("1",category,itemId);

  try {
    // Calculate average and count from UserRatings table
    const result = await pool.query(
      `
      SELECT AVG(rating) AS average_rating, COUNT(*) AS rating_count
      FROM UserRatings
      WHERE item_id = $1 and category = $2
      `,
      [itemId, category]
    );

    const avg = result.rows[0].average_rating;
    const count = result.rows[0].rating_count;
    // console.log("2",avg,count,category);

    if (count > 0) {
      res.status(200).json({
        message: 'Average rating calculated successfully',
        averageRating: parseFloat(avg),
        ratingCount: parseInt(count),
      });
    } else {
      res.status(404).json({ message: 'No ratings available for this item' });
    }
  } catch (error) {
    console.error('Error calculating average rating:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/items/:category/:itemId/rating-counts', async (req, res) => {
  const { category, itemId } = req.params;

  try {
    // Query the UserRatings table to count the number of 1-star, 2-star, ..., 5-star ratings
    const result = await pool.query(
      `
      SELECT
        COUNT(CASE WHEN rating = 1 THEN 1 END) AS one_star_count,
        COUNT(CASE WHEN rating = 2 THEN 1 END) AS two_star_count,
        COUNT(CASE WHEN rating = 3 THEN 1 END) AS three_star_count,
        COUNT(CASE WHEN rating = 4 THEN 1 END) AS four_star_count,
        COUNT(CASE WHEN rating = 5 THEN 1 END) AS five_star_count
      FROM UserRatings
      WHERE item_id = $1 and category = $2
      `,
      [itemId, category]
    );

    const counts = result.rows[0];

    res.status(200).json({
      message: 'Rating counts retrieved successfully',
      oneStarCount: parseInt(counts.one_star_count),
      twoStarCount: parseInt(counts.two_star_count),
      threeStarCount: parseInt(counts.three_star_count),
      fourStarCount: parseInt(counts.four_star_count),
      fiveStarCount: parseInt(counts.five_star_count),
    });
  } catch (error) {
    console.error('Error retrieving rating counts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// GET /api/items/:itemId/user-rating - Fetch the logged-in user's rating for an item
app.get('/api/items/:category/:itemId/user-rating', isAuthenticated, async (req, res) => {
  const { category, itemId } = req.params;
  const userId = req.session.userId;

  try {
    const result = await pool.query(
      'SELECT rating FROM UserRatings WHERE user_id = $1 AND item_id = $2 AND category = $3',
      [userId, itemId, category]
    );

    if (result.rows.length > 0) {
      res.status(200).json({ userRating: result.rows[0].rating });
    } else {
      res.status(200).json({ userRating: null }); // Not rated yet
    }
  } catch (error) {
    console.error('Error fetching user rating:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/add-review', isAuthenticated, async (req, res) => {
  const { itemId, category, reviewText } = req.body;
  const userId = req.session.userId;

  if (!reviewText || reviewText.trim() === '') {
    return res.status(400).json({ message: 'Review text cannot be empty.' });
  }

  try {
    await pool.query(
      'INSERT INTO UserReviews (user_id, item_id, review_text, category) VALUES ($1, $2, $3, $4)',
      [userId, itemId, reviewText, category]
    );

    res.status(200).json({ message: 'Review submitted successfully!' });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.get('/api/items/:category/:itemId/reviews', async (req, res) => {
  const { category, itemId } = req.params;

  try {
    const result = await pool.query(
      `SELECT u.username, ur.review_text, ur.reviewed_at
       FROM UserReviews ur
       JOIN Users u ON ur.user_id = u.user_id
       WHERE ur.item_id = $1 AND ur.category = $2
       ORDER BY ur.reviewed_at DESC`,
      [itemId, category]
    );

    res.status(200).json({ reviews: result.rows });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/friends/add', isAuthenticated, async (req, res) => {
  const { targetUsername } = req.body;
  const userId = req.session.userId;

  if (!targetUsername) {
    return res.status(400).json({ message: 'Target username is required.' });
  }

  try {
    // Get target user ID
    const targetUserResult = await pool.query(
      'SELECT user_id FROM Users WHERE username = $1',
      [targetUsername]
    );

    if (targetUserResult.rows.length === 0) {
      return res.status(404).json({ message: 'Target user not found.' });
    }

    const targetUserId = targetUserResult.rows[0].user_id;

    if (userId === targetUserId) {
      return res.status(400).json({ message: 'You cannot send a friend request to yourself.' });
    }

    const user_id_1 = userId;
    const user_id_2 = targetUserId;

    // Check if accepted friendship already exists in this direction
    const existingFriendRequest = await pool.query(
      'SELECT status FROM Friends WHERE user_id_1 = $1 AND user_id_2 = $2 AND status = $3',
      [user_id_1, user_id_2, 'Accepted']
    );

    const pendingRequest = await pool.query(
      'SELECT status FROM Friends WHERE user_id_1 = $1 AND user_id_2 = $2 AND status = $3',
      [user_id_1, user_id_2, 'Pending']
    );

    if (existingFriendRequest.rows.length > 0) {
      return res.status(400).json({ message: `Friendship already exists` });
    }

    // Insert pending friend request (no duplicate check here)
    if(pendingRequest.rows.length === 0){
      await pool.query(
        'INSERT INTO Friends (user_id_1, user_id_2, status) VALUES ($1, $2, $3)',
        [user_id_1, user_id_2, 'Pending']
      );
    }

    // Check if the pending friend request was newly inserted
    

      // Follow request notification (only once)
    // Check for existing 'follow_request' notification
const followExists = await pool.query(
  `SELECT 1 FROM notifications 
   WHERE user_id = $1 AND sender_id = $2 AND type = 'follow_request'`,
  [targetUserId, userId]
);

if (followExists.rows.length === 0) {
  await pool.query(
    `INSERT INTO notifications (user_id, sender_id, type, message, status)
     VALUES ($1, $2, 'follow_request', $3, 'seen')`,
    [targetUserId, userId, 'started following you.']
  );
}

// Check for existing 'friend_request' notification
const friendExists = await pool.query(
  `SELECT 1 FROM notifications 
   WHERE user_id = $1 AND sender_id = $2 AND type = 'friend_request'`,
  [targetUserId, userId]
);

if (friendExists.rows.length === 0) {
  await pool.query(
    `INSERT INTO notifications (user_id, sender_id, type, message, status)
     VALUES ($1, $2, 'friend_request', $3, 'pending')`,
    [targetUserId, userId, 'sent you a friend request.']
  );
}


    res.status(200).json({ message: 'Friend request sent successfully.' });

  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.post('/api/follow', isAuthenticated, async (req, res) => {
  const { targetUsername } = req.body;
  const userId = req.session.userId;

  if (!targetUsername) {
    return res.status(400).json({ message: 'Target username is required.' });
  }

  try {
    // Find target user's ID
    const targetUserResult = await pool.query(
      'SELECT user_id FROM Users WHERE username = $1',
      [targetUsername]
    );

    if (targetUserResult.rows.length === 0) {
      return res.status(404).json({ message: 'Target user not found.' });
    }

    const targetUserId = targetUserResult.rows[0].user_id;

    if (userId === targetUserId) {
      return res.status(400).json({ message: 'You cannot send a friend request to yourself.' });
    }

    const user_id_1 = userId;
    const user_id_2 = targetUserId;

    
    const existingFriendRequest = await pool.query(
      'SELECT status FROM Friends WHERE user_id_1 = $1 AND user_id_2 = $2',
      [user_id_1, user_id_2]
    );

    if (existingFriendRequest.rows.length > 0) {
      const existingStatus = existingFriendRequest.rows[0].status;
      return res.status(400).json({ message: `You are already following ` });
    }

    await pool.query(
      'INSERT INTO Friends (user_id_1, user_id_2, status) VALUES ($1, $2, $3)',
      [user_id_1, user_id_2, 'Pending']
    );

    await pool.query(
      `INSERT INTO notifications (user_id, sender_id, type, message, status)
      VALUES ($1, $2, 'follow_request', $3, 'seen')`,
      [targetUserId, userId, 'started following you.']
    );

    // Create "friend request" notification
    // await pool.query(
    //   `INSERT INTO notifications (user_id, sender_id, type, message, status)
    //   VALUES ($1, $2, 'friend_request', $3, 'pending')`,
    //   [targetUserId, userId, 'sent you a friend request.']
    // );

    res.status(200).json({ message: 'Friend request sent successfully.' });

  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.get('/api/friends/search', isAuthenticated, async (req, res) => {
  const { query } = req.query;
  const userId = req.session.userId;

  if (!query || query.trim() === '') {
    return res.status(400).json({ message: 'Search query is required.' });
  }

  try {
    const result = await pool.query(
      `SELECT username,profile_picture
       FROM Users
       WHERE username ILIKE $1 AND user_id <> $2
       LIMIT 10`,
      [`%${query}%`, userId] // Exclude yourself from search results
    );

    res.status(200).json({ users: result.rows });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.get('/api/user/stats', isAuthenticated, async (req, res) => {
  const userId = req.session.userId;

  try {
    const [friends,followersResult, followingResult, itemsRatedResult, reviewsGivenResult] = await Promise.all([
      pool.query(
        `SELECT COUNT(*) FROM Friends WHERE user_id_2 = $1 AND status IN ('Accepted')`,
        [userId]
      ),
      pool.query(
        `SELECT COUNT(*) FROM Friends WHERE user_id_2 = $1 AND status IN ('Pending', 'Accepted')`,
        [userId]
      ),
      pool.query(
        `SELECT COUNT(*) FROM Friends WHERE user_id_1 = $1 AND status IN ('Pending', 'Accepted')`,
        [userId]
      ),
      pool.query(`SELECT COUNT(*) FROM UserRatings WHERE user_id = $1`, [userId]),
      pool.query(`SELECT COUNT(*) FROM UserReviews WHERE user_id = $1`, [userId]),
    ]);

    res.status(200).json({
      friends : parseInt(friends.rows[0].count),
      followers: parseInt(followersResult.rows[0].count),
      following: parseInt(followingResult.rows[0].count),
      itemsRated: parseInt(itemsRatedResult.rows[0].count),
      reviewsGiven: parseInt(reviewsGivenResult.rows[0].count),
    });
  } catch (err) {
    console.error("Error fetching user stats:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.get('/api/user/followers', isAuthenticated, async (req, res) => {
  const userId = req.session.userId;

  try {
    const result = await pool.query(
      `SELECT u.username, u.profile_picture
       FROM Friends f
       JOIN Users u ON f.user_id_1 = u.user_id
       WHERE f.user_id_2 = $1 AND f.status = 'Pending'`,
      [userId]
    );

    const followers = result.rows.map(row => ({
      username: row.username,
      profile_picture: row.profile_picture || "https://your-default-image-url.com/default-profile.jpg"
    }));
    // console.log("gfh",followers);

    res.status(200).json({ followers });
  } catch (err) {
    console.error("Error fetching followers list:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.get('/api/user/friends', isAuthenticated, async (req, res) => {
  const userId = req.session.userId;

  try {
    const result = await pool.query(
      `SELECT u.username, u.profile_picture, u.user_id
       FROM Friends f
       JOIN Users u ON f.user_id_1 = u.user_id
       WHERE f.user_id_2 = $1 AND f.status = 'Accepted'`,
      [userId]
    );

    const friends = result.rows.map(row => ({
      username: row.username,
      profile_picture: row.profile_picture || default_addr,
      user_id: row.user_id
    }));


    res.status(200).json({ friends });
  } catch (err) {
    console.error("Error fetching followers list:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.get('/api/user/following', isAuthenticated, async (req, res) => {
  const userId = req.session.userId;

  try {
    const result = await pool.query(
      `SELECT u.username, u.profile_picture
       FROM Friends f
       JOIN Users u ON f.user_id_2 = u.user_id
       WHERE f.user_id_1 = $1 AND f.status = 'Pending'`,
      [userId]
    );

    const following = result.rows.map(row => ({
      username: row.username,
      profile_picture: row.profile_picture || "https://your-default-image-url.com/default-profile.jpg"
    }));

    res.status(200).json({ following });
  } catch (err) {
    console.error("Error fetching following list:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.get('/api/user/profile-picture', isAuthenticated, async (req, res) => {
  const userId = req.session.userId;

  try {
    const result = await pool.query(
      `SELECT profile_picture FROM users WHERE user_id = $1`,
      [userId]
    );

    // Since we're expecting only one user, we don't need map
    const user = result.rows[0];

    if (user && user.profile_picture) {
      res.status(200).json({ profile_picture: user.profile_picture });
    } else {
      res.status(200).json({ profile_picture: default_addr });
    }
  } catch (err) {
    console.error("Error fetching profile picture:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.post(
  "/api/user/upload-profile-picture",
  isAuthenticated,
  upload.single("image"),
  (req, res) => {
    const userId = req.session.userId;

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    cloudinary.uploader
      .upload_stream({ folder: "profile_pictures" }, async (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ message: "Failed to upload image" });
        }

        try {
          // Update user record with profile picture URL
          await pool.query(
            "UPDATE Users SET profile_picture = $1 WHERE user_id = $2",
            [result.secure_url, userId]
          );

          res.status(200).json({
            message: "Profile picture uploaded successfully",
            imageUrl: result.secure_url,
          });
        } catch (dbError) {
          console.error("Database error:", dbError);
          res.status(500).json({ message: "Failed to update profile picture in database" });
        }
      }).end(req.file.buffer);
  }
);

app.get('/api/user/:username/stats', async (req, res) => {
  const { username } = req.params;
  try {
    // Get user ID from username
    const userResult = await pool.query(`SELECT user_id FROM Users WHERE username = $1`, [username]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    const userId = userResult.rows[0].user_id;

    // Fetch the stats using the user ID
    const [followersResult, followingResult, itemsRatedResult, reviewsGivenResult] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM Friends WHERE user_id_2 = $1 AND status = 'Pending'`, [userId]),
      pool.query(`SELECT COUNT(*) FROM Friends WHERE user_id_1 = $1 AND status = 'Pending'`, [userId]),
      pool.query(`SELECT COUNT(*) FROM UserRatings WHERE user_id = $1`, [userId]),
      pool.query(`SELECT COUNT(*) FROM UserReviews WHERE user_id = $1`, [userId]),
    ]);

    res.status(200).json({
      followers: parseInt(followersResult.rows[0].count),
      following: parseInt(followingResult.rows[0].count),
      itemsRated: parseInt(itemsRatedResult.rows[0].count),
      reviewsGiven: parseInt(reviewsGivenResult.rows[0].count),
    });
  } catch (err) {
    console.error("Error fetching user stats:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.get('/api/user/:username/followers', async (req, res) => {
  const { username } = req.params;

  try {
    const userId = await getUserIdFromUsername(username);
    if (!userId) return res.status(404).json({ message: "User not found." });

    const result = await pool.query(
      `SELECT u.username, u.profile_picture
       FROM Friends f
       JOIN Users u ON f.user_id_1 = u.user_id
       WHERE f.user_id_2 = $1 AND f.status = 'Pending'`,
      [userId]
    );

    const followers = result.rows.map(row => ({
      username: row.username,
      profile_picture: row.profile_picture || default_addr
    }));

    res.status(200).json({ followers });
  } catch (err) {
    console.error("Error fetching followers list:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.get('/api/user/:username/following', async (req, res) => {
  const { username } = req.params;

  try {
    const userId = await getUserIdFromUsername(username);
    if (!userId) return res.status(404).json({ message: "User not found." });

    const result = await pool.query(
      `SELECT u.username, u.profile_picture
       FROM Friends f
       JOIN Users u ON f.user_id_2 = u.user_id
       WHERE f.user_id_1 = $1 AND f.status = 'Pending'`,
      [userId]
    );

    const following = result.rows.map(row => ({
      username: row.username,
      profile_picture: row.profile_picture || default_addr
    }));

    res.status(200).json({ following });
  } catch (err) {
    console.error("Error fetching following list:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.get('/api/user/:username/profile-picture', async (req, res) => {
  const { username } = req.params;

  try {
    const result = await pool.query(
      `SELECT profile_picture FROM Users WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (user && user.profile_picture) {
      res.status(200).json({ profile_picture: user.profile_picture });
    } else {
      res.status(200).json({ profile_picture: default_addr });
    }
  } catch (err) {
    console.error("Error fetching profile picture:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.get("/list-notifications", isAuthenticated, async (req, res) => {
  const userId = req.session.userId;
  // console.log("Fetching notifications for user:", userId);

  try {
    const query = `
      SELECT n.*, u.username AS sender_username
      FROM notifications n
      LEFT JOIN users u ON n.sender_id = u.user_id
      WHERE n.user_id = $1
      ORDER BY n.created_at DESC
    `;
    const values = [userId];
    const result = await pool.query(query, values);

    res.status(200).json({
      message: "Notifications fetched successfully",
      result: result.rows,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error listing notifications" });
  }
});

app.post('/friend-request', isAuthenticated, async (req, res) => {
  const { senderId, action } = req.body;  // action can be 'accept' or 'reject'
  const userId = req.session.userId;

  // Check if action is valid
  if (action !== 'accept' && action !== 'reject') {
    return res.status(400).json({ message: 'Invalid action.' });
  }

  // Check if senderId is provided
  if (!senderId) {
    return res.status(400).json({ message: 'Sender ID is required.' });
  }

  try {
    // Query to check if a friend request exists between the users
    // console.log("check1", senderId,userId);
    const checkRequestQuery = `
      SELECT * FROM Friends
      WHERE user_id_1 = $1 AND user_id_2 = $2 AND status = 'Pending'
    `;
    const result = await pool.query(checkRequestQuery, [senderId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No pending friend request found.' });
    }

    if (action === 'accept') {
      // Accept the original friend request
      await pool.query(
        'UPDATE Friends SET status = $1 WHERE user_id_1 = $2 AND user_id_2 = $3',
        ['Accepted', senderId, userId]
      );
    
      // Check if reverse relationship exists
      const reverseCheck = await pool.query(
        'SELECT * FROM Friends WHERE user_id_1 = $1 AND user_id_2 = $2',
        [userId, senderId]
      );
    
      if (reverseCheck.rows.length === 0) {
        // Insert reverse entry if it doesn't exist
        await pool.query(
          'INSERT INTO Friends (user_id_1, user_id_2, status) VALUES ($1, $2, $3)',
          [userId, senderId, 'Accepted']
        );
      } else {
        // Update reverse entry to 'Accepted' if it exists
        await pool.query(
          'UPDATE Friends SET status = $1 WHERE user_id_1 = $2 AND user_id_2 = $3',
          ['Accepted', userId, senderId]
        );
      }
      res.status(200).json({ message: 'Friend request accepted successfully!' });
    }
    

      // Optionally, you can add the users to the friends list as well
      // await pool.query(
      //   'INSERT INTO Friends (user_id1, user_id2) VALUES ($1, $2), ($2, $1)',
      //   [senderId, userId]
      // );

     else if (action === 'reject') {
      // Update the status of the friend request to rejected
      await pool.query(
        'UPDATE FriendRequests SET status = $1 WHERE sender_id = $2 AND receiver_id = $3',
        ['rejected', senderId, userId]
      );

      res.status(200).json({ message: 'Friend request rejected successfully!' });
    }
  } catch (error) {
    console.error('Error processing friend request:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


app.post('/delete-notification', isAuthenticated, async (req, res) => {
  const { notificationId } = req.body;
  const userId = req.session.userId;
  // console.log("hii",notificationId);
  if (!notificationId) {
    return res.status(400).json({ message: 'Notification ID is required.' });
  }

  try {
    const result = await pool.query(
      'DELETE FROM Notifications WHERE id = $1 AND user_id = $2 RETURNING *',
      [notificationId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Notification not found or unauthorized action.' });
    }

    res.status(200).json({ message: 'Notification deleted successfully!' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.post('/clear-all-notifications', isAuthenticated, async (req, res) => {
  const userId = req.session.userId;

  try {
    const result = await pool.query(
      'DELETE FROM Notifications WHERE user_id = $1 RETURNING *',
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'No notifications found to clear.' });
    }

    res.status(200).json({ message: 'All notifications cleared successfully!' });
  } catch (error) {
    console.error('Error clearing notifications:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.post('/suggest', isAuthenticated, async (req, res) => {
  const userId = req.session.userId;
  const { itemId, category, friend, title } = req.body;

  try{
    const name = await pool.query(`SELECT username FROM Users WHERE user_id = $1`,[userId]);
    const username = name.rows[0].username;
    const result = await pool.query(`SELECT * FROM Suggestions WHERE user_id = $1 AND item_id = $2 AND item_title = $3 AND category = $4`, [friend.user_id, itemId, title, category]);
    if(result.rows.length === 0){
      const result = await pool.query(`INSERT INTO Notifications (user_id, sender_id, type, item_type, item_id, message)
        VALUES ($1, $2, $3, $4, $5, $6)`, [friend.user_id, userId, 'suggestion', category, itemId, `${username} has suggested you ${title} ${category}`]);
      const result1 = await pool.query(`INSERT INTO Suggestions (user_id, item_id, item_title, category)
        VALUES ($1, $2, $3, $4)`, [friend.user_id, itemId, title, category]);
      res.status(200).json({ message: 'Suggested Successfully!' });
    }
    else{
      res.status(200).json({ message: 'Already Suggested' });
    }
  } catch(error){
    console.error('Error sending suggestion:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.get("/list-recommendations", isAuthenticated, async (req, res) => {
  const userId = req.session.userId;

  try {
    const followedUsersRes = await pool.query(
      `SELECT u.user_id, u.username, u.profile_picture
       FROM Friends f
       JOIN Users u ON f.user_id_2 = u.user_id
       WHERE f.user_id_1 = $1 AND f.status IN ('Pending', 'Accepted')`,
      [userId]
    );

    const recommendations = {};

    for (const followed of followedUsersRes.rows) {
      const followedId = followed.user_id;
      const followedUsername = followed.username;
      const profilePicture = followed.profile_picture || default_addr;

      const followedRatingsRes = await pool.query(
        `SELECT item_id, category
         FROM UserRatings
         WHERE user_id = $1 AND rating >= 3`,
        [followedId]
      );

      const followedItems = followedRatingsRes.rows;

      if (followedItems.length === 0) continue;

      const commonItemsRes = await pool.query(
        `SELECT item_id, category
         FROM UserRatings
         WHERE user_id = $1 AND rating >= 3
         AND (item_id, category) IN (${followedItems.map((_, i) => `($${i * 2 + 2}, $${i * 2 + 3})`).join(', ')})`,
        [userId, ...followedItems.flatMap(({ item_id, category }) => [item_id, category])]
      );

      if (commonItemsRes.rows.length === 0) continue;

      const recommendedItemsRes = await pool.query(
        `SELECT i.*
         FROM UserRatings r
         JOIN Items i ON i.item_id = r.item_id AND i.category = r.category
         WHERE r.user_id = $1 AND r.rating >= 3`,
        [followedId]
      );

      recommendations[followedId] = {
        username: followedUsername,
        profile_picture: profilePicture,
        items: recommendedItemsRes.rows
      };
    }

    res.json({ recommendations });
  } catch (err) {
    console.error("Error fetching recommendations:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/api/user/list-recommendations/:username', isAuthenticated, async (req, res) => {
  const userId = req.session.userId;
  const {username} = req.params;
  console.log("3",username);
  try {
    // Step 1: Get users followed by current user (user_id_1 = current user)
    const followedUsersRes = await pool.query(
      `SELECT u.user_id, u.username
       FROM Friends f
       JOIN Users u ON f.user_id_2 = u.user_id
       WHERE f.user_id_1 = $1 AND f.status IN ('Pending', 'Accepted')`,
      [userId]
    );

    const recommendations = {};

    for (const followed of followedUsersRes.rows) {
      const followedId = followed.user_id;
      const followedUsername = followed.username;

      // Step 2: Get items rated >= 3 by followed user
      const followedRatingsRes = await pool.query(
        `SELECT item_id, category
         FROM UserRatings
         WHERE user_id = $1 AND rating >= 3`,
        [followedId]
      );

      const followedItems = followedRatingsRes.rows;

      if (followedItems.length === 0) continue;

      // Step 3: Filter to items both users rated >= 3
      const commonItemsRes = await pool.query(
        `SELECT item_id, category
         FROM UserRatings
         WHERE user_id = $1 AND rating >= 3
         AND (item_id, category) IN (${followedItems.map((_, i) => `($${i * 2 + 2}, $${i * 2 + 3})`).join(', ')})`,
        [userId, ...followedItems.flatMap(({ item_id, category }) => [item_id, category])]
      );

      if (commonItemsRes.rows.length === 0) continue;

      // Step 4: Recommend followed user's liked items
      const recommendedItemsRes = await pool.query(
        `SELECT i.*
         FROM UserRatings r
         JOIN Items i ON i.item_id = r.item_id AND i.category = r.category
         WHERE r.user_id = $1 AND r.rating >= 3`,
        [followedId]
      );

      recommendations[followedUsername] = recommendedItemsRes.rows;
    }
    const result = recommendations[username];
    res.json({ result });
  } catch (err) {
    console.error("Error fetching recommendations:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/list-ratings", isAuthenticated, async (req, res) => {
  const userId = req.session.userId;

  try {
    const result = await pool.query(
      `SELECT ur.item_id, i.title, ur.rating, ur.rated_at, i.image_url,i.category
       FROM UserRatings ur
       JOIN Items i ON ur.item_id = i.item_id AND ur.category = i.category
       WHERE ur.user_id = $1`,
      [userId]
    );

    res.status(200).json({ ratings: result.rows });
  } catch (err) {
    console.error("Error fetching movie ratings:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.get("/list-reviews1", isAuthenticated, async (req, res) => {
  const userId = req.session.userId;

  try {
    const result = await pool.query(
      `SELECT 
         ur.review_id,
         ur.review_text,
         ur.reviewed_at,
         i.item_id,
         i.title,
         i.category,
         i.image_url
       FROM UserReviews ur
       JOIN Items i 
         ON ur.item_id = i.item_id AND ur.category = i.category
       WHERE ur.user_id = $1
       ORDER BY ur.reviewed_at DESC`,
      [userId]
    );

    res.json({ reviews: result.rows });
  } catch (err) {
    console.error("Error fetching user reviews:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/list-watched", isAuthenticated, async (req, res) => {
  const userId = req.session.userId;

  try {
    const result = await pool.query(
      `
      SELECT i.item_id, i.title, i.category, i.description, i.release_date, 
             i.author_creator, i.image_url, w.added_at
      FROM Watchlist w
      JOIN Items i ON w.item_id = i.item_id AND w.category = i.category
      WHERE w.user_id = $1 AND w.type = 'Already Done'
      ORDER BY w.added_at DESC;
      `,
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching watched list:", error);
    res.status(500).json({ error: "Failed to retrieve watched items." });
  }
});

app.get("/list-watchlist", isAuthenticated, async (req, res) => {
  const userId = req.session.userId;

  try {
    const result = await pool.query(
      `
      SELECT i.item_id, i.title, i.category, i.description, i.release_date, 
             i.author_creator, i.image_url, w.added_at
      FROM Watchlist w
      JOIN Items i ON w.item_id = i.item_id AND w.category = i.category
      WHERE w.user_id = $1 AND w.type = 'To be done'
      ORDER BY w.added_at DESC;
      `,
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching watched list:", error);
    res.status(500).json({ error: "Failed to retrieve watched items." });
  }
});

app.get('/list-genre-items/:genreId', isAuthenticated, async (req, res) => {
  const userId = req.session.userId;
  const {genreId} = req.params;

  if (isNaN(genreId)) {
    return res.status(400).json({ error: 'Invalid genre ID' });
  }

  try {
    const query = `
      SELECT i.item_id, i.title, i.category, i.description, i.release_date, 
             i.author_creator, i.image_url, g.name AS genre_name
      FROM Items i
      JOIN ItemGenres ig ON i.item_id = ig.item_id AND i.category = ig.category
      JOIN Genres g ON ig.genre_id = g.genre_id
      WHERE ig.genre_id = $1
    `;

    const { rows } = await pool.query(query, [genreId]);

    return res.status(200).json({ items: rows });
  } catch (err) {
    console.error('Error fetching genre items:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


////////////////////////////////////////////////////
// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});