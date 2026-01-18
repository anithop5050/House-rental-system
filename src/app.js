const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");
const app = express();
require("./db/conn");
const User = require("./models/users");
const Admin = require("./models/admin");
const Ads = require("./models/ads");
const Complaints = require("./models/complaint");
const Requests = require("./models/request");

const debug = true;

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public")

app.use(function (req, res, next) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(static_path));
app.use('/drive/image', express.static(path.join(__dirname, '/img')));
//create a new user in our database
app.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    res.send({ "status": 200, "data": "User created Sus" })
    User.create(req.body);
  } catch (error) {
    res.status(400).send(error);
  }
});
app.post('/login/user', (req, res) => userLogin(req, res));
app.post('/login/admin', (req, res) => adminLogin(req, res));
app.post('/signup/user', (req, res) => userRegister(req, res));
app.post('/signup/admin', (req, res) => adminRegister(req, res));
app.post('/add/rental', fileUpload(), (req, res) => addRental(req, res));
app.get('/view/rental', (req, res) => viewRental(req, res));
app.get('/view/rentalbyid', (req, res) => viewRentalById(req, res));
app.get('/view/userrental', (req, res) => viewUserRental(req, res));
app.post('/delete/userrental', (req, res) => deleteUserRental(req, res));
app.post('/add/complaint', (req, res) => addComplaint(req, res));
app.get('/view/complaint', (req, res) => viewComplaint(req, res));
app.put('/update/complaint', (req, res) => updateComplaint(req, res));
app.post('/delete/complaint', (req, res) => deleteComplaint(req, res));
app.get('/view/usercomplaint', (req, res) => viewUserComplaint(req, res));
app.get('/list/users', (req, res) => listUsers(req, res));
app.post('/add/request', (req, res) => addRequest(req, res));
app.get('/view/userrequest', (req, res) => viewUserRequest(req, res));
app.get('/view/ownerrequest', (req, res) => viewUOwnerRequest(req, res));
app.post('/delete/request', (req, res) => deleteRequest(req, res));
app.post('/approve/request', (req, res) => approveRequest(req, res));
app.post('/revoke/request', (req, res) => revokeRequest(req, res));

// Temporary seed endpoint - visit /seed-database-secret-xyz123 to populate data
app.get('/seed-database-secret-xyz123', async (req, res) => {
  try {
    const locations = ["Kattakada", "Varkala", "Nedumangadu", "Neyyattinkara", "Thrivandram", "Kazhakkoottam"];
    const images = ["house1.jpg", "house2.jpg", "house3.jpg", "house4.jpg", "house5.jpg", "house6.jpg", "ekm1.jpg", "klm1.jpg", "khm3.jpg", "tvm3.jpg"];

    // Create dummy users
    const dummyUsers = [
      { name: "John Doe", email: "john@example.com", password: "password123", number: "9876543210" },
      { name: "Jane Smith", email: "jane@example.com", password: "password123", number: "9876543211" },
      { name: "Test User", email: "test@example.com", password: "password123", number: "9876543212" }
    ];

    const users = [];
    for (const u of dummyUsers) {
      let user = await User.findOne({ email: u.email });
      if (!user) {
        user = await User.create(u);
      }
      users.push(user);
    }

    // Create ads for each location
    const ads = [];
    for (const loc of locations) {
      for (let i = 0; i < 3; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomImage = images[Math.floor(Math.random() * images.length)];
        ads.push({
          title: `Beautiful ${i + 2}BHK in ${loc}`,
          description: `A lovely ${i + 2}BHK house in the heart of ${loc}. Close to amenities.`,
          location: loc,
          price: Math.floor(15000 + (Math.random() * 10000)),
          image: randomImage,
          user: randomUser._id.toString(),
          status: 1,
          bedrooms: i + 2,
          bathrooms: i + 1,
          floors: i + 1,
          squareFeet: 1200 + (i * 200)
        });
      }
    }

    await Ads.insertMany(ads);
    res.send(`<h1>Success!</h1><p>Added ${users.length} users and ${ads.length} rental ads!</p><p><a href="/search1.html">Go to Rentals</a></p>`);
  } catch (e) {
    res.send(`<h1>Error</h1><p>${e.message}</p>`);
  }
});
app.listen(port, () => {
  console.log(`server is now  running http://localhost:${port}`);
})
const userLogin = async (req, res) => {
  if (debug) console.log(req.body);
  var data = await User.findOne(req.body);
  data = data || 0;
  if (data != 0) {
    res.send({ "status": 200, "data": "valid user", "user": data })
  }
  else {
    res.send({ "status": 404, "data": "invalid user" })
  }
}
const adminLogin = async (req, res) => {
  if (debug) console.log("Login request body:", req.body);
  // Print all admins for debugging
  const allAdmins = await Admin.find({});
  console.log("All admins in DB:", allAdmins);
  var data = await Admin.findOne(req.body);
  console.log("Admin found:", data);
  data = data || 0;
  if (data != 0) {
    res.send({ "status": 200, "data": "valid admin", "user": data })
  }
  else {
    res.send({ "status": 404, "data": "invalid admin" })
  }
}
const userRegister = async (req, res) => {
  if (debug) console.log(req.body)
  try {
    if (await User.findOne({ "email": req.body.email })) return res.send({ "status": 404, "data": "User already exist" })
    User.create(req.body)
    return res.send({ "status": 200, "data": "User created Sus" })
  } catch (error) {
    console.log(error)
    return res.send({ "status": 404, "data": "Failed to register" })
  }
}
const adminRegister = async (req, res) => {
  if (debug) console.log(req.body)
  try {
    if (req.body.adminpass != 'hahaha') return res.send({ "status": 404, "data": "Not Autherised" })
    if (!req.body.email) return res.send({ "status": 404, "data": "Provide email" })
    if (!req.body.name) return res.send({ "status": 404, "data": "Provide name" })
    if (!req.body.password) return res.send({ "status": 404, "data": "Provide password" })
    if (await Admin.findOne({ "email": req.body.email })) return res.send({ "status": 404, "data": "User already exist" })
    Admin.create(req.body)
    return res.send({ "status": 200, "data": "admin created Sus" })
  } catch (error) {
    console.log(error)
    return res.send({ "status": 404, "data": "Failed to register" })
  }
}
const addRental = async (req, res) => {
  if (debug) console.log(req.body);
  if (debug) console.log(req.files);
  const image = req.files.pic;
  new Ads(req.body).save();
  image.mv(`./src/img/${image.name}`, (err) => {
    if (err) return console.log(err), res.send({ "status": 404, "data": "Failed to add rental", "error": err.message });
    else {
      res.send({ "status": 200, "data": "Rental added Sus" });
    }
  })
}
const viewRental = async (req, res) => {
  const data = await Ads.find({ "status": 1 });
  res.status(200).send({ "status": 200, "data": data });
}
const viewRentalById = async (req, res) => {
  if (debug) console.log(req.query);
  if (!req.query.id) return res.status(200).send({ "status": 403, "data": null, "message": "ad id not provided" });
  const data = await Ads.findOne({ "_id": req.query.id }).catch((e) => { return console.log(e.message), res.status(200).send({ "status": 403, "data": null, "message": "Ad not found" }) })
  if (!data) res.status(200).send({ "status": 403, "data": null, "message": "Ad not found" });
  else res.status(200).send({ "status": 200, "data": data, "message": "found" });
}
const viewUserRental = async (req, res) => {
  if (debug) console.log(req.query);
  const data = await Ads.find({ "user": req.query.id });
  res.status(200).send({ "status": 200, "data": data });
}
const deleteUserRental = async (req, res) => {
  if (debug) console.log(req.body);
  const data = await Ads.findOneAndDelete({ "_id": req.body.id })
  res.status(200).send({ "status": 200, "data": data });
}
const addComplaint = async (req, res) => {
  if (debug) console.log(req.body);
  new Complaints(req.body).save();
  res.send({ "status": 200, "data": "Complaint added" });
}
const viewComplaint = async (req, res) => {
  const data = await Complaints.find({});
  res.status(200).send({ "status": 200, "data": data });
}
const viewUserComplaint = async (req, res) => {
  if (debug) console.log(req.query);
  const data = await Complaints.find({ "user": req.query.id });
  res.status(200).send({ "status": 200, "data": data });
}
const updateComplaint = async (req, res) => {
  const id = req.query.id;
  const body = req.body;
  if (debug) console.log(id, body)
  if (!id) return res.json({ "status": 403, "data": "Provide id" });
  if (!body) return res.json({ "status": 403, "data": "Provide body" });
  const data = await Complaints.findOneAndUpdate({ "_id": id }, body);
  res.status(200).send({ "status": 200, "data": data });
}
const deleteComplaint = async (req, res) => {
  const id = req.query.id;
  if (debug) console.log(id)
  if (!id) return res.json({ "status": 403, "data": "Provide id" });
  const data = await Complaints.findOneAndDelete({ "_id": id });
  res.status(200).send({ "status": 200, "data": data });
}
const listUsers = async (req, res) => {
  const data = await User.find({});
  res.status(200).send({ "status": 200, "data": data });
}
const addRequest = async (req, res) => {
  const body = req.body;
  if (debug) console.log(body);
  const HouseId = body.HouseId;
  const OwnerId = body.HouseOwner;
  const Requester = body.Requester;
  if (OwnerId == Requester) return res.status(200).send({ "status": 403, "data": "You cant request your houses" });
  if (! await Ads.findOne({ "_id": HouseId })) return res.status(200).send({ "status": 403, "data": "House not found" });
  if (! await User.findOne({ "_id": OwnerId })) return res.status(200).send({ "status": 403, "data": "Owner not found" });
  if (! await User.findOne({ "_id": Requester })) return res.status(200).send({ "status": 403, "data": "Requester not found" });
  const data = await Requests.create(body);
  res.status(200).send({ "status": 200, "data": data });
}
const viewUserRequest = async (req, res) => {
  if (debug) console.log(req.query);
  const data = await Requests.find({ "Requester": req.query.id });
  const Houses = await Ads.find({});
  const Users = await User.find({});
  const AllUserRequest = [];
  for (let i = 0; i < data.length; i++) {
    const House = Houses.find(x => x._id == data[i].HouseId);
    const Owner = Users.find(x => x._id == data[i].HouseOwner);
    const Requester = Users.find(x => x._id == data[i].Requester);
    const OwnerFixed = { "name": Owner?.name, "email": Owner?.email, "number": Owner?.number };
    const RequesterFixed = { "name": Requester?.name, "email": Requester?.email, "number": Requester?.number };
    const HouseFixed = { "title": House?.title, "description": House?.description, "price": House?.price, "location": House?.location, "image": House?.image, "squareFeet": House?.squareFeet, "floors": House?.floors, "bedrooms": House?.bedrooms, "bathrooms": House?.bathrooms };
    const RequestFixed = { "JobStatus": data[i].JobStatus, "LifeStatus": data[i].LifeStatus, "Members": data[i].Members, "CarParking": data[i].CarParking, "Status": data[i].Status }
    AllUserRequest.push({
      "Id": data[i]._id,
      "House": HouseFixed,
      "Owner": OwnerFixed,
      "Requester": RequesterFixed,
      "Request": RequestFixed
    })
  }
  res.status(200).send({ "status": 200, "data": AllUserRequest });
}
const viewUOwnerRequest = async (req, res) => {
  if (debug) console.log(req.query);
  const data = await Requests.find({ "HouseOwner": req.query.id });
  const Houses = await Ads.find({});
  const Users = await User.find({});
  const AllUserRequest = [];
  for (let i = 0; i < data.length; i++) {
    const House = Houses.find(x => x._id == data[i].HouseId);
    const Owner = Users.find(x => x._id == data[i].HouseOwner);
    const Requester = Users.find(x => x._id == data[i].Requester);
    const OwnerFixed = { "name": Owner?.name, "email": Owner?.email, "number": Owner?.number };
    const RequesterFixed = { "name": Requester?.name, "email": Requester?.email, "number": Requester?.number, "id": Requester?._id };
    const HouseFixed = { "title": House?.title, "description": House?.description, "price": House?.price, "location": House?.location, "image": House?.image, "squareFeet": House?.squareFeet, "floors": House?.floors, "bedrooms": House?.bedrooms, "bathrooms": House?.bathrooms };
    const RequestFixed = { "JobStatus": data[i].JobStatus, "LifeStatus": data[i].LifeStatus, "Members": data[i].Members, "CarParking": data[i].CarParking, "Status": data[i].Status }
    AllUserRequest.push({
      "Id": data[i]._id,
      "House": HouseFixed,
      "Owner": OwnerFixed,
      "Requester": RequesterFixed,
      "Request": RequestFixed
    })
  }
  res.status(200).send({ "status": 200, "data": AllUserRequest });
}
const deleteRequest = async (req, res) => {
  const id = req.query.id;
  if (debug) console.log(id)
  if (!id) return res.json({ "status": 403, "data": "Provide id" });
  const data = await Requests.findOneAndDelete({ "_id": id });
  res.status(200).send({ "status": 200, "data": data });
}
const approveRequest = async (req, res) => {
  const id = req.query.id;
  const user = req.body.user;
  if (debug) console.log(id, user);
  if (!id) return res.json({ "status": 403, "data": "Provide id" });
  if (!user) return res.json({ "status": 403, "data": "Provide user" });
  const data = await Requests.findOneAndUpdate({ "_id": id }, { "$set": { "Status": "Approved" } });
  const data2 = await Ads.findByIdAndUpdate({ "_id": data.HouseId }, { "$set": { "status": 2, "tenant": user } });
  res.status(200).send({ "status": 200, "data": data });
}
const revokeRequest = async (req, res) => {
  const id = req.query.id;
  if (debug) console.log(id);
  if (!id) return res.json({ "status": 403, "data": "Provide id" });
  const data = await Requests.findOneAndUpdate({ "_id": id }, { "$set": { "Status": "Pending" } });
  const data2 = await Ads.findByIdAndUpdate({ "_id": data.HouseId }, { "$set": { "status": 1, "tenant": null } });
  res.status(200).send({ "status": 200, "data": data });
}