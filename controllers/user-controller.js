const res = require("express/lib/response");
const { User } = require("../models");
const { populate } = require ("../models/User");

const userController = {
    //code to capture all users
    getAllUsers(req, res) {
        User.find({})
            .populate({
                path: "thoughts",
                select: "-__v"
            })
            .select("-__v")
            .sort({ _id: -1})
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    //code to capture one user
    getUserById({ params }, res) {
        User.findOne({ _id: params.id})
        .populate({
            path: "thoughts",
            select: "-__v"
        })
        .select("-__v")
        .then ((dbUserData)=> {
            if (!dbUserData) {
                res.status(404).json({ message: "There is no user with that Id"});
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    // code for creating a new user
    createUser({ body }, res) {
        User.create(body)
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => res.status(400).json(err));
    },
    //code for updating a user
    updateUser({ params, body}, res) {
        User.findOneAndUpdate({ _id: params.id }, body, {new:true})
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({ message: "There is no user with that Id"});
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => res.status(400).json(err));
    },
    //Code for deleting a user
    deleteUser({ params }, res){
        User.findOneAndDelete({ _id: params.id })
            .then((dbUserData)=> {
                if (!dbUserData) {
                    res.status(404).json({ message: "There is no user with that Id"});
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err)=> res.status(400).json(err));
    },
    //Code for adding a friend
    addFriend({ params }, res){
        User.findOneAndUpdate(
            { _id: params.id },
            { $addToSet: { friends: params.friendsId}},
            { new: true}
        )
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => res.status(400).json(err));
    },
    //Code for removing a friend form a user
    removeFriend({ params }, res) {
        User.findOneAndUpdate (
            { _id: params.id},
            { $pull: { friends: params.friendsId}},
            { new: true}
        )
        .then((dbUserData)=> {
            if (!dbUserData) {
                res.status(404).json({ message: "There is no user with that Id"});
                return;
            }
            res.json(dbUserData);
        })
        .catch((err)=> res.status(400).json(err));
    }
};

module.exports = userController;