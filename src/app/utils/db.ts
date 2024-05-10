const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'facebook'
});

connection.connect((error: Error) => {
  if (error) {
    console.error('Error connecting to database: ' + error.stack);
    return;
  }
  console.log('Connected to database as ID ' + connection.threadId);
});

export default connection;