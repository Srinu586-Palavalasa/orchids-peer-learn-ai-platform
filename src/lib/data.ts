export const categories = [
    {
        id: "mathematics",
        name: "Mathematics",
        icon: "Calculator",
        subjects: [
                { id: "calculus", name: "Calculus", lectures: 12, topics: ["Limits","Integration","Differentiation"], mentors: [{name: "Rahul Verma", rating: 4.8}] },
                { id: "algebra", name: "Algebra", lectures: 8, topics: ["Linear Equations","Polynomials"], mentors: [{name: "Rahul Verma", rating: 4.8}] },
                { id: "geometry", name: "Geometry", lectures: 5, topics: ["Triangles","Circles"], mentors: [{name: "Ananya Gupta", rating: 4.8}] },
                { id: "statistics", name: "Statistics", lectures: 10, topics: ["Probability","Distributions"], mentors: [{name: "Rahul Verma", rating: 4.8}] },
                { id: "trigonometry", name: "Trigonometry", lectures: 6, topics: ["Sine/Cosine","Identities"], mentors: [{name: "Rahul Verma", rating: 4.8}] }
            ]
    },
    {
        id: "cs",
        name: "Computer Science",
        icon: "Code",
        subjects: [
            { id: "dsa", name: "Data Structures & Algorithms", lectures: 24, topics: ["Arrays","Trees","Graphs","Sorting"], mentors: [{name: "Priya Sharma", rating: 4.9}] },
            { id: "webdev", name: "Web Development", lectures: 18, topics: ["HTML/CSS","React","APIs"], mentors: [{name: "Vikram Singh", rating: 4.7}] },
            { id: "java", name: "Java Programming", lectures: 15, topics: ["OOP","Collections","JVM"], mentors: [{name: "Amit Patel", rating: 4.6}] },
            { id: "python", name: "Python Programming", lectures: 20, topics: ["Syntax","Data Science","Scripting"], mentors: [{name: "Sneha Reddy", rating: 4.7}] },
            { id: "c-programming", name: "C Programming", lectures: 12, topics: ["Pointers","Memory Management"], mentors: [{name: "Karan Mehta", rating: 4.5}] },
            { id: "dbms", name: "Database Management", lectures: 14, topics: ["SQL","Normalization"], mentors: [{name: "Neha Kapoor", rating: 4.6}] }
        ]
    },
    {
        id: "physics",
        name: "Physics",
        icon: "Atom",
        subjects: [
            { id: "mechanics", name: "Mechanics", lectures: 9, topics: ["Kinematics","Dynamics"], mentors: [{name: "Ananya Gupta", rating: 4.8}] },
            { id: "thermodynamics", name: "Thermodynamics", lectures: 7, topics: ["Laws","Entropy"], mentors: [{name: "Ananya Gupta", rating: 4.8}] },
            { id: "electromagnetism", name: "Electromagnetism", lectures: 11, topics: ["Fields","Circuits"], mentors: [{name: "Ananya Gupta", rating: 4.8}] },
            { id: "optics", name: "Optics", lectures: 5, topics: ["Reflection","Refraction"], mentors: [{name: "Ananya Gupta", rating: 4.8}] }
        ]
    }
];
