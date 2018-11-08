const mongoose = require("mongoose");
const expect = require("chai").expect;
const dbSetup = require("../../dbSetup");
const settings = require("../../settings")

/**
 *  https://github.com/Automattic/mongoose/issues/1251
 */
mongoose.models = {};
mongoose.modelSchemas = {};
mongoose.connection = {};

const positionFacade = require("../../facades/positionFacade");
const User = require("../../models/User");
const Position = require("../../models/Position");
const userFacade = require("../../facades/userFacade");


describe("Testing the LocationBlog Facade", function () {

  /**
   *Connect to the TEST-DATABASE 
   */
  before(async function () {
    this.timeout(settings.MOCHA_TEST_TIMEOUT);
    await dbSetup(settings.TEST_DB_URI);
  })

  after(function () {
    mongoose.connection.close();
  })
  

  let users = [];
  /**
   *  Setup the database in a known state (2 locBlogs + 2 users) before EACH test 
   */
  beforeEach(async function () {
    await User.deleteMany({}).exec();
    users = await Promise.all([
      new User({ firstName: "Kurt", lastName: "Wonnegut", userName: "kw", password: "test", email: "a@b.dk" }).save(),
      new User({ firstName: "Hanne", lastName: "Wonnegut", userName: "hw", password: "test", email: "b@b.dk" }).save(),
      new User({ firstName: "Mikkel", lastName: "Larsen", userName: "ml", password: "test", email: "b@b.dk" }).save(),
      new User({ firstName: "Jørgen", lastName: "Madsen", userName: "jm", password: "test", email: "b@b.dk" }).save(),
    ])

    await Position.deleteMany({}).exec()
    position = await Promise.all([
        new Position({ user: users[1]._id, location: { type: 'Point', coordinates: [12.5931, 55.6839] } }).save(),
        new Position({ user: users[0]._id, location: { type: 'Point', coordinates: [12.5828, 55.6842] } }).save(),
        new Position({ user: users[3]._id, location: { type: 'Point', coordinates: [12.5775, 55.6857] } }).save()
    ])
  })

  it("getAll: Should find all positions", async function () {
    const positions = await positionFacade.getAll();
    expect(positions.length).to.be.equal(3);
  });

  it("getByUsername: Should find the right positions from given usernames", async function () {
    let position = await positionFacade.getByUsername('kw');
    expect(position.location.coordinates[0]).to.be.equal(12.5828);
    position = await positionFacade.getByUsername('hw');
    expect(position.location.coordinates[0]).to.be.equal(12.5931);
  });

  it("updateOrCreate: Should update the position with new coordinates given user and coordinates", async function () {
    const user = await userFacade.findByUsername('kw')
    const longitude = -110.8571443
    const latitude = 32.4586858
    const position = await positionFacade.updateOrCreate(user._id, longitude, latitude)

    expect(position.location.coordinates[1]).to.be.equal(latitude);
    expect(position.location.coordinates[0]).to.be.equal(longitude);
  });

  it("updateOrCreate: Should create the position with new coordinates given user and coordinates", async function () {
    const user = await userFacade.findByUsername('ml')
    const longitude = -110.8571443
    const latitude = 32.4586858
    const position = await positionFacade.updateOrCreate(user._id, longitude, latitude)

    expect(position.location.coordinates[1]).to.be.equal(latitude);
    expect(position.location.coordinates[0]).to.be.equal(longitude);
  });

  it("findNeaby: Should should find two positions given the location and maxDistance", async function () {
    const longitude = 12.5880
    const latitude = 55.6843
    const maxInMeters = 400
    const positions = await positionFacade.findNearby(longitude, latitude, maxInMeters)
    expect(positions.length).to.be.equal(2);
  });

  it("findNeabyUsers: Should should find two positions given the location and maxDistance", async function () {
    const longitude = 12.5880
    const latitude = 55.6843
    const maxInMeters = 400
    const popuUsers = await positionFacade.findNearbyUsers(longitude, latitude, maxInMeters)
    console.log(popuUsers)
    // expect(positions.length).to.be.equal(2);
  });

   

})