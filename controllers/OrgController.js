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

const getOrg = async (req, res) => {
    try {
        let orgId = req.body.orgId;
        let Data;
        let course = await Organization.findById(orgId)
            .populate('members')
            .then(p => {
                Data = p;
            })
            .catch(error => Data = error);

        res.json({
            status: true,
            data: Data
        });
    } catch (error) {
        res.status(400).json({ status: false, message: "fail to get course", "Error": error.message });
    }
}

module.exports = { updateOrg, getOrg };
