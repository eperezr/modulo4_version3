import { sequelize } from '../database/database.js';
import { Status } from "../constants/index.js";
import { Task } from './task.js';
import { DataTypes } from 'sequelize';
import { encriptar } from '../common/bycript.js';

export const User = sequelize.define('users',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    username:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate:{
            notNull:{
                    msg: 'ingrese nombre de usuario',
                },
        },
    },
    
    password:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notNull:{
                msg: 'ingrese password',
                },
        },
    },
    
    status: {
        type: DataTypes.STRING,
        defaultValue: Status.ACTIVE,
        valide:{
            isIn:{
                args: [[Status.ACTIVE, Status.INACTIVE]],
                msg: `Debe ser ${Status.ACTIVE} o ${Status.INACTIVE}`,
            },
        },
    },

});

//usuario muchas tareas
User.hasMany(Task)
//una tarea solo un usuario
Task.belongsTo(User)


User.beforeCreate(async (user) => {
    try {
        user.password = await encriptar(user.password);
    } catch (error) {
         logger.error(error.message);
         throw new Error('Error al ecriptar la contraseña');
    }
})
    
User.beforeUpdate(async (user) => {
    try {
        user.password = await encriptar(user.password);
    } catch (error) {
         logger.error(error.message);
         throw new Error('Error al ecriptar la contraseña');
    }
})