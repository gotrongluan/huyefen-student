export default [
    {
        path: '/user', component: '../layouts/UserLayout',
        title: 'route.user',
        routes: [
            {
                path: '/user/login',
                component: './User/Login',
                title: 'route.user.login'
            },
            {
                path: '/user/register',
                component: './User/Register',
                title: 'route.user.register'
            }
        ]
    },
    {
        path: '/messenger', component: '../layouts/NonFooterLayout',
        title: 'route.messenger',
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
        title: 'route.learning',
        routes: [
            
        ]
    },
    {
        path: '/', component: '../layouts/BasicLayout',
        title: 'route.basic',
        routes: [
            {
                path: '/',
                title: 'route.basic.home',
                component: './HomePage'
            },
            {
                path: '/courses/:areaTag',
                title: 'route.basic.area',
                component: './Courses/Category'
            },
            {
                path: '/courses/:areaTag/:cateTag',
                title: 'route.basic.cate',
                component: './Courses/Category'
            },
            {
                path: '/courses/:areaTag/:cateTag/:topicTag',
                title: 'route.basic.topic',
                component: './Courses/Topic'
            },
            {
                path: '/course/:courseId',
                title: 'route.basic.course',
                component: './Courses/Detail'
            },
            {
                path: '/notifications',
                title: 'route.basic.notification',
                Routes: ['./src/routes/Authenticate'],
                component: './Notifications'
            },
            {
                path: '/my-courses',
                title: 'route.basic.mycourses',
                Routes: ['./src/routes/Authenticate'],
                component: './MyCourses'
            },
            {
                path: '/settings',
                title: 'route.basic.settings',
                component: '../layouts/SettingsLayout',
                routes: [
                    {
                        path: '/settings/profile',
                        title: 'route.basic.settings.profile',
                        Routes: ['./src/routes/Authenticate'],
                        component: './Settings/Profile'
                    },
                    {
                        path: '/settings/change-password',
                        title: 'route.basic.settings.changepass',
                        Routes: ['./src/routes/Authenticate'],
                        component: './Settings/ChangePassword'
                    },
                    {
                        path: '/settings/payment-methods',
                        title: 'route.basic.settings.paymentmethods',
                        Routes: ['./src/routes/Authenticate'],
                        component: './Settings/PaymentMethods'
                    },
                    {
                        path: '/settings/email',
                        title: 'route.basic.settings.email',
                        Routes: ['./src/routes/Authenticate'],
                        component: './Settings/Email'
                    },
                    {
                        path: '/settings/note-highlight',
                        title: 'route.basic.settings.notehighlight',
                        Routes: ['./src/routes/Authenticate'],
                        component: './Settings/NoteHighlight'
                    },
                    {
                        path: '/settings',
                        redirect: '/settings/profile'
                    },
                    {
                        redirect: '/exception/404'
                    }
                ]
            },
            {
                path: '/my-friends',
                title: 'route.basic.myfriends',
                Routes: ['./src/routes/Authenticate'],
                component: './MyFriends'
            },
            {
                path: 'my-teachers',
                title: 'route.basic.myteachers',
                Routes: ['./src/routes/Authenticate'],
                component: './MyTeachers'
            },
            {
                path: 'friend/:friendId',
                title: 'route.basic.friend',
                component: './Friend'
            },
            {
                path: 'teacher/:teacherId',
                title: 'route.basic.teacher',
                component: './Teacher'
            },
            {
                path: '/cart',
                Routes: ['./src/routes/Authenticate'],
                title: 'route.basic.cart',
                component: './Cart'
            },
            {
                path: '/payment',
                title: 'route.basic.payment',
                Routes: ['./src/routes/Authenticate'],
                component: './Payment'
            },
            {
                path: '/teaching',
                title: 'route.basic.teaching',
                component: './Others/Teaching'
            },
            {
                path: '/exception',
                routes: [
                    {
                        path: '/exception/404',
                        title: 'route.basic.404',
                        component: './Exception/404'
                    },
                    {
                        path: '/exception/403',
                        title: 'route.basic.403',
                        component: './Exception/403'
                    },
                    {
                        path: '/exception/500',
                        title: 'route.basic.500',
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