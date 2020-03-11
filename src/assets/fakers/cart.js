export default [
    {
        _id: 'course_x',
        type: 'course',
        name: 'Lập trình PHP cơ bản',
        authors: ['Nguyễn Hứa Phùng'],
        avatar: 'https://techtalk.vn/wp-content/uploads/2018/12/php-1024x538-696x366.png',
        price: 9.99
    },
    {
        _id: 2,
        type: 'bundle',
        price: 20.98,
        courses: [
            {
                _id: 2,
                name: 'Reactjs for beginner (2019)',
                authors: ['Ha Huynh Sam', 'Luan Nguyen Trong'],
                price: 10.99,
                avatar: 'https://miro.medium.com/max/1200/1*y6C4nSvy2Woe0m7bWEn4BA.png'
            },
            {
                _id: 3,
                name: 'Introduction to microservices',
                authors: ['Manh Le Duc', 'Hung Nguyen Viet'],
                price: 10.99,
                avatar: 'https://miro.medium.com/max/6996/1*xu1Ge_Cew0DHdSU6ETcpLQ.png'
            },
        ]
    },
    {
        _id: 5,
        type: 'course',
        name: 'Make a greate app with Android Java',
        authors: ['Kiet Luong Tuan', 'Tai Than Duc', 'Hieu Pham Minh'],
        price: 10.29,
        avatar: 'https://nordvpn.com/wp-content/uploads/2019/09/NordVPN-app-update-Android-1200x675.png'
    }
]