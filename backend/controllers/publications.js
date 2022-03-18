const { Publication, User, Like, Comment } = require("../models");
const { Op } = require('sequelize');
const fs = require('fs');

// Fonction création publication
exports.createPublication = (req, res) => {
    let publicationImage;
    // Si l'utilisateur publie une image
    if(req.file) {
        publicationImage = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    };
    // Création de l'objet publication
    const newPublication = {
        userId: req.body.userId,
        content: req.body.content,
        imageUrl: publicationImage
    };
    // Création de la publication
    Publication.create(newPublication)
        .then(publication => res.status(201).json(publication))
        .catch(error => res.status(500).json({ error }));
};

// Fonction suppression publication
exports.deletePublication = (req, res) => {
    Publication.findOne({ where: { id: req.params.id } })
    .then(publication => {
        // Si la publication comprend une image, elle est supprimée du serveur
        if(publication.imageUrl != null) {
            const filename = publication.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, (err) => {
                if(err) throw err;
            })
        };
        // La publication est supprimée de la DB
        Publication.destroy({ where: { id: req.params.id } })
            .then(() => res.status(201).json({ message: "Publication supprimée"}))
            .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};


// Fonction récupération de toutes les publications
exports.getAllPublications = (req, res) => {
    // On recherche toutes les publications
    Publication.scope('formatted_date').findAll({
        // On y inclue les utilisateurs, likes et commentaires
        include: [
            { model: User, as: 'User', attributes: ['firstname', 'lastname', 'imageUrl'] },
            { model: Like },
            { model: Comment, include: [
                { model: User, attributes: ['firstname', 'lastname', 'imageUrl'] }
            ]}
        ],
        // Les résulats sont classés par ordre décroissant des dates
        order: [
            ['publicationDate', 'DESC'],
            [Comment, 'createdAt', 'DESC']
        ]
    })
        .then(publications => {
            res.status(200).json(publications);
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

// Fonction like/dislike des publications
exports.publicationLike = (req, res) => {
    Like.findOne({
        where: { 
            userId: req.body.userId,
            publicationId: req.body.publicationId }
    })
        .then(response => {
            // Si l'utilisateur n'a jamais liké ou disliké la publication
            if(response == null) {
                // S'il clique sur "like"
                if(req.body.likeValue == 1) {
                    Like.create({
                        userId: req.body.userId,
                        publicationId: req.body.publicationId,
                        liked: req.body.likeValue
                    });
                    Publication.increment(
                        { likes: 1 },
                        { where: { id: req.body.publicationId}}
                    );
                    res.status(201).json({ message: 'Like ajouté'})
                }
                // S'il clique sur "dislike"
                else if(req.body.likeValue == -1) {
                    Like.create({
                        userId: req.body.userId,
                        publicationId: req.body.publicationId,
                        liked: req.body.likeValue
                    });
                    Publication.increment(
                        { dislikes: 1 },
                        { where: { id: req.body.publicationId}}
                    );
                    res.status(201).json({ message: 'Dislike ajouté'})
                }
            }

            // Si l'utilisateur a déjà liké la publication
            else if(response.dataValues.liked == 1) {
                // S'il clique sur "dislike"
                if(req.body.likeValue == -1) {
                    Like.update(
                        { liked: -1 },
                        { where: { [Op.and]: [{ publicationId: req.body.publicationId }, { userId: req.body.userId }] } }
                    );
                    Publication.increment(
                        { dislikes: 1 },
                        { where: { id: req.body.publicationId } }
                    );
                    Publication.decrement(
                        { likes: 1 },
                        { where: { id: req.body.publicationId } }
                    );
                    res.status(201).json({ message: "Dislike ajouté & like retiré"});
                }
                // S'il clique sur "like"
                else {
                    Like.destroy(
                        { where: { [Op.and]: [{ publicationId: req.body.publicationId}, { userId: req.body.userId }] } }
                    );
                    Publication.decrement(
                        { likes: 1 },
                        { where: { id: req.body.publicationId } }
                    );
                    res.status(201).json({ message: "Like retiré"})
                };
            }

            // Si l'utilisateur a déjà disliké la publication
            else if(response.dataValues.liked == -1) {
                // S'il clique sur "like"
                if(req.body.likeValue == 1) {
                    Like.update(
                        { liked: 1 },
                        { where: { [Op.and]: [{ publicationId: req.body.publicationId }, { userId: req.body.userId }] } }
                    );
                    Publication.increment(
                        { likes: 1 },
                        { where: { id: req.body.publicationId } }
                    );
                    Publication.decrement(
                        { dislikes: 1 },
                        { where: { id: req.body.publicationId } }
                    );
                    res.status(201).json({ message: "Like ajouté & dislike retiré"})
                }
                // S'il clique sur "dislike"
                else {
                    Like.destroy(
                        { where: { [Op.and]: [{ publicationId: req.body.publicationId }, { userId: req.body.userId }] } }
                    );
                    Publication.decrement(
                        { dislikes: 1 },
                        { where: { id: req.body.publicationId } }
                    );
                    res.status(201).json({ message: "Dislike retiré"})
                };
            }
        })
        .catch(error => res.status(500).json({ error }));
};