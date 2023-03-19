const { User } = require("../models/User");
const { Organization } = require("../models/Organization");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../utils/SendEmail")
const generateToken = require("../utils/generateToken");


const adminSignup = async (req, res) => {

    const { name, email, password, orgName, description, goal, slogan } = req.body;

    if (!email) {
        return res.status(422).json({ status: false, message: "Missing email." });
    }
    if (!name && !password && !orgName) {
        return res.status(422).json({ status: false, message: "Missing something like name, password, organization name." });
    }

    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
        return res.status(409).json({
            status: false,
            message: "Email is already in use."
        });
    }

    try {
        // generate salt to hash password
        const salt = await bcrypt.genSalt(10);
        // // now we set user password to hashed password
        let encryptedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: encryptedPassword,
            isAdmin: true
        })

        let saved = await user.save();

        let admin = saved._id

        const organization = new Organization({
            orgName,
            description,
            goal,
            slogan,
            admin: admin
        })

        let orgs = await organization.save();

        let getadmin = await User.findById(admin)
        getadmin.org = orgs._id;
        let final = await getadmin.save();

        if (!saved && !final) {
            res.json({ message: "Not able to save user!" });
        } else {
            res.json({
                status: true,
                message: "User registered successfully!",
                data: {
                    id: user._id,
                    email: user.email,
                    name: user.name
                }
            });
        }
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ status: false, message: "Something went wrong", "Error": error.message });
    }
};
// completed --------------------------------------------------------

const memberInviteEmail = async (req, res) => {
    let {email, orgId} = req.body;

    if (!email) {
        return res.status(422).json({ status: false, message: "Missing email." });
    }
  
    let getOrg = await Organization.findOne({_id: orgId }).exec();


    let orgName = getOrg.orgName;
    const Link = `http://localhost:8080/admin/membersignup?email=${email}&orgId=${orgId}`;
    let obj = {
        "Link": Link,
        "orgName": orgName
    }
    try {
        sendEmail(email, "join this Organization", obj);
        res.send("send email success");
    } catch (error) {
        res.json({ status: false, message: "Server failed to send email" });
    }
}

const memberSignup = async (req, res) => {
    try {
        let id = req.params.id;
        const { name, email, password, orgId } = req.body;

        // generate salt to hash password
        const salt = await bcrypt.genSalt(10);
        // // now we set user password to hashed password
        let encryptedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: encryptedPassword
        })
        user.memberships.push(orgId);
        let saved = await user.save();
        let memId = saved._id;

        let own = await Organization.findOneAndUpdate({ _id: orgId }, { $push: { members: memId } });
        own.membersCount += 1;
        own.save();

        if (!saved) {
            res.json({ message: "Not able to save user!" });
        } else {
            res.json({
                status: true,
                message: "User registered successfully!",
                data: {
                    id: user._id,
                    email: user.email,
                    name: user.name
                }
            });
        }

    } catch (error) {
        res.json({ status: false, message: "Server failed to send email" });
    }
}



module.exports = { adminSignup, memberInviteEmail, memberSignup }

