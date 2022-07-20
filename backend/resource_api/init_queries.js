const create_database = "CREATE DATABASE facebook_db;"

const users_table = 'CREATE TABLE IF NOT EXISTS users (\n' +
    '\tid VARCHAR(255) PRIMARY KEY,\n' +
    '\temail VARCHAR(255) UNIQUE NOT NULL,\n' +
    '\tnumber VARCHAR(255) UNIQUE NOT NULL,\n' +
    '\tpassword VARCHAR(255) NOT NULL\n' +
    ');'

const profiles_table = 'CREATE TABLE IF NOT EXISTS profiles (\n' +
    '\tid VARCHAR(255) PRIMARY KEY,\n' +
    '\tfirst_name VARCHAR(255) NOT NULL,\n' +
    '\tlast_name VARCHAR(255) NOT NULL,\n' +
    '\tbirthday DATE NOT NULL,\n' +
    '\tgender VARCHAR(255) NOT NULL,\n' +
    '\tcustom_gender VARCHAR(255),\n' +
    '\tpronoun VARCHAR(255) NOT NULL\n' +
    ');'

const posts_table = 'CREATE TABLE IF NOT EXISTS posts (\n' +
    '\tid VARCHAR(255) PRIMARY KEY,\n' +
    '\tprofile_id VARCHAR(255) REFERENCES profiles(id),\n' +
    '\tcontent TEXT,\n' +
    '\tdate TIMESTAMP NOT NULL\n' +
    ');'

const notifications_table = 'CREATE TABLE IF NOT EXISTS notifications (\n' +
    '\tid serial PRIMARY KEY,\n' +
    '\tsender_id VARCHAR(255) REFERENCES profiles(id),\n' +
    '\treceiver_id VARCHAR(255) REFERENCES profiles(id),\n' +
    '\ttype VARCHAR(255)\n' +
    ');'

const friendships_table = 'CREATE TABLE IF NOT EXISTS friendships (\n' +
    '\tid serial PRIMARY KEY,\n' +
    '\tsender_id VARCHAR(255) REFERENCES profiles(id),\n' +
    '\treceiver_id VARCHAR(255) REFERENCES profiles(id),\n' +
    '\tdate TIMESTAMP NOT NULL\n' +
    ');'

module.exports = {
    create_database,
    users_table,
    profiles_table,
    posts_table,
    notifications_table,
    friendships_table
}