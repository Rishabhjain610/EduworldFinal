const { User } = require("./Models/UserModel");
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const teachers = [
    {
        username: "Khalid Ansari",
        email: "khalid.ansari@example.com",
        password: "password123",
        role: "teacher"
    },
    {
        username: "Rupali Sarode",
        email: "rupali.sarode@example.com",
        password: "password123",
        role: "teacher"
    },
    {
        username: "Ritesh Kini",
        email: "ritesh.kini@example.com",
        password: "password123",
        role: "teacher"
    },
    {
        username: "Seema Kolkur",
        email: "seema.kolkur@example.com",
        password: "password123",
        role: "teacher"
    },
    {
        username: "Juhi Janjua",
        email: "juhi.janjua@example.com",
        password: "password123",
        role: "teacher"
    },
    {
        username: "Tasneem Mirza",
        email: "tasneem.mirza@example.com",
        password: "password123",
        role: "teacher"
    }
];

mongoose.connect(process.env.ATLASDB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('DB Connected for seeding teachers');
        seedTeachers();
    })
    .catch(err => console.error("DB connection error:", err));

const seedTeachers = async () => {
    try {
        // Delete existing teacher records
        await User.deleteMany({ role: "teacher" });

        // Manually hash passwords for each teacher
        const saltRounds = 12;
        const hashedTeachers = await Promise.all(teachers.map(async teacher => {
            const hashedPassword = await bcrypt.hash(teacher.password, saltRounds);
            return { ...teacher, password: hashedPassword };
        }));

        // Insert teacher data in bulk with hashed passwords
        await User.insertMany(hashedTeachers);
        console.log("Teacher data initialized successfully");
    } catch (error) {
        console.error("Error seeding teacher data:", error);
    } finally {
        mongoose.connection.close();
    }
};


// const { User } = require("./Models/UserModel");
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// require('dotenv').config();

// const students = [
//     {
//         username: "Atharva",
//         email: "atharva@example.com",
//         password: "password123",
//         role: "student",
//         phoneNumber: "+917387241068"
//     },
//     {
//         username: "Rishabh",
//         email: "rishabh@example.com",
//         password: "password123",
//         role: "student",
//         phoneNumber: "+918433943227"
//     },
//     {
//         username: "Aarjav",
//         email: "aarjav@example.com",
//         password: "password123",
//         role: "student",
//         phoneNumber: "+918591768921"
//     },
//     {
//         username: "Saish",
//         email: "saish@example.com",
//         password: "password123",
//         role: "student",
//         phoneNumber: "+917021831690"
//     },
//     {
//         username: "Aaditya",
//         email: "aaditya@example.com",
//         password: "password123",
//         role: "student",
//         phoneNumber: "+917021127964"
//     },
//     {
//         username: "Sarthak",
//         email: "sarthak@example.com",
//         password: "password123",
//         role: "student",
//         phoneNumber: "+918446634207"
//     }
// ];

// mongoose.connect(process.env.ATLASDB_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
//     .then(() => {
//         console.log("DB Connected for seeding students");
//         seedStudents();
//     })
//     .catch(err => console.error("DB connection error:", err));

// const seedStudents = async () => {
//     try {
//         // Delete existing student records
//         await User.deleteMany({ role: "student" });

//         // Manually hash passwords for each student
//         const saltRounds = 12;
//         const hashedStudents = await Promise.all(students.map(async student => {
//             const hashedPassword = await bcrypt.hash(student.password, saltRounds);
//             return { ...student, password: hashedPassword };
//         }));

//         // Insert student data in bulk with hashed passwords
//         await User.insertMany(hashedStudents);
//         console.log("Student data initialized successfully");
//     } catch (error) {
//         console.error("Error seeding student data:", error);
//     } finally {
//         mongoose.connection.close();
//     }
// };
