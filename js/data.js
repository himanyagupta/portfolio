/* ==========================================================================
   EDIT YOUR CONTENT HERE
   Socials, projects, skills, education and experience all live in this file.
   Hero and About text is written directly in index.html (look for "EDIT:").

   Any value that starts with YOUR_ is a placeholder. Links that still hold a
   placeholder show a small "add this link" message instead of navigating.
   ========================================================================== */

window.PORTFOLIO = {

    /* ---------- Contact form ----------
       endpoint: paste a Formspree / similar form URL to send messages for real,
       e.g. "https://formspree.io/f/xxxxxxx". While it is empty, the form
       validates and then prepares a ready-to-send email in the visitor's own
       email app (no message is sent behind the scenes). */
    contactForm: {
        endpoint: "https://formspree.io/f/xdekgdjb",
        toEmail: "himanyagupta2@gmail.com"
    },

    /* ---------- Social links ----------
       Used in the hero, contact section and footer.
       Replace `url` to change a link. For email, change `email` only. */
    socials: [
        {
            id: "github",
            label: "GitHub",
            blurb: "Code and projects",
            url: "https://github.com/himanyagupta",
            icon: "fa-brands fa-github"
        },
        {
            id: "linkedin",
            label: "LinkedIn",
            blurb: "Let's connect",
            url: "https://www.linkedin.com/in/himanya-gupta-480093362",
            icon: "fa-brands fa-linkedin-in"
        },
        {
            id: "instagram",
            label: "Instagram",
            blurb: "Say hi",
            url: "https://www.instagram.com/wtf.himanyaa/",
            icon: "fa-brands fa-instagram"
        },
        {
            id: "email",
            label: "Email",
            blurb: "himanyagupta2@gmail.com",
            email: "himanyagupta2@gmail.com",
            icon: "fa-regular fa-envelope"
        }
    ],

    /* ---------- Education ---------- */
    education: [
        {
            period: "2025 \u2013 Present",
            title: "B.Tech \u2014 Information Technology",
            org: "Banasthali Vidyapith",
            status: "Currently in 2nd year",
            description: "Building a strong foundation in data structures and algorithms, alongside core CS coursework."
        },
        {
            period: "Self-paced learning",
            title: "Exploring AI & Machine Learning",
            org: "Independent study",
            status: "Ongoing",
            description: "Learning AI/ML concepts and technologies through hands-on projects, alongside my coursework."
        }
    ],

   
    skills: [
        {
            title: "Programming",
            icon: "fa-solid fa-terminal",
            blurb: "Where my fundamentals are being built.",
            items: [
                { name: "Python", icon: "fa-brands fa-python" },
                { name: "C", icon: "fa-solid fa-code" },
                { name: "C++", icon: "fa-solid fa-code", note: "strengthening" }
            ]
        },
        {
            title: "Web",
            icon: "fa-solid fa-globe",
            blurb: "What I use to build for the browser.",
            items: [
                { name: "HTML", icon: "fa-brands fa-html5" },
                { name: "CSS", icon: "fa-brands fa-css3-alt" },
                { name: "JavaScript", icon: "fa-brands fa-js" },
                { name: "React", icon: "fa-brands fa-react" },
                { name: "Next.js", icon: "fa-solid fa-layer-group" }
            ]
        },
        {
            title: "Database",
            icon: "fa-solid fa-database",
            blurb: "Working with data.",
            items: [
                { name: "SQL", icon: "fa-solid fa-database" },
                { name: "Supabase", icon: "fa-solid fa-bolt" }
            ]
        },
        {
            title: "Tools",
            icon: "fa-solid fa-screwdriver-wrench",
            blurb: "Version control and deployment.",
            items: [
                { name: "Git", icon: "fa-brands fa-git-alt" },
                { name: "GitHub", icon: "fa-brands fa-github" },
                { name: "Vercel", icon: "fa-solid fa-cloud" }
            ]
        },
        {
            title: "Core CS",
            icon: "fa-solid fa-graduation-cap",
            blurb: "The concepts behind the code.",
            items: [
                { name: "Data Structures & Algorithms", icon: "fa-solid fa-sitemap", note: "strengthening" },
                { name: "OOP", icon: "fa-solid fa-cubes" },
                { name: "DBMS", icon: "fa-solid fa-server" }
            ]
        },
        {
            title: "AI / Learning",
            icon: "fa-solid fa-brain",
            blurb: "What I'm exploring right now.",
            items: [
                { name: "AI Fundamentals", icon: "fa-solid fa-brain" },
                { name: "AI/ML exploration", icon: "fa-solid fa-robot", note: "exploring" },
                { name: "NumPy", icon: "fa-solid fa-calculator", note: "learning" },
                { name: "Pandas", icon: "fa-solid fa-table", note: "learning" }
            ]
        }
    ],

    /* ---------- Projects ----------
       image:     path to a screenshot (a placeholder shows until it exists)
       githubUrl: keep YOUR_..._HERE until you paste the real repository URL
       liveUrl:   leave "" to hide the Live Demo button */
    projects: [
        {
            id: "agrishare",
            title: "AgriShare",
            context: "",
            role: "Built the website \u00b7 Team lead & presenter",
            description: "A platform for rural resource exchange, covering agricultural machinery and crop-residue resources that can be listed, found and matched. It is connected to a backend and  runs on realistic mock data.",
            features: [
                "Resource listings",
                "Find and list resources",
                "Smart matching",
                "Dashboard",
                "Resource details"
            ],
            tech: ["Next.js", "React", "JavaScript", "Vercel"],
            image: "assets/agrishare.png",
            imageAlt: "Screenshot of the AgriShare website",
            placeholderIcon: "fa-solid fa-seedling",
            githubUrl: "https://github.com/himanyagupta/Agrishare",
            liveUrl: "https://agrisharep2p.vercel.app/"
        },
        {
            id: "atm",
            title: "ATM Banking System",
            context: "",
            role: "",
           
            description: "A ATM simulation that walks through the core banking actions an ATM offers.",
            features: [
                "Account access",
                "Balance inquiry",
                "Cash withdrawal and deposit",
                "Transaction handling"
            ],
            tech: ["python","sql"],
            image: "assets/atm.png",
            imageAlt: "Screenshot of the ATM Banking System",
            placeholderIcon: "fa-solid fa-credit-card",
            githubUrl: "https://github.com/himanyagupta/ATM-banking-system",
            liveUrl: ""
        },
        {
            id: "whimsy",
            title: "Whimsy World",
            context: "",
            role: "",
            
            description: "An interactive, AI-powered webcam experience built around creative interaction and a playful interface.",
            features: [],
            tech: ["Javascript","HTML","canva","webRTC","MediaPipe Task Vision(on device hand tracking)","generative AI(claude API)","CSS3"],
            image: "assets/whimsy.png",
            imageAlt: "Screenshot of Whimsy World",
            placeholderIcon: "fa-solid fa-wand-magic-sparkles",
            githubUrl: "https://github.com/himanyagupta/whimsy",
            liveUrl: ""
        }
    ],

    /* ---------- Experience ---------- */
    experience: [
        {
            period: "2026",
            current: true,
            role: "App Development Intern",
            org: "Onyatrips",
            summary: "A student internship on the app side, where I've been doing QA and testing work around the Companion app.",
            points: [
                "Testing application flows",
                "Validating valid, invalid and missing data",
                "Checking repeated actions",
                "Navigation and back-navigation",
                "Mobile and desktop behavior",
                "Regression testing",
                "Flutter analysis and testing as part of the workflow"
            ],
            tags: ["QA testing", "Regression testing", "Flutter analysis & testing"]
        }
    ]
};
