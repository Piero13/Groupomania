const { Comment } = require("../models");

// Fonction création d'un commentaire
exports.createComment = (req, res) => {
    const newComment = {
        userId: req.body.userId,
        content: req.body.content,
        publicationId: req.body.publicationId
    };
    Comment.create(newComment)
        .then(() => res.status(201).json({ message: "Commentaire créé" }))
        .catch(error => res.status(500).json({ error }));
};

// Fonction suppression d'un commentaire
exports.deleteComment = (req, res) => {
    Comment.destroy(
        { where: { id: req.params.id } }
    )
    .then(() => res.status(200).json({ message: "Commentaire supprimé" }))
    .catch(error => res.status(500).json({ error }));
};