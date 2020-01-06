export default [
    {
        label: 'development',
        name: 'cate.development',
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
                        name: 'cate.development.web-development.all'
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
                        name: 'cate.development.mobile-development.all'
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
        name: 'cate.it-and-software',
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
                        label: 'network',
                        name: 'cate.it-and-software.crypto.network'
                    },
                    {
                        label: 'system',
                        name: 'cate.it-and-software.crypto.system'
                    },
                    {
                        label: 'public-key',
                        name: 'cate.it-and-software.crypto.public-key'
                    },
                    {
                        label: 'private-key',
                        name: 'cate.it-and-software.crypto.private-key'
                    }
                ]
            }
        ]
    }
]