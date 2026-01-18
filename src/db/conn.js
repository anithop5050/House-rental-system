const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
    console.log(`database is connected`);
}).catch((e) => {
    console.log(e);
})
