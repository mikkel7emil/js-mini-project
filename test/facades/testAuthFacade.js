const mongoose = require("mongoose");
const expect = require("chai").expect;
const dbSetup = require("../../dbSetup");
const settings = require("../../settings")

//https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};
mongoose.connection = {};

var locationBlogFacade = require("../../facades/blogFacade");
var LocationBlog = require("../../models/LocationBlog");
var userFacade = require("../../facades/userFacade");
var authFacade = require("../../facades/authFacade");
var User = require("../../models/User");

let connection = null;
describe("Testing the authFacade", function () {

  /**
   * Connect to the TEST-DATABASE 
   */
  before(async function () {
    this.timeout(settings.MOCHA_TEST_TIMEOUT);
    await dbSetup(settings.TEST_DB_URI);
  })

  after(function () {
    mongoose.connection.close();
  })
  

  var users = [];
  var blogs = [];
  /**
   *  Setup the database in a known state (2 locBlogs + 2 users) before EACH test 
   */
  beforeEach(async function () {
    await User.deleteMany({}).exec();
    users = await Promise.all([
      new User({ firstName: "Kurt", lastName: "Wonnegut", userName: "kw", password: "test", email: "a@b.dk" }).save(),
      new User({ firstName: "Hanne", lastName: "Wonnegut", userName: "hw", password: "test", email: "b@b.dk" }).save(),
    ])

    await LocationBlog.deleteMany({}).exec()
    blogs = await Promise.all([
        new LocationBlog({ info: 'Crazy place', pos: { longitude: 26, latitude: 28 }, author: users[0]._id }).save(),
        new LocationBlog({ info: 'Another crazy place', pos: { longitude: 56, latitude: 65 }, author: users[0]._id }).save()
    ])
  })

  it("login (2 args): should be a succesfull attempt", async function () {
    const user = await authFacade.login('kw', 'test');
    expect(user.lastName).to.be.equal('Wonnegut');
  });

  it("login (2 args): should be a falied attempt", async function () {
    try {
        user = await authFacade.login('kw', 'tset')
    } catch(err) {
        expect(err.msg).to.be.equal('failed to authenticate from given username and/or password')
    }
  });



})