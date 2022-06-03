const router = require('express').Router();
const {
    getAllThoughts,
    getThoughtbyId,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction
  } = require('../../controllers/thought-controller');

//get all thoughts and create a new thought
router.route('/').get(getAllThoughts).post(createThought);

//get, update, and delete one thought
router
  .route('/:id')
  .get(getThoughtbyId)
  .put(updateThought)
  .delete(deleteThought);

//add a reaction and delete a reaction
router.route('/:thoughtId/reactions').post(addReaction).delete(deleteReaction);

module.exports = router;

