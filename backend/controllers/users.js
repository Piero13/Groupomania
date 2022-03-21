const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require("../models");
const fs = require('fs');

// Fonction création utilisateur
exports.signup = (req, res) => {
    // Salage du mot de passe
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        // Création de l'objet utilisateur
        const newUser = {
            lastname: req.body.lastname,
            firstname: req.body.firstname,
            email: req.body.email,
            password: hash
        }
        // Création de l'utilisateur
        User.create(newUser)
            .then(() => res.status(200).json({ message: 'Utilisateur créé' }))
            .catch(() => res.status(400).json({ message: 'Utilisateur déjà existant' }))
    })
    .catch(error => res.status(500).json({ error }));
};

// Fonction connexion utilisateur
exports.login = (req, res) => {
    User.findOne({ where: { email: req.body.email } })
        .then(user => {
            console.log(user)
            // Si l'utilisateur n'existe pas on renvoie un message d'erreur
            if(!user) {
                return res.status(401).json({ error: 'Utilisateur inexistant' });
            }
            // Si l'utilisateur est trouvé, on compare les mots de passe
            bcrypt.compare(req.body.password, user.dataValues.password)
                .then(valid => {
                    // Si les mots de passe ne correspondent pas on renvoie un message d'erreur
                    if(!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect' });
                    }
                    // On ajoute le token dans la réponse
                    res.status(200).json({
                        userId: user.dataValues.id,
                        token: jwt.sign(
                            { userId: user.dataValues.id },
                            process.env.MY_TOKEN_KEY,
                            { expiresIn: '24h' }
                        )
                    });
                });
        })
        .catch(error => res.status(500).json({error}));
};

// Fonction modification image utilisateur
exports.updateImage = (req, res) => {
    User.findOne({ where: { id: req.body.userId } })
        .then(user => {
            // Si l'image de profil est modifiée
            if(req.file) {
                const filename = user.imageUrl.split('/images/')[1];
                // Si l'ancienne image est différente de l'image par défaut elle est supprimée
                if(filename != "image_profil_default.jpg") {
                    fs.unlink(`images/${filename}`, (err) => {
                        if(err) throw err;
                    });
                }
                // On ajoute la nouvelle image et on met à jour la DB
                const newImage = {
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                };
                User.update(
                        newImage, { where: { id: req.body.userId}}
                    )
                    .then(() => res.status(201).json({ message: 'Image modifiée' }))
                    .catch(error => res.status(500).json({ error }));
            };
        })
        .catch(error => res.status(500).json({ error }));
}

// Fonction modification utilisateur
exports.updateUser = (req, res) => {
    User.findOne({ where: { id: req.body.userId } })
        .then(user => {

            // Si le mot de passe est modifié
            if(req.body.oldPassword && req.body.newPassword) {
                // On compare le mot de passe saisi avec le mot de passe actuel
                bcrypt.compare(req.body.oldPassword, user.dataValues.password)
                    .then(valid => {
                        if(!valid) {
                            return res.status(401).json({ error: 'Le mot de passe saisi ne correspond pas au mot de passe actuel'})
                        } else {
                            bcrypt.hash(req.body.newPassword, 10)
                                .then(newHash => {
                                    User.update(
                                        { password: newHash },
                                        { where: { id: req.body.userId } }
                                    );
                                    res.status(201).json({ message: 'Mot de passe changé'})
                                })
                                .catch(error => res.status(500).json({ error }))
                        }
                    })
                    .catch(error => res.status(500).json({ error }))
            }

            // Si le nom, le prénom ou la description utilisateur est modifié
            if(req.body.lastname && req.body.lastname != user.lastname) {
                User.update(
                    { lastname: req.body.lastname},
                    { where: { id: req.body.userId } }
                );
                res.status(201).json({ message: 'Nom utilisateur modifié'})
            };
            if(req.body.firstname && req.body.firstname != user.firstname) {
                User.update(
                    { firstname: req.body.firstname},
                    { where: { id: req.body.userId } }
                );
                res.status(201).json({ message: 'Prénom utilisateur modifié'})
            };
            if(req.body.description && req.body.description != user.description) {
                User.update(
                    { description: req.body.description },
                    { where: { id: req.body.userId } }
                );
            };
        })
        .catch(error => res.status(500).json({ error }));
};

// Fonction suppression utilisateur
exports.deleteUser = (req, res) => {
    User.findOne({ where: { id: req.params.id } })
        .then(user => {
            const filename = user.imageUrl.split('/images/')[1];
            // L'image de profil est supprimée du serveur si différente de l'image par défaut
            if(filename != "image_profil_default.jpg") {
                fs.unlink(`images/${filename}`, (err) => {
                    if(err) {
                        console.log("Erreur: " + err);
                    };
                });
            };
            // L'utilisateur est supprimé de la DB
            User.destroy({ where: { id: req.params.id } })
                .then(() => res.status(200).json({ message: "Utilisateur supprimé" }))
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }))
};


// Fonction récupération de tous les utilisateurs
exports.getAllUsers = (req, res) => {
    // Les mots de passe utilisateurs ne sont pas enregistrés dans la réponse
    User.scope('noPassword').find()
        .then(user => res.status(200).json(user))
        .catch(error => res.status(500).json({ error }))
};


// Fonction récupération d'un seul utilisateur
exports.getUser = (req, res) => {
    // Le mot de passe utilisateur n'est pas enregistré dans la réponse
    User.findOne({ where: { id: req.params.id } })
        .then(user => res.status(200).json(user))
        .catch(error => res.status(500).json({ error }))
};