const create_database = "CREATE DATABASE facebook_db;"

const users_table = 'CREATE TABLE IF NOT EXISTS users (\n' +
    '\tid serial PRIMARY KEY,\n' +
    '\tusername VARCHAR(255) UNIQUE NOT NULL,\n' +
    '\temail VARCHAR(255) UNIQUE NOT NULL,\n' +
    '\tnumber VARCHAR(255) UNIQUE NOT NULL,\n' +
    '\tpassword VARCHAR(255) NOT NULL\n' +
    ');'

const profiles_table = 'CREATE TABLE IF NOT EXISTS profiles (\n' +
    '\tid serial PRIMARY KEY,\n' +
    '\tfirst_name VARCHAR(255) NOT NULL,\n' +
    '\tlast_name VARCHAR(255) NOT NULL,\n' +
    '\tbirthday DATE NOT NULL,\n' +
    '\tgender VARCHAR(255) NOT NULL,\n' +
    '\tcustom_gender VARCHAR(255),\n' +
    '\tpronoun VARCHAR(255) NOT NULL\n' +
    ');'

const posts_table = 'CREATE TABLE IF NOT EXISTS posts (\n' +
    '\tid serial PRIMARY KEY,\n' +
    '\tprofile_id INTEGER REFERENCES profiles ,\n' +
    '\tcontent TEXT,\n' +
    '\tdate DATE NOT NULL\n' +
    ');'

module.exports = {
    create_database,
    users_table,
    profiles_table,
    posts_table
}