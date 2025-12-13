/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize){
        /*
        // Borra todo antes de migrar.
        for (const table of ['comments', 'enrollments', 'lessons', 'courses', 'users']) {
            try {await queryInterface.dropTable(table)} catch (err) {}
        }
        */

        const jsonType =
        queryInterface.sequelize.getDialect && queryInterface.sequelize.getDialect() === 'postgres' ? Sequelize.JSONB : Sequelize.JSON;
        
        await queryInterface.createTable('users',{
            id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
            firstName: {type: Sequelize.STRING, allowNull: false},
            lastName: {type: Sequelize.STRING, allowNull: false},
            email: {type: Sequelize.STRING, allowNull: false, unique: true},
            passwordHash: {type: Sequelize.STRING, allowNull: false},
            role: {type: Sequelize.ENUM('admin', 'instructor', 'student'), allowNull: false, defaultValue: 'student'},
            createdAt: {allowNull: false, type: Sequelize.DATE},
            updatedAt: {allowNull: false, type: Sequelize.DATE},
        });

        await queryInterface.createTable('courses',{
            id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
            title: {type: Sequelize.STRING, allowNull: false, unique: true},
            slug: {type: Sequelize.STRING, allowNull: false, unique: true},
            description: {type: Sequelize.TEXT, allowNull: false},
            published: {type: Sequelize.BOOLEAN, defaultValue: false},
            studentsCount: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},
            metadata: {type: jsonType, allowNull: false, defaultValue: {}},
            ownerId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {model: 'users', key: 'id'},
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            createdAt: {allowNull: false, type: Sequelize.DATE},
            updatedAt: {allowNull: false, type: Sequelize.DATE},
            deletedAt: {type: Sequelize.DATE},
        });

        await queryInterface.createTable('lessons', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
            title: {type: Sequelize.STRING, allowNull: false},
            slug: {type: Sequelize.STRING, allowNull: false, unique: 'lesson_slug_per_course'},
            body: {type: Sequelize.TEXT, allowNull: false},
            order: {type: Sequelize.INTEGER, allowNull: false},
            courseId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: 'lesson_slug_per_course',
                references: {model: 'courses', key: 'id'},
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            createdAt: {allowNull: false, type: Sequelize.DATE},
            updatedAt: {allowNull: false, type: Sequelize.DATE},
            deletedAt: {type: Sequelize.DATE},
        });

        await queryInterface.createTable('enrollments', {
            id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
            status: {type: Sequelize.ENUM('pending', 'active'), allowNull: false, defaultValue: 'pending'},
            score: {type: Sequelize.DECIMAL(4, 2), allowNull: true},
            courseId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: 'enrollment_course_user',
                references: {model: 'courses', key: 'id'},
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: 'enrollment_course_user',
                references: {model: 'users', key: 'id'},
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            createdAt: { allowNull: false, type: Sequelize.DATE },
            updatedAt: { allowNull: false, type: Sequelize.DATE },
        });

        await queryInterface.createTable('comments', {
            id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
            body: {type: Sequelize.TEXT, allowNull: false},
            lessonId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {model: 'lessons', key: 'id'},
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {model: 'users', key: 'id'},
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            createdAt: {allowNull: false, type: Sequelize.DATE},
            updatedAt: {allowNull: false, type: Sequelize.DATE},
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('comments');
        await queryInterface.dropTable('enrollments');
        await queryInterface.dropTable('lessons');
        await queryInterface.dropTable('courses');
        await queryInterface.dropTable('users');
        // Limpia ENUMs en Postgres
        if (queryInterface.sequelize.getDialect && queryInterface.sequelize.getDialect() === 'postgres'){
            await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_role";');
            await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_enrollments_status";');
        }
    },
};
