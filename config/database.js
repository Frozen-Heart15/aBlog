require('dotenv').config();

module.exports = {
    database: "mongodb+srv://gaurav:gaurav123@cluster0-7xgrq.mongodb.net/articleDB",
    secret:process.env.SECRET
}