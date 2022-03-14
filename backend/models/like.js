module.exports = (sequelize, DataTypes) => {
    const Like = sequelize.define('Like', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id'
            }
        },
        publicationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Publication',
                key: 'id'
            }
        },
        liked: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
        {
            timestamps: false,
            tableName: 'likes'
        }
    );

    Like.associate = function(models) {
        models.User.belongsToMany(models.Publication, {
            through: models.Like,
            foreignKey: 'userId',
            otherKey: 'publicationId'
        });
        models.Publication.belongsToMany(models.User, {
            through: models.like,
            foreignKey: 'publicationId',
            otherKey: 'userId'
        });
        models.Like.belongsToMany(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });
        models.Like.belongsToMany(models.Publication, {
            foreignKey: 'publicationId',
            as: 'publication'
        });
    };

    return Like;
};