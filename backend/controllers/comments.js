const { Comment } = require("../models");

// Fonction création d'un commentaire
exports.createComment = (req, res) => {
    const newComment = {
        content: req.body.content,
        userId: req.body.userId,
        publicationId: req.body.publicationId
    };
    Comment.create(newComment)
        .then(() => res.status(201).json({ message: "Commentaire créé" }))
        .catch(error => res.status(500).json({ error }));
};

// Fonction modification d'un commentaire
exports.updateComment = (req, res) => {
    Comment.update(
        { content: req.body.content },
        { where: { id: req.body.id } }
    )
        .then(() => res.status(201).json({ message: "Commentaire modifié"}))
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