const {  mongoose } = require("mongoose");

exports.dbConnection = () => {
  try {
    mongoose.connect(process.env.DB).then(() => {
      console.log("DB Connected");
    });
  } catch (error) {
    console.log(error);
  }
};
