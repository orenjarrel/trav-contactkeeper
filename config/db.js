const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {

  try {
    await mongoose.connect(db, {
      useNewUrlParse: true,
      useCreateIndex: true,
      useFidAndModify: false
    });

    console.log('MongoDB Connected...')
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  // ---- this is the NON-async way of doing it 
  // mongoose.connect(db, {
  //   useNewUrlParse: true,
  //   useCreateIndex: true,
  //   useFidAndModify: false
  // })
  //   .then(() => console.log('MongoDB Connected'))
  //   .catch(err => {
  //     console.error(err.message);
  //     process.exit(1);
  //   })

};


module.exports = connectDB;