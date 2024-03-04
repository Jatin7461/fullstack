const express = require('express')
const orgApp = express.Router();
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const expressasynchandler = require('express-async-handler')

const Org = require('../db.js').Org;



const getOrgs = async (req, res, next) => {

    console.log("fetching orgs")
    let orgs = await Org.findOne({ email: req.params.email });

    console.log("fetched org")
    console.log(orgs)

    if (!orgs) {
        res.send({ message: "No org with current Email found", payload: null })
    }
    else {
        res.status(200).send({ message: "Orgs", payload: orgs })
    }
}

// orgApp.get('/orgs', async (req, res, next) => {
//     try {

//         console.log("fetching orgs")
//         let orgs = await Org.find();

//         console.log("fetched orgs")
//         console.log(orgs)
//         res.status(200).send({ message: "Orgs", payload: orgs })
//     }
//     catch (err) {
//         next();
//     }

// })


const addOrg = async (req, res, next) => {

    let org = req.body;

    if (!org.name || !org.password || !org.email) {
        if (!org.name) return res.send({ message: "Name not entered" })

        if (!org.pass) return res.send({ message: "Password not entered" })
        if (!org.email) return res.send({ message: "email not entered" })
    }


    let orgFromDb = await Org.findOne({ name: org.name })
    let orgEmailFromDb = await Org.findOne({ email: org.email });
    if (orgFromDb) {
        res.send({ message: "Org already exists" })
    }

    else if (orgEmailFromDb) {
        res.send({ message: "Email already exists" })
    }
    else {

        console.log("reached here")
        let hashedPass = await bcryptjs.hash(org.pass, 5);
        org.pass = hashedPass;

        console.log("reached here too", org)
        let newOrg = await Org.create(org)
        console.log("reached here three")
        res.status(200).send({ message: "new org created", payload: newOrg })
    }
}





const loginOrg = async (req, res) => {
    let org = req.body, email = org.email, password = org.pass;

    if (!email || !password) {
        return res.send({ message: 'Incomplete Credentials' })
    }

    let orgFound = await Org.findOne({ email: email })
    console.log('org found', orgFound)


    if (!orgFound) {
        return res.send({ message: "No Org Found" })
    }

    console.log(orgFound.email, orgFound.pass)
    let passwordMatch = await bcryptjs.compare(password, orgFound.pass);
    console.log('password match', passwordMatch)
    if (!passwordMatch) {
        return res.send({ message: "Invalid password" })
    }


    const token = jwt.sign({ email: email }, "abcdefgh", { expiresIn: "30m" })
    console.log('token is ', token)
    res.send({ message: "Login Success", token: "Bearer " + token, payload: orgFound })


}



module.exports = { getOrgs, addOrg, loginOrg };