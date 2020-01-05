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
        path: '/messenger', component: '../layouts/NonFooterLayout',
        routes: [
            {
                path: '/messenger',
                component: './Messenger/Default',
                Routes: ['./src/routes/Authenticate']
            },
            {
                path: '/messenger/:converId',
                component: './Messenger/Chat',
                Routes: ['./src/routes/Authenticate']
            }
        ]
    },
    {
        path: '/learning', component: '../layouts/NonFooterLayout',
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
                component: './Courses/Category'
            },
            {
                path: '/courses/:areaTag/:cateTag',
                component: './Courses/Category'
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
                Routes: ['./src/routes/Authenticate'],
                component: './Notifications'
            },
            {
                path: '/my-courses',
                Routes: ['./src/routes/Authenticate'],
                component: './MyCourses'
            },
            {
                path: '/profile',
                Routes: ['./src/routes/Authenticate'],
                component: './Profile'
            },
            {
                path: '/my-friends',
                Routes: ['./src/routes/Authenticate'],
                component: './MyFriends'
            },
            {
                path: 'my-teachers',
                Routes: ['./src/routes/Authenticate'],
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
                Routes: ['./src/routes/Authenticate'],
                component: './Cart'
            },
            {
                path: '/payment',
                Routes: ['./src/routes/Authenticate'],
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