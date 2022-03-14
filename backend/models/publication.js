module.exports = (sequelize, DataTypes) => {
    const Publication = sequelize.define('Publication', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        imageUrl: {
            type: DataTypes.STRING
        },
        likes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        dislikes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    },
    {
        timestamps: false,
        tableName: 'publications'
    });

    Publication.associate = function (models) {
        models.Publication.belongsTo(models.User, {
            onDelete: "cascade",
            foreignKey: {
                name: 'userId',
                allowNull: false
            }
        });
        models.Publication.hasMany(models.Like, {
            foreignKey: 'publicationId'
        });
        models.Publication.hasMany(models.Comment, {
            foreignKey: 'publicationId'
        })
    };

    return Publication
};