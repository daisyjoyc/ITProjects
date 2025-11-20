import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('chatapp.db');

export const createTables = () => {
  try {
    db.execSync(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL, status TEXT DEFAULT 'offline', profile_pic TEXT, bio TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);`);
    db.execSync(`CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, sender TEXT NOT NULL, receiver TEXT NOT NULL, message TEXT NOT NULL, message_type TEXT DEFAULT 'text', reaction TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);`);
    db.execSync(`CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, image_uri TEXT NOT NULL, caption TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);`);
    db.execSync(`CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY AUTOINCREMENT, post_id INTEGER NOT NULL, username TEXT NOT NULL, comment TEXT NOT NULL, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE);`);
    db.execSync(`CREATE TABLE IF NOT EXISTS post_reactions (id INTEGER PRIMARY KEY AUTOINCREMENT, post_id INTEGER NOT NULL, username TEXT NOT NULL, reaction TEXT NOT NULL, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, UNIQUE(post_id, username), FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE);`);
    db.execSync(`CREATE TABLE IF NOT EXISTS stories (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, image_uri TEXT NOT NULL, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);`);
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

export const insertUser = (username, password) => {
  try {
    db.runSync('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const checkLogin = (username, password) => {
  try {
    const result = db.getFirstSync('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
    return result !== null;
  } catch (error) {
    return false;
  }
};

export const getAllUsers = () => {
  try {
    return db.getAllSync('SELECT * FROM users') || [];
  } catch (error) {
    return [];
  }
};

export const deleteUser = (username) => {
  try {
    db.runSync('DELETE FROM users WHERE username = ?', [username]);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const updateUserStatus = (username, status) => {
  try {
    db.runSync('UPDATE users SET status = ? WHERE username = ?', [status, username]);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const updateUserProfilePic = (username, profilePic) => {
  try {
    db.runSync('UPDATE users SET profile_pic = ? WHERE username = ?', [profilePic, username]);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const updateUserBio = (username, bio) => {
  try {
    db.runSync('UPDATE users SET bio = ? WHERE username = ?', [bio, username]);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const getUserWithProfilePic = (username) => {
  try {
    return db.getFirstSync('SELECT * FROM users WHERE username = ?', [username]);
  } catch (error) {
    return null;
  }
};

export const insertMessage = (sender, receiver, message, messageType = 'text') => {
  try {
    db.runSync('INSERT INTO messages (sender, receiver, message, message_type) VALUES (?, ?, ?, ?)', [sender, receiver, message, messageType]);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const getMessagesBetweenUsers = (user1, user2) => {
  try {
    return db.getAllSync(`SELECT * FROM messages WHERE (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?) ORDER BY timestamp ASC`, [user1, user2, user2, user1]) || [];
  } catch (error) {
    return [];
  }
};

export const addMessageReaction = (messageId, reaction) => {
  try {
    db.runSync('UPDATE messages SET reaction = ? WHERE id = ?', [reaction, messageId]);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const deleteMessage = (messageId) => {
  try {
    db.runSync('DELETE FROM messages WHERE id = ?', [messageId]);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const createPost = (username, imageUri, caption = '') => {
  try {
    db.runSync('INSERT INTO posts (username, image_uri, caption) VALUES (?, ?, ?)', [username, imageUri, caption]);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const getAllPosts = () => {
  try {
    return db.getAllSync('SELECT * FROM posts ORDER BY timestamp DESC') || [];
  } catch (error) {
    return [];
  }
};

export const deletePost = (postId) => {
  try {
    db.runSync('DELETE FROM posts WHERE id = ?', [postId]);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const addComment = (postId, username, comment) => {
  try {
    db.runSync('INSERT INTO comments (post_id, username, comment) VALUES (?, ?, ?)', [postId, username, comment]);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const getCommentsByPostId = (postId) => {
  try {
    return db.getAllSync('SELECT * FROM comments WHERE post_id = ? ORDER BY timestamp ASC', [postId]) || [];
  } catch (error) {
    return [];
  }
};

export const deleteComment = (commentId) => {
  try {
    db.runSync('DELETE FROM comments WHERE id = ?', [commentId]);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const addPostReaction = (postId, username, reaction) => {
  try {
    db.runSync(`INSERT OR REPLACE INTO post_reactions (post_id, username, reaction) VALUES (?, ?, ?)`, [postId, username, reaction]);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const removePostReaction = (postId, username) => {
  try {
    db.runSync('DELETE FROM post_reactions WHERE post_id = ? AND username = ?', [postId, username]);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const getPostReactions = (postId) => {
  try {
    return db.getAllSync('SELECT * FROM post_reactions WHERE post_id = ?', [postId]) || [];
  } catch (error) {
    return [];
  }
};

export const getUserReactionForPost = (postId, username) => {
  try {
    return db.getFirstSync('SELECT * FROM post_reactions WHERE post_id = ? AND username = ?', [postId, username]);
  } catch (error) {
    return null;
  }
};

export const createStory = (username, imageUri) => {
  try {
    db.runSync('INSERT INTO stories (username, image_uri) VALUES (?, ?)', [username, imageUri]);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const getAllStories = () => {
  try {
    return db.getAllSync('SELECT * FROM stories ORDER BY timestamp DESC') || [];
  } catch (error) {
    return [];
  }
};

export const deleteOldStories = () => {
  try {
    db.runSync("DELETE FROM stories WHERE timestamp < datetime('now', '-1 day')");
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export default db;
