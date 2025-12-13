const bcrypt = require('bcrypt');
const {slugify} = require('../utils/slugify');

module.exports = {
    async up(queryInterface){
        const now = new Date();
        // Limpia los registros de demo antes de insertar
        await queryInterface.bulkDelete('comments', {body: 'El servidor está corriendo correctamente prueba'}, {});
        await queryInterface.bulkDelete('enrollments', {score: 16 }, {});
        await queryInterface.bulkDelete('lessons', {title: ['Primeros pasos prueba', 'Setup y Entorno prueba', 'Bases de Datos Relacionales prueba']}, {});
        await queryInterface.bulkDelete('courses', {slug: slugify('Curso prueba')}, {});
        await queryInterface.bulkDelete('users', {email: ['admin@example.com', 'instructor@example.com', 'student@example.com']}, {});

        await queryInterface.bulkInsert('users', [
            {
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@example.com',
                passwordHash: bcrypt.hashSync('admin_password', 10),
                role: 'admin',
                createdAt: now,
                updatedAt: now,
            },
            {
                firstName: 'Roberto',
                lastName: 'Pineda',
                email: 'instructor@example.com',
                passwordHash: bcrypt.hashSync('instructor_password', 10),
                role: 'instructor',
                createdAt: now,
                updatedAt: now,
            },
            {
                firstName: 'Rony',
                lastName: 'Chang',
                email: 'student@example.com',
                passwordHash: bcrypt.hashSync('student_password', 10),
                role: 'student',
                createdAt: now,
                updatedAt: now,
            },
        ]);

        // Saco los IDs insertados por email para evitar choques con datos existentes
        const [users] = await queryInterface.sequelize.query(
            'SELECT id, email FROM "users" WHERE "email" IN (:emails)',
            {replacements: {emails: ['admin@example.com','instructor@example.com','student@example.com']}}
        );
        const getIdByEmail = (email) => users.find((u) => u.email === email)?.id;
        const adminId = getIdByEmail('admin@example.com');
        const instructorId = getIdByEmail('instructor@example.com');
        const studentId = getIdByEmail('student@example.com');

        const courseTitle = 'Curso prueba';
        const courseSlug = slugify(courseTitle);
        await queryInterface.bulkInsert('courses', [
            {
                title: courseTitle,
                slug: courseSlug,
                description: 'Curso de desarrollo prueba.',
                published: true,
                studentsCount: 1,
                metadata: JSON.stringify({level: 'prueba', tags: ['node', 'sequelize']}),
                ownerId: instructorId,
                createdAt: now,
                updatedAt: now,
            },
        ]);

        const [courses] = await queryInterface.sequelize.query(
            'SELECT id, slug FROM "courses" WHERE "slug" = :slug',
            {replacements: {slug: courseSlug}}
        );
        const courseId = courses[0]?.id;

        const lessonData = [
            {title: 'Primeros pasos prueba', body: 'Instala PSeint y genera pseudocódigos prueba.', order: 1},
            {title: 'Setup y Entorno prueba', body: 'Instala y configura el entorno de VSCode con Node prueba.', order: 2},
            {title: 'Bases de Datos Relacionales prueba', body: 'Consruye e implementa bases de datos relacionales prueba.', order: 3},
        ];

        await queryInterface.bulkInsert(
            'lessons',
            lessonData.map((lesson) => ({
                title: lesson.title,
                slug: slugify(lesson.title),
                body: lesson.body,
                order: lesson.order,
                courseId,
                createdAt: now,
                updatedAt: now,
                deletedAt: null,
            }))
        );

        const [lessons] = await queryInterface.sequelize.query(
            'SELECT id, slug FROM "lessons" WHERE "courseId" = :courseId',
            {replacements: {courseId}}
        );
        const firstLessonId = lessons.find((l) => l.slug === slugify('Primeros pasos prueba'))?.id;

        await queryInterface.bulkInsert('enrollments', [
            {
                status: 'active',
                score: 16,
                courseId,
                userId: studentId,
                createdAt: now,
                updatedAt: now,
            },
        ]);

        await queryInterface.bulkInsert('comments', [
            {
                body: 'El servidor está corriendo correctamente prueba',
                lessonId: firstLessonId,
                userId: studentId,
                createdAt: now,
                updatedAt: now,
            },
        ]);
    },
    
    async down(queryInterface){
        await queryInterface.bulkDelete('comments', {body: 'El servidor está corriendo correctamente prueba'}, {});
        await queryInterface.bulkDelete('enrollments', {score: 16}, {});
        await queryInterface.bulkDelete('lessons', {title: ['Primeros pasos prueba', 'Setup y Entorno prueba', 'Bases de Datos Relacionales prueba']}, {});
        await queryInterface.bulkDelete('courses', {slug: slugify('Curso prueba')}, {});
        await queryInterface.bulkDelete('users', {email: ['admin@example.com', 'instructor@example.com', 'student@example.com']}, {});
    },
};
