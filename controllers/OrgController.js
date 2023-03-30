const { Course } = require("../models/Course");
const { Organization } = require("../models/Organization");
const { User } = require("../models/User");


const updateOrg = async (req, res) => {

    try {
        let orgData;
        const {
            orgId,
            orgName,
            description,
            goal,
            slogan,
            banner } = req.body;

        let getOrg = await Organization.find({"_id": orgId})
            .then((p) => {
                orgData = p;
            })

        let orgUpdate = await Organization.findOneAndUpdate({ "_id": orgId }, {
            orgName: orgName || orgData.orgName,
            description: description || orgData.description,
            goal: goal || orgData.goal,
            slogan: slogan || orgData.slogan,
            banner: banner || orgData.banner
        })
        let setOrg = await orgUpdate.save();
        res.json({ status: true, message: "updated" });

    } catch (error) {
        res.json({ status: false, message: "something went wrong", "Error": error.message });
    }

}


module.exports = { updateOrg };
