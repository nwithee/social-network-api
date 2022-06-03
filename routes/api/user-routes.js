const router = require("express").Router();

const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    removeFriend
} = require("../../controllers/user-controller");

//code for getting all users and creating a user
router.route("/").get(getAllUsers).post(createUser);

// code to get one user, update a user, and delete a user
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

// code for adding and deleting a friend :(
router.route("/:id/friends/:friendsId").post(addFriend).delete(removeFriend);

module.exports = router;