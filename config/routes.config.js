export default [
    {
        path: '/user', component: '../layouts/UserLayout',
        routes: [
            {
                path: '/user/login',
                component: './User/Login'
            },
            {
                path: '/user/register',
                component: './User/Register'
            }
        ]
    },
    {
        path: '/messenger', component: '../layouts/MessengerLayout',
        routes: [
            {
                path: '/messenger',
                component: './Messenger/Default',
                Routes: ['./routes/Authenticate']
            },
            {
                path: '/messenger/:converId',
                component: './Messenger/Chat',
                Routes: ['./routes/Authenticate']
            }
        ]
    },
    {
        path: '/learning', component: '../layouts/LearningLayout',
        routes: [
            
        ]
    },
    {
        path: '/', component: '../layouts/BasicLayout',
        routes: [
            {
                path: '/',
                component: './HomePage'
            },
            {
                path: '/courses/:areaTag',
                component: './Courses/Categories'
            },
            {
                path: '/courses/:areaTag/:cateTag',
                component: './Courses/Categories'
            },
            {
                path: '/courses/:areaTag/:cateTag/:topicTag',
                component: './Courses/Topic'
            },
            {
                path: '/course/:courseId',
                component: './Courses/Detail'
            },
            {
                path: '/notifications',
                Routes: ['./routes/Authenticate'],
                component: './Notifications'
            },
            {
                path: '/my-courses',
                Routes: ['./routes/Authenticate'],
                component: './MyCourses'
            },
            {
                path: '/profile',
                Routes: ['./routes/Authenticate'],
                component: './Profile'
            },
            {
                path: '/my-friends',
                Routes: ['./routes/Authenticate'],
                component: './MyFriends'
            },
            {
                path: 'my-teachers',
                Routes: ['./routes/Authenticate'],
                component: './MyTeachers'
            },
            {
                path: 'friend/:friendId',
                component: './Friend'
            },
            {
                path: 'teacher/:teacherId',
                component: './Teacher'
            },
            {
                path: '/cart',
                Routes: ['./routes/Authenticate'],
                component: './Cart'
            },
            {
                path: '/payment',
                Routes: ['./routes/Authenticate'],
                component: './Payment'
            },
            {
                path: '/teaching',
                component: './Others/Teaching'
            },
            {
                path: '/exception',
                routes: [
                    {
                        path: '/exception/404',
                        component: './Exception/404'
                    },
                    {
                        path: '/exception/403',
                        component: './Exception/403'
                    },
                    {
                        path: '/exception/500',
                        component: './Exception/500'
                    },
                    {
                        redirect: '/exception/404'
                    }
                ]
            },
            {
                redirect: '/exception/404'
            }
        ]
    }
]