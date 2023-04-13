const { User } = require("../models/User");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../utils/SendEmail")
const generateToken = require("../utils/generateToken");

const signup = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!email) {
            return res.status(422).json({ status: false, message: "Missing email." });
        }
        if (!name && !password) {
            return res.status(422).json({ status: false, message: "Missing credentials." });
        }

        const existingUser = await User.findOne({ email }).exec();
        if (existingUser) {
            return res.status(409).json({
                status: false,
                message: "Email is already in use."
            });
        }

        // generate salt to hash password
        const salt = await bcrypt.genSalt(10);
        // // now we set user password to hashed password
        let encryptedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: encryptedPassword
        })

        let saved = await user.save();

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
        res.status(400).json({ status: false, message: "Something went wrong", "Error": error.message });
    }
};

const signin = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email) {
            return res.status(422).json({ status: false, message: "Missing email." });
        }
        if (!password) {
            return res.status(422).json({ status: false, message: "Missing password." });
        }

        const user = await User.findOne({ email });

        if (user) {
            // check user password with hashed password stored in the database
            const validPassword = await bcrypt.compare(password, user.password);

            if (validPassword) {
                res.json({
                    status: true,
                    message: "Loggedin successfully!",
                    data: {
                        id: user._id,
                        email: user.email,
                        name: user.name,
                        token: generateToken(user._id)
                    }
                });
            } else {
                res.json({ status: false, message: "Invalid Password" });
            }
        } else {
            res.json({ status: false, message: "User not found!" });
        }

    } catch (error) {
        res.status(400).json({ status: false, message: "Something went wrong", "Error": error.message });
    }
};

let getUser = async (req, res) => {
    let userid = req.user._id;
    let Data;
    try {
        let user = await User.findById(userid)
            .populate('org')
            .populate('ownCourses')
            .populate('subscriptions')
            .populate('memberships')
            .then(p => {
                Data = p;
            })
            .catch(error => Data = error);

        res.json({
            status: true,
            data: Data
        });
    } catch (error) {
        res.json({ status: false, message: "User not found!", "Error": error.message });
    }
}

let updateUser = async (req, res) => {
    try {

        const { name, password, avatar } = req.body;
        let user = req.user;
        let encryptedPassword;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            // // now we set user password to hashed password
            encryptedPassword = await bcrypt.hash(password, salt);
        }
        let upUser = await User.findOneAndUpdate({ _id: user._id }, {
            name: name || user.name,
            password: encryptedPassword || user.password,
            avatar: avatar || user.avatar
        })

        if (!upUser) {
            res.send("changes not saved")
        } else {
            res.json({ status: true, message: "User updated seccessfuly" });
        }
    } catch (error) {
        res.json({ status: false, message: "User update failed", "Error": error.message });
    }
}

let resetPassEmail = async (req, res) => {
    try {
        let email = req.body.email;
        if (!email) {
            return res.status(422).json({ status: false, message: "Missing email." });
        }
        const existingUser = await User.findOne({ email }).exec();
        if (!existingUser) {
            return res.status(409).json({
                status: false,
                message: "User does not exist."
            });
        }

        const token = generateToken(existingUser._id);
        const Link = `https://vidyavault.netlify.app/resetpassword?token=${token}&id=${existingUser._id}`;

        let obj = {
            "Link": Link,
        }

        sendEmail(email, "Reset password", obj);
        res.send("send email success");
    } catch (error) {
        res.json({ status: false, message: "Server failed to send email", "Error": error.message });
    }
}

let resetPass = async (req, res) => {
    try {
        let { password, id } = req.body;
        if (!password) {
            return res.status(422).json({ status: false, message: "Missing password." });
        }
        if (password) {
            const salt = await bcrypt.genSalt(10);
            
            let encryptedPassword = await bcrypt.hash(password, salt);

            let upUser = await User.findOneAndUpdate({ _id: id }, { password: encryptedPassword })

            if (!upUser) {
                res.send("password reset failed")
            } else {
                res.json({ status: true, message: "password changed seccessfuly" });
            }
        }

    } catch (error) {
        res.json({ status: false, message: "something went wrong", "Error": error.message });
    }
}


module.exports = { signup, signin, getUser, updateUser, resetPassEmail, resetPass };