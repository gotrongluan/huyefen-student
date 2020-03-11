export default (i = 1) => [
    {
        _id: 1,
        key: 1,
        code: 'PARADISE',
        date: 1578813415803,
        prices: [9.99],
        paymentType: 'visa ****2112',
        items: [
            {
                _id: 1,
                avatar: 'https://www.cisomag.com/wp-content/uploads/2017/03/Cherry-picking-a-new-trend-among-hackers.jpg',
                name: `Mật mã và an ninh mạng - page ${i}`,
                type: 1
            }
        ]
    },
    {
        _id: 2,
        key: 2,
        code: 'NGOCHUYEN',
        date: 1578813415803,
        prices: [19.99, 10.00, 9.99],
        paymentType: 'visa ****2112',
        items: [
            {
                _id: 1,
                avatar: 'https://www.nicepng.com/png/detail/393-3932222_odoo-features1-odoo-erp.png',
                name: `Odoo in Enterprise Resource Planning (ERP) - page ${i}`,
                type: 1,
            },
            {
                _id: 2,
                name: `Make a greate app with Android Java - page ${i}`,
                avatar: 'https://nordvpn.com/wp-content/uploads/2019/09/NordVPN-app-update-Android-1200x675.png',
                type: 1
            }
        ]
    },
    {
        _id: 3,
        key: 3,
        code: 'HUYENCUTE',
        date: 1578813415803,
        prices: [19.99, 10.00, 9.99, 5.00],
        paymentType: 'visa ****2112',
        items: [
            {
                _id: 1,
                avatar: 'https://miro.medium.com/max/6996/1*xu1Ge_Cew0DHdSU6ETcpLQ.png',
                name: 'Introduction to microservices',
                type: 1
            },
            {
                type: 2,
                courses: [
                    `Make a greate app with Android Java - page ${i}`,
                    `Advanced in Deep Learing and Machine Learning - page ${i}`,
                    `How to make a progressive web app with React - page ${i}`
                ]
            },
            {
                _id: 2,
                name: `Make a greate app with Android Java - page ${i}`,
                avatar: 'https://nordvpn.com/wp-content/uploads/2019/09/NordVPN-app-update-Android-1200x675.png',
                type: 1
            }
        ]
    },
    {
        _id: 4,
        key: 4,
        code: 'HUYENXINH',
        date: 1578813415803,
        prices: [18.00],
        paymentType: 'visa ****2112',
        items: [
            {
                type: 2,
                courses: [
                    'Make a greate app with Android Java',
                    'Advanced in Deep Learing and Machine Learning',
                    'How to make a progressive web app with React'
                ]
            }
        ]
    },
]