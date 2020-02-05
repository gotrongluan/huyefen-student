export default {
    filters: {
        topic: {
            select: [1, 2, 5, 6],
            list: [
                {
                    _id: 1,
                    title: 'Javascript',
                    count: 564,
                },
                {
                    _id: 2,
                    title: 'jQuery',
                    count: 5,
                },
                {
                    _id: 3,
                    title: 'PHP',
                    count: 3,
                },
                {
                    _id: 4,
                    title: 'Angular',
                    count: 11,
                },
                {
                    _id: 5,
                    title: 'VueJS',
                    count: 103,
                },
                {
                    _id: 6,
                    title: 'React',
                    count: 2399,
                },
                {
                    _id: 7,
                    title: 'Typescript',
                    count: 20,
                },
                {
                    _id: 8,
                    title: 'Java',
                    count: 54,
                },
                {
                    _id: 9,
                    title: 'HTML5',
                    count: 55,
                },
                {
                    _id: 10,
                    title: 'CSS3',
                    count: 7,
                },
                {
                    _id: 11,
                    title: 'Laravel',
                    count: 18,
                },
                {
                    _id: 12,
                    title: 'NodeJS',
                    count: 1,
                },
                {
                    _id: 13,
                    title: 'ExpressJS',
                    count: 3,
                },
                {
                    _id: 14,
                    title: 'Wordpress',
                    count: 33,
                },
                {
                    _id: 15,
                    title: 'Firebase',
                    count: 34,
                },
                {
                    _id: 16,
                    title: 'Django',
                    count: 33,
                },
            ]
        },
        category: {
            select: [1],
            list: [
                {
                    _id: 1,
                    title: 'Web development',
                    count: 23,
                },
                {
                    _id: 2,
                    title: 'Game development',
                    count: 101,
                },
                {
                    _id: 3,
                    title: 'Mobile development',
                    count: 3,
                },
                {
                    _id: 4,
                    title: 'Programming languages and Basic developemnt',
                    count: 7
                }
            ]
        },
        level: {
            select: ['all-level'],
            list: [
                {
                    key: 'all-level',
                    title: 'All level',
                    count: 1548,
                },
                {
                    key: 'beginner',
                    title: 'Beginner',
                    count: 200,
                },
                {
                    key: 'intermediate',
                    title: 'Intermediate',
                    count: 36,
                },
                {
                    key: 'expert',
                    title: 'Expert',
                    count: 2,
                }
            ]
        },
        language: {
            select: ['english'],
            list: [
                {
                    key: 'english',
                    title: 'English',
                    count: 3548,
                },
                {
                    key: 'vietnamese',
                    title: 'Vietnamese',
                    count: 2,
                }
            ]
        },
        price: {
            select: [],
            list: [
                {
                    key: 'paid',
                    title: 'Paid',
                    count: 3045
                },
                {
                    key: 'free',
                    title: 'Free',
                    count: 60
                }
            ]
        },
        lecture: {
            select: [],
            list: [
                {
                    key: 'less-20',
                    title: 'Less than 20',
                    count: 45
                },
                {
                    key: '20-to-60',
                    title: '20 to 60',
                    count: 2768
                },
                {
                    key: '60-to-100',
                    title: '60 to 100',
                    count: 198
                },
                {
                    key: 'more-100',
                    title: 'More than 100',
                    count: 39
                }
            ]
        },
        starRating: {
            select: [],
            list: [
                {
                    key: '4-to-5',
                    title: '4.0 & up',
                    star: 4,
                    count: 257
                },
                {
                    key: '3-to-4',
                    title: '3.0 to 4.0',
                    star: 3,
                    count: 2140
                },
                {
                    key: '2-to-3',
                    title: '2.0 to 3.0',
                    star: 2,
                    count: 119
                },
                {
                    key: '1-to-2',
                    title: '1.0 to 2.0',
                    star: 1,
                    count: 2
                }
            ]
        }
    },
    sortBy: 'highest-rated',
    pagination: {
        total: 400,
        current: 1
    },
    list: [
        {
            _id: 1,
            name: 'Reactjs for Beginner (2020)',
            authors: ['Luan Nguyen Trong', 'Ha Huynh Sam'],
            avatar: 'https://miro.medium.com/max/1200/1*y6C4nSvy2Woe0m7bWEn4BA.png',
            lastUpdated: '12/2019',
            featured: 'course.hotandnew',
            category: 'cate.development.web-development',
            area: 'cate.development',
            topic: 'cate.development.web-development.javascript',
            numOfLectures: 114,
            numOfStarRatings: 234503,
            level: 'course.alllevel',
            summary: 'Don\'t limit the Usage of TypeScript to Angular! Learn the Basics, its Features, Workflows and how to use it! Please tell me why? I think my love my Ngoc Hanh forever. I will love her forever! I will be a rich man!!!',
            whatLearn: [
                'Use TypeScript and its Features like Types, ES6 Support, Classes, Modules, Interfaces and much more in any of their Projects',
                'Learn to build reactive, performant, large scale applications like a senior developer',
                'Build a complete, beautiful & real-world application from start to finish (API and server-side rendered website)'
            ],
            starRating: 4.2,
            price: 19.99
        },
        {
            _id: 2,
            name: 'Programming Java for Beginners - The Ultimate Java Tutorial',
            authors: ['Tin Dang Phu Trung', 'Duc La Hoang', 'Cuong Van Tien'],
            avatar: 'https://miro.medium.com/max/6996/1*xu1Ge_Cew0DHdSU6ETcpLQ.png',
            lastUpdated: '12/2019',
            featured: null,
            category: 'cate.development.web-development',
            area: 'cate.development',
            topic: 'cate.development.web-development.css',
            numOfLectures: 114,
            numOfStarRatings: 9503,
            level: 'course.alllevel',
            summary: 'Don\'t limit the Usage of TypeScript to Angular! Learn the Basics, its Features, Workflows and how to use it!',
            whatLearn: [
                'Use TypeScript and its Features like Types, ES6 Support, Classes, Modules, Interfaces and much more in any of their Projects',
                'Learn to build reactive, performant, large scale applications like a senior developer',
                'Build a complete, beautiful & real-world application from start to finish (API and server-side rendered website)'
            ],
            starRating: 4.7,
            price: 9.99
        },
        {
            _id: 3,
            name: 'Advanced in Machine Learning and Deep Learning',
            authors: ['Tan Dinh Minh', 'Duong Le Hoang', 'Tuan Vu Dao Anh', 'Duong Cao Chanh'],
            avatar: 'https://miro.medium.com/max/2400/1*c_fiB-YgbnMl6nntYGBMHQ.jpeg',
            lastUpdated: '12/2019',
            featured: 'course.highrated',
            category: 'cate.development.web-development',
            area: 'cate.development',
            topic: 'cate.development.web-development.python',
            numOfLectures: 114,
            numOfStarRatings: 234503,
            level: 'course.alllevel',
            summary: 'Don\'t limit the Usage of TypeScript to Angular! Learn the Basics, its Features, Workflows and how to use it!',
            whatLearn: [
                'Use TypeScript and its Features like Types, ES6 Support, Classes, Modules, Interfaces and much more in any of their Projects',
                'Learn to build reactive, performant, large scale applications like a senior developer',
                'Build a complete, beautiful & real-world application from start to finish (API and server-side rendered website)'
            ],
            starRating: 4.6,
            price: 9.99
        },
        {
            _id: 4,
            name: 'Mobile Application Crash Course - The best course for beginner',
            authors: ['Kiet Luong Tuan', 'Manh Le Duc'],
            avatar: 'https://nordvpn.com/wp-content/uploads/2019/09/NordVPN-app-update-Android-1200x675.png',
            lastUpdated: '12/2019',
            featured: null,
            category: 'cate.development.web-development',
            area: 'cate.development',
            topic: 'cate.development.web-development.css',
            numOfLectures: 114,
            numOfStarRatings: 234503,
            level: 'course.alllevel',
            summary: 'Don\'t limit the Usage of TypeScript to Angular! Learn the Basics, its Features, Workflows and how to use it!',
            whatLearn: [
                'Use TypeScript and its Features like Types, ES6 Support, Classes, Modules, Interfaces and much more in any of their Projects',
                'Learn to build reactive, performant, large scale applications like a senior developer',
                'Build a complete, beautiful & real-world application from start to finish (API and server-side rendered website)'
            ],
            starRating: 4.5,
            price: 9.99
        },
        {
            _id: 5,
            name: 'The Complete 2020 Web Development Bootcamp',
            authors: ['Nhu Vo', 'Hanh Vuong'],
            avatar: 'https://finalstyle.com/pictures/news/xu_huong_thiet_ke_web_2020_1.png',
            lastUpdated: '12/2019',
            featured: null,
            category: 'cate.development.web-development',
            area: 'cate.development',
            topic: 'cate.development.web-development.css',
            numOfLectures: 114,
            numOfStarRatings: 234503,
            level: 'course.alllevel',
            summary: 'Don\'t limit the Usage of TypeScript to Angular! Learn the Basics, its Features, Workflows and how to use it!',
            whatLearn: [
                'Use TypeScript and its Features like Types, ES6 Support, Classes, Modules, Interfaces and much more in any of their Projects',
                'Learn to build reactive, performant, large scale applications like a senior developer',
                'Build a complete, beautiful & real-world application from start to finish (API and server-side rendered website)'
            ],
            starRating: 4.5,
            price: 9.99
        },
        {
            _id: 6,
            name: 'Reactjs for Beginner (2020)',
            authors: ['Luan Nguyen Trong', 'Ha Huynh Sam'],
            avatar: 'https://miro.medium.com/max/1200/1*y6C4nSvy2Woe0m7bWEn4BA.png',
            lastUpdated: '12/2019',
            featured: null,
            category: 'cate.development.web-development',
            area: 'cate.development',
            topic: 'cate.development.web-development.css',
            numOfLectures: 114,
            numOfStarRatings: 234503,
            level: 'course.alllevel',
            summary: 'Don\'t limit the Usage of TypeScript to Angular! Learn the Basics, its Features, Workflows and how to use it!',
            whatLearn: [
                'Use TypeScript and its Features like Types, ES6 Support, Classes, Modules, Interfaces and much more in any of their Projects',
                'Learn to build reactive, performant, large scale applications like a senior developer',
                'Build a complete, beautiful & real-world application from start to finish (API and server-side rendered website)'
            ],
            starRating: 4.2,
            price: 19.99
        },
        {
            _id: 11,
            name: 'Reactjs for Beginner (2020)',
            authors: ['Luan Nguyen Trong', 'Ha Huynh Sam'],
            avatar: 'https://miro.medium.com/max/1200/1*y6C4nSvy2Woe0m7bWEn4BA.png',
            lastUpdated: '12/2019',
            featured: 'course.highrated',
            category: 'cate.development.web-development',
            area: 'cate.development',
            topic: 'cate.development.web-development.react',
            numOfLectures: 114,
            numOfStarRatings: 234503,
            level: 'course.alllevel',
            summary: 'Don\'t limit the Usage of TypeScript to Angular! Learn the Basics, its Features, Workflows and how to use it!',
            whatLearn: [
                'Use TypeScript and its Features like Types, ES6 Support, Classes, Modules, Interfaces and much more in any of their Projects',
                'Learn to build reactive, performant, large scale applications like a senior developer',
                'Build a complete, beautiful & real-world application from start to finish (API and server-side rendered website)'
            ],
            starRating: 4.2,
            price: 19.99
        },
        {
            _id: 12,
            name: 'Programming Java for Beginners - The Ultimate Java Tutorial',
            authors: ['Tin Dang Phu Trung', 'Duc La Hoang', 'Cuong Van Tien'],
            avatar: 'https://miro.medium.com/max/6996/1*xu1Ge_Cew0DHdSU6ETcpLQ.png',
            lastUpdated: '12/2019',
            featured: 'course.bestseller',
            category: 'cate.development.web-development',
            area: 'cate.development',
            topic: 'cate.development.web-development.angular',
            numOfLectures: 114,
            numOfStarRatings: 234503,
            level: 'course.alllevel',
            summary: 'Don\'t limit the Usage of TypeScript to Angular! Learn the Basics, its Features, Workflows and how to use it!',
            whatLearn: [
                'Use TypeScript and its Features like Types, ES6 Support, Classes, Modules, Interfaces and much more in any of their Projects',
                'Learn to build reactive, performant, large scale applications like a senior developer',
                'Build a complete, beautiful & real-world application from start to finish (API and server-side rendered website)'
            ],
            starRating: 4.7,
            price: 9.99
        }
    ]
}