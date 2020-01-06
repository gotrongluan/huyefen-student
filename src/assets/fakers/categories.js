export default [
    {
        label: 'development',
        name: 'cate.area.development',
        children: [
            {
                label: 'all-dev',
                name: 'cate.development.all-development'
            },
            {
                label: 'web-dev',
                name: 'cate.development.web-development',
                children: [
                    {
                        label: 'all-web-dev',
                        name: 'cate.development.web-development.all-web-development'
                    },
                    {
                        label: 'javascript',
                        name: 'cate.development.web-development.javascript'
                    },
                    {
                        label: 'angular',
                        name: 'cate.development.web-development.angular'
                    },
                    {
                        label: 'react',
                        name: 'cate.development.web-development.react'
                    },
                    {
                        label: 'css',
                        name: 'cate.development.web-development.css'
                    },
                    {
                        label: 'nodejs',
                        name: 'cate.development.web-development.nodejs'
                    }
                ]
            },
            {
                label: 'mobile-dev',
                name: 'cate.development.mobile-development',
                children: [
                    {
                        label: 'all-mob-dev',
                        name: 'cate.development.mobile-development.all-mobile-development'
                    },
                    {
                        label: 'android',
                        name: 'cate.development.mobile-development.android'
                    },
                    {
                        label: 'ios',
                        name: 'cate.development.mobile-development.ios'
                    },
                    {
                        label: 'flutter',
                        name: 'cate.development.mobile-development.flutter'
                    },
                    {
                        label: 'react-native',
                        name: 'cate.development.mobile-development.react-native'
                    }
                ]
            }
        ]
    },
    {
        label: 'it-and-software',
        name: 'cate.area.it-and-software',
        children: [
            {
                label: 'all-it',
                name: 'cate.it-and-software.all-it'
            },
            {
                label: 'cryptography',
                name: 'cate.it-and-software.crypto',
                children: [
                    {
                        label: 'all-web-dev',
                        name: 'cate.it-and-software.crypto.network'
                    },
                    {
                        label: 'javascript',
                        name: 'cate.it-and-software.web-development.system'
                    },
                    {
                        label: 'angular',
                        name: 'cate.it-and-software.web-development.public-key'
                    },
                    {
                        label: 'react',
                        name: 'cate.it-and-software.web-development.private-key'
                    }
                ]
            }
        ]
    }
]