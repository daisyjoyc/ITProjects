import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('chatApp.db');

export const createTables = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      username TEXT UNIQUE, 
      password TEXT,
      profile_pic TEXT DEFAULT 'maria'
    );
  `);
  
  db.execSync(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      sender TEXT, 
      receiver TEXT, 
      message TEXT, 
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

// NEW FUNCTION: Add profile_pic column to existing database
export const addProfilePicColumn = () => {
  try {
    db.execSync(`ALTER TABLE users ADD COLUMN profile_pic TEXT DEFAULT 'maria';`);
    console.log('Profile pic column added successfully!');
    return { success: true };
  } catch (error) {
    console.log('Column might already exist or error:', error.message);
    return { success: false };
  }
};

export const insertUser = (username, password) => {
  try {
    db.runSync('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
    return { success: true };
  } catch (error) {
    console.error('Error inserting user:', error);
    return { success: false, error: error.message };
  }
};

export const getAllUsers = () => {
  try {
    return db.getAllSync('SELECT * FROM users');
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

export const getUserByUsername = (username) => {
  try {
    return db.getFirstSync('SELECT * FROM users WHERE username = ?', [username]);
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

// Get user with profile picture
export const getUserWithProfilePic = (username) => {
  try {
    return db.getFirstSync(
      'SELECT username, profile_pic FROM users WHERE username = ?',
      [username]
    );
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Update profile picture
export const updateUserProfilePic = (username, profilePic) => {
  try {
    db.runSync(
      'UPDATE users SET profile_pic = ? WHERE username = ?',
      [profilePic, username]
    );
    return { success: true };
  } catch (error) {
    console.error('Error updating profile pic:', error);
    return { success: false, error: error.message };
  }
};

export const checkLogin = (username, password) => {
  try {
    const user = db.getFirstSync(
      'SELECT * FROM users WHERE username = ? AND password = ?', 
      [username, password]
    );
    return user !== null;
  } catch (error) {
    console.error('Error checking login:', error);
    return false;
  }
};

export const deleteUser = (username) => {
  try {
    db.runSync('DELETE FROM users WHERE username = ?', [username]);
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error: error.message };
  }
};

export const updateUserPassword = (username, newPassword) => {
  try {
    db.runSync('UPDATE users SET password = ? WHERE username = ?', [newPassword, username]);
    return { success: true };
  } catch (error) {
    console.error('Error updating password:', error);
    return { success: false, error: error.message };
  }
};

export const insertMessage = (sender, receiver, message) => {
  try {
    db.runSync(
      'INSERT INTO messages (sender, receiver, message) VALUES (?, ?, ?)', 
      [sender, receiver, message]
    );
    return { success: true };
  } catch (error) {
    console.error('Error inserting message:', error);
    return { success: false, error: error.message };
  }
};

export const getAllMessages = () => {
  try {
    return db.getAllSync('SELECT * FROM messages ORDER BY timestamp DESC');
  } catch (error) {
    console.error('Error getting messages:', error);
    return [];
  }
};

export const getMessagesBetweenUsers = (user1, user2) => {
  try {
    return db.getAllSync(
      `SELECT * FROM messages 
       WHERE (sender = ? AND receiver = ?) 
       OR (sender = ? AND receiver = ?)
       ORDER BY timestamp ASC`,
      [user1, user2, user2, user1]
    );
  } catch (error) {
    console.error('Error getting messages between users:', error);
    return [];
  }
};

export const getMessagesBySender = (sender) => {
  try {
    return db.getAllSync(
      'SELECT * FROM messages WHERE sender = ? ORDER BY timestamp DESC', 
      [sender]
    );
  } catch (error) {
    console.error('Error getting messages by sender:', error);
    return [];
  }
};

export const getMessagesByReceiver = (receiver) => {
  try {
    return db.getAllSync(
      'SELECT * FROM messages WHERE receiver = ? ORDER BY timestamp DESC', 
      [receiver]
    );
  } catch (error) {
    console.error('Error getting messages by receiver:', error);
    return [];
  }
};

export const getConversations = (username) => {
  try {
    return db.getAllSync(
      `SELECT DISTINCT 
        CASE 
          WHEN sender = ? THEN receiver 
          ELSE sender 
        END as contact,
        MAX(timestamp) as last_message_time
       FROM messages 
       WHERE sender = ? OR receiver = ?
       GROUP BY contact
       ORDER BY last_message_time DESC`,
      [username, username, username]
    );
  } catch (error) {
    console.error('Error getting conversations:', error);
    return [];
  }
};

export const deleteMessage = (messageId) => {
  try {
    db.runSync('DELETE FROM messages WHERE id = ?', [messageId]);
    return { success: true };
  } catch (error) {
    console.error('Error deleting message:', error);
    return { success: false, error: error.message };
  }
};

export const deleteConversation = (user1, user2) => {
  try {
    db.runSync(
      `DELETE FROM messages 
       WHERE (sender = ? AND receiver = ?) 
       OR (sender = ? AND receiver = ?)`,
      [user1, user2, user2, user1]
    );
    return { success: true };
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return { success: false, error: error.message };
  }
};

export const clearAllData = () => {
  try {
    db.runSync('DELETE FROM users');
    db.runSync('DELETE FROM messages');
    return { success: true };
  } catch (error) {
    console.error('Error clearing data:', error);
    return { success: false, error: error.message };
  }
};

export const dropAllTables = () => {
  try {
    db.execSync('DROP TABLE IF EXISTS users');
    db.execSync('DROP TABLE IF EXISTS messages');
    return { success: true };
  } catch (error) {
    console.error('Error dropping tables:', error);
    return { success: false, error: error.message };
  }
};

export default db;