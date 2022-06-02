const res = require("express/lib/response");
const { Thought, User } = require("../models");

const thoughtController = {
    //Capture all thoughts and associated reactions
    getAllThoughts( req, res){
        Thought.find({})
            .populate ({
                path: "reactions",
                select: "-__v"
            })
            .populate ({
                path: "thoughts",
                select: "-__v"
            })
            .select("-__v")
            .then((dbThoughtData) => res.json(dbThoughtData))
            .catch((err) => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    //capture one thought by its ID
    getThoughtbyId({ params }, res) {
        Thought.findOne({ _id: params.id })
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: "There is no thought with this ID"});
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch((err) => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    //create a thought
    createThought({ body }, res) {
        console.log(body);
        Thought.create(body)
            .then((thoughtData) => {
                return User.findOneAndUpdate(
                    { _id: body.userId },
                    { $push: { thoughts: thoughtData._id }},
                    { new: true }
                );
            })
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({ message: " No user with that ID"});
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => res.json(err));
    },
    // Update a thought by its ID
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true })
            .then((dbThoughtData) => {
                if(!dbThoughtData) {
                    res.status(404).json({ message: "There was no thought with this id"});
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch((err) => res.status(400).json(err));
    },
    //delete a thought by its id
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: "No thought with that id"});
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch((err) => res.status(400).json(err));
    },
    //code for adding a reaction to a thought
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $addToSet: { reactions: body }},
            { new: true }
        )
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: "No thoughts have this id"});
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch((err) => res.json(err));
    },
    // code to delete a reaction
    deleteReaction({ params}, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId }}},
            { new: true }
        )
            .then((dbThoughtData) => res.json(dbThoughtData))
            .catch((err)=> res.json(err));
    }

};

module.exports = thoughtController;