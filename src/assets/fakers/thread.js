export default {
    _id: 1,
    user: {
        _id: 1,
        avatar: 'https://scontent.fsgn2-2.fna.fbcdn.net/v/t1.0-9/73209658_1663552363786895_6709450807181312000_n.jpg?_nc_cat=104&_nc_sid=110474&_nc_oc=AQn4wJhyXlzknl-2nEvPC_H3Gcs-zIVfSNPj1vgtuCZwdKegZBkp7EVu_VD1Zulq-PM&_nc_ht=scontent.fsgn2-2.fna&oh=39c771ad6429a3f0ba443ee895d9c162&oe=5EA5A11B',
        name: 'Đặng T.Huyền'
    },
    lecture: {
        _id: 1,
        order: 12,
        title: 'What is Django?'
    },
    createdAt: 1578813445999,
    title: 'What is difference between PWA and SPA?',
    content: `<div><p>Hi, </p><p>so i had to take a long break from this class but I tried to jump back in at the Product clone page where I'd left off. </p><p>I have a problem however (not due to the course I must add):</p><p>so after a bunch of system udpates in my distro, I&nbsp;can no longer login to postgresql, my password (which is saved in a password manager) is not recognised. </p><p><br></p><p>I've tried to follow instructions to reset my postgresql password but with no success.</p><p>So I'm not asking you to troubleshoot that for me as it's probably a user error from my end, but my question is this:</p><p><br></p><p>Can I just uninstall postgresql and delete the files in /var/lib/postgres/data/ and then start a clean install ?</p><p><br></p><p>if this seems like a brutal solution, it's because I've not found any other way to recuperate this db... </p><p><br></p><p>it seems like I always mess up databases!!</p></div>`,
    numOfVotings: 3,
    isFollowed: true,
    isVoted: true,
    totalAnswers: 11,
    moreAnswers: true,
    answers: [
        {
            _id: 1,
            user: {
                _id: 1,
                avatar: 'https://scontent.fsgn2-2.fna.fbcdn.net/v/t1.0-9/73209658_1663552363786895_6709450807181312000_n.jpg?_nc_cat=104&_nc_sid=110474&_nc_oc=AQn4wJhyXlzknl-2nEvPC_H3Gcs-zIVfSNPj1vgtuCZwdKegZBkp7EVu_VD1Zulq-PM&_nc_ht=scontent.fsgn2-2.fna&oh=39c771ad6429a3f0ba443ee895d9c162&oe=5EA5A11B',
                name: 'HuYeFen Cute',
                isInstructor: true
            },
            createdAt: 1578813445900,
            content: '<div>To me not much. I think app implies that it has functionality like a login system, creating and deleting, stuff like that</div>',
            numOfVotings: 0,
            isVoted: false
        },
        {
            _id: 2,
            user: {
                _id: 1,
                avatar: 'https://scontent.fsgn2-2.fna.fbcdn.net/v/t1.0-9/73209658_1663552363786895_6709450807181312000_n.jpg?_nc_cat=104&_nc_sid=110474&_nc_oc=AQn4wJhyXlzknl-2nEvPC_H3Gcs-zIVfSNPj1vgtuCZwdKegZBkp7EVu_VD1Zulq-PM&_nc_ht=scontent.fsgn2-2.fna&oh=39c771ad6429a3f0ba443ee895d9c162&oe=5EA5A11B',
                name: 'Đặng T.Huyền',
                isInstructor: false
            },
            createdAt: 1578813445900,
            content: '<div>To me not much.</div>',
            numOfVotings: 3,
            isVoted: true
        },
        {
            _id: 3,
            user: {
                _id: 1,
                avatar: 'https://scontent.fsgn2-2.fna.fbcdn.net/v/t1.0-9/73209658_1663552363786895_6709450807181312000_n.jpg?_nc_cat=104&_nc_sid=110474&_nc_oc=AQn4wJhyXlzknl-2nEvPC_H3Gcs-zIVfSNPj1vgtuCZwdKegZBkp7EVu_VD1Zulq-PM&_nc_ht=scontent.fsgn2-2.fna&oh=39c771ad6429a3f0ba443ee895d9c162&oe=5EA5A11B',
                name: 'Đặng T.Huyền',
                isInstructor: false
            },
            createdAt: 1578813445900,
            content: '<div>Fuck</div>',
            numOfVotings: 0,
            isVoted: false
        }
    ]
}