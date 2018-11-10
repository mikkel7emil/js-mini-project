const mongoose = require("mongoose");
const userFacade = require('./userFacade');
const positionFacade = require('./positionFacade');
const debug = require('debug')('miniproject:authFacade');
const bcrypt = require('bcrypt');

async function login(username, password, latitude, longitude, radius) {
    try {
        const user = await userFacade.findByUsername(username)
        const verified = (user && await bcrypt.compare(password, user.password))

        /**
         * if username and password is correct
         */
        if (verified) {
            posWithUsers = await positionFacade.findNearbyUsers(longitude, latitude, radius);

            /**
             * updating users position
             */
            await positionFacade.updateOrCreate(user._id, longitude, latitude)

            /**
             * formatting outpuut
             */
            return posWithUsers.map(ele => {
                return {
                    'username': ele.user.userName,
                    'latitude': ele.location.coordinates[1],
                    'longitude': ele.location.coordinates[0]
                }
            }).filter(ele => ele.username !== username) // filter out the user who logs in
        }
        else throw { msg: 'failed to authenticate from given username and/or password' }
    } catch (err) {
        throw { msg: err }
    }
}

module.exports = {
    login
}