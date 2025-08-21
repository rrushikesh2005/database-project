DROP TABLE IF EXISTS ItemGenres, Watchlist, Suggestions, Recommendations, Friends, Items, Genres, Users, UserRatings, UserReviews, Notifications CASCADE;

-- Users Table
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Genres Table
CREATE TABLE Genres (
    genre_id INT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- Items Table
CREATE TABLE Items (
    item_id INT,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) CHECK (category IN ('Movie', 'TV Show', 'Book')),
    description TEXT,
    release_date DATE,
    author_creator VARCHAR(255),
    image_url VARCHAR(255),    -- For image path/URL
    PRIMARY KEY (item_id, category)
);


-- Reviews Table
CREATE TABLE UserRatings (
    user_id INT,
    item_id INT,
    category VARCHAR(50) CHECK (category IN ('Movie', 'TV Show', 'Book')),
    rating INT CHECK (rating BETWEEN 1 AND 5),
    rated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, item_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id, category) REFERENCES Items(item_id, category) ON DELETE CASCADE
);


CREATE TABLE UserReviews (
    review_id SERIAL PRIMARY KEY,
    user_id INT,
    item_id INT,
    category VARCHAR(50) CHECK (category IN ('Movie', 'TV Show', 'Book')),
    review_text TEXT,
    reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id, category) REFERENCES Items(item_id, category) ON DELETE CASCADE
);


-- ItemGenres Table
CREATE TABLE ItemGenres (
    item_id INT,
    genre_id INT,
    category TEXT CHECK (category IN ('Movie', 'TV Show', 'Book')),
    PRIMARY KEY (item_id, genre_id, category),
    FOREIGN KEY (item_id, category) REFERENCES Items(item_id, category) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES Genres(genre_id) ON DELETE CASCADE
);

-- Watchlist Table
CREATE TABLE Watchlist (
    user_id INT,
    item_id INT,
    category VARCHAR(50) CHECK (category IN ('Movie', 'TV Show', 'Book')),
    type VARCHAR(50) CHECK (type IN ('To be done', 'Doing', 'Already Done')),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, item_id, category, type),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id, category) REFERENCES Items(item_id, category) ON DELETE CASCADE
);

-- Friends Table
CREATE TABLE Friends (
    user_id_1 INT,
    user_id_2 INT,
    status VARCHAR(20) CHECK (status IN ('Pending', 'Accepted', 'Blocked')) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id_1, user_id_2),
    FOREIGN KEY (user_id_1) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id_2) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Suggestions Table
CREATE TABLE Suggestions (
    suggestion_id SERIAL PRIMARY KEY,
    user_id INT,
    item_id INT,
    item_title VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE SET NULL
);

-- Recommendations Table
CREATE TABLE Recommendations (
    recommendation_id SERIAL PRIMARY KEY,
    user_id INT,
    category VARCHAR(50) CHECK (category IN ('Movie', 'TV Show', 'Book')),
    recommended_item_id INT,
    reason TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (recommended_item_id, category) REFERENCES Items(item_id, category) ON DELETE CASCADE
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    sender_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('follow_request', 'friend_request', 'suggestion')),
    item_type VARCHAR(50), 
    item_id INTEGER,
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected','seen')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
