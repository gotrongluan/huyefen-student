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
            },
            {
                path: '/user/exception/404',
                component: './User/Exception/404',
                title: 'router.user.exception.404'
            },
            {
                redirect: '/user/exception/404'
            }
        ]
    },
    {
        path: '/error', component: '../layouts/ErrorLayout',
        title: 'route.error',
        routes: [
            {
                path: '/error/404',
                component: './Error/404',
                title: 'route.error.404'
            },
            {
                path: '/error/403',
                component: './Error/403',
                title: 'route.error.403'
            }
        ]
    },
    {
        path: '/learning/:courseId', component: '../layouts/LearningLayout',
        title: 'route.learning',
        Routes: ['./src/routes/Authenticate'],
        routes: [
            {
                path: '/learning/:courseId/overview',
                component: './Learning/Overview',
                title: 'route.learning.overview',
            },
            {
                path: '/learning/:courseId/forum',
                component: '../layouts/ForumLayout',
                title: 'route.learning.forum',
                routes: [
                    {
                        path: '/learning/:courseId/forum',
                        component: './Learning/Forum/index',
                        title: 'route.learning.forum.allthreads'
                    },
                    {
                        path: '/learning/:courseId/forum/thread/:threadId',
                        component: './Learning/Forum/Thread',
                        title: 'route.learning.forum.thread'
                    },
                    {
                        component: '404'
                    }
                ]
            },
            {
                path: '/learning/:courseId/announcements',
                component: './Learning/Announcements',
                title: 'route.learning.announcements'
            },
            {
                path: '/learning/:courseId/review',
                component: './Learning/Review',
                title: 'route.learning.review'
            },
            {
                path: '/learning/:courseId/lecture/:lectureId',
                component: './Learning/Lecture',
                title: 'route.learning.lecture'
            },
            {
                component: '404'
            }
        ]
    },
    {
        path: '/messenger', component: '../layouts/MessengerLayout',
        title: 'route.messenger',
        routes: [
            {
                path: '/messenger/:converId?',
                component: './Messenger/index.js',
                title: 'route.messenger.chat',
                Routes: ['./src/routes/Authenticate']
            },
            {
                redirect: '/exception/404'
            }
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
                path: '/courses/area/:areaId',
                title: 'route.basic.area',
                component: './Courses/Area'
            },
            {
                path: '/courses/category/:categoryId',
                title: 'route.basic.cate',
                component: './Courses/Category'
            },
            {
                path: '/courses/topic/:topicId',
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
                path: '/purchase-history',
                title: 'route.basic.purchasehistory',
                Routes: ['./src/routes/Authenticate'],
                component: './PurchaseHistory'
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