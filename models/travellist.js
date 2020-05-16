'use strict';
module.exports = (sequelize, DataTypes) => {
    const travelList = sequelize.define('travelList', {
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "Users",
                key: "id",
                onDelete: "CASCADE"
            }
        },
        place_id: DataTypes.STRING
    }, {
        timestamps: false
    });
    travelList.associate = function(models) {
        travelList.belongsTo(models.Users, { onDelete: "CASCADE", hooks: true })
    };
    return travelList;
};