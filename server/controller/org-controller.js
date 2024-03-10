

const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')


//import organization model
const Org = require('../db.js').Org;


//find organization
const getOrgs = async (req, res, next) => {

    //use findOne method to find the organization with given email
    let orgs = await Org.findOne({ email: req.params.email });

    //if org is not found 
    if (!orgs) {
        res.send({ message: "No org with current Email found", payload: null })
    }
    //when org is found
    else {
        res.status(200).send({ message: "Orgs", payload: orgs })
    }
}

//add a new organization
const addOrg = async (req, res, next) => {

    //get the organization details from request body
    let org = req.body;

    //validate the inputs
    if (!org.name || !org.password || !org.email) {
        if (!org.name) return res.send({ message: "Name not entered" })

        if (!org.pass) return res.send({ message: "Password not entered" })
        if (!org.email) return res.send({ message: "email not entered" })
    }

    
    let orgFromDb = await Org.findOne({ name: org.name })
    let orgEmailFromDb = await Org.findOne({ email: org.email });
    //if organization with same name already exists
    if (orgFromDb) {
        res.send({ message: "Org already exists" })
    }
    //if same email found 
    else if (orgEmailFromDb) {
        res.send({ message: "Email already exists" })
    }
    else {

        //hash the password and update the password as hashed password
        let hashedPass = await bcryptjs.hash(org.pass, 5);
        org.pass = hashedPass;

        //add the org
        let newOrg = await Org.create(org)

        //send the response
        res.status(200).send({ message: "new org created", payload: newOrg })
    }
}




// when organization logs in
const loginOrg = async (req, res) => {

    //get the org from request body
    let  org = req.body, email = org.email, password = org.pass;

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