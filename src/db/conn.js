const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URL || "mongodb://localhost:27017/", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log(`database is connected`);
}).catch((e) => {
  console.log(e);
})
