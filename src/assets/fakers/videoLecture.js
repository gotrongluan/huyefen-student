import testVtt from '@/assets/fakers/test.vtt';
import testVttvn from '@/assets/fakers/testvn.vtt';

export default {
    _id: 'lecture-1',
    title: 'Understand What Analytics data to Collect (Tip 1)',
    createdAt: 1578813445900,
    updatedAt: 1578813445900,
    chapter: {
        _id: 1,
        title: 'The Vue Router'
    },
    owner: {
        _id: 2,
        name: 'Huyen Dang',
        avatar: null
    },
    isCompleted: false,
    isDownloadable: false,
    captions: [
        {
            _id: 'caption_1',
            srcLang: 'en',
            label: 'English',
            src: testVtt
        },
        {
            _id: 'caption_3',
            srcLang: 'vi',
            label: 'Vietnamese',
            src: testVttvn
        }
    ],
    resolutions: {
        720: {
            resolution: 720,
            src: 'https://stream.mux.com/GK2iODptHM8pEHpHaXuy7SYl7fvZnv200/high.mp4?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InQ5UHZucm9ZY0hQNjhYSmlRQnRHTEVVSkVSSXJ0UXhKIn0.eyJleHAiOjE1ODgwNTQwNjcsImF1ZCI6InYiLCJzdWIiOiJHSzJpT0RwdEhNOHBFSHBIYVh1eTdTWWw3ZnZabnYyMDAifQ.Q9pCEZmLc21Xg3EuCL5yqRRxZgDOYmNdIjqv83xH3GsQBHU4VhqKm7UMtEqgsSQVpVJWbOYxtqPrhY6Y2DXnnpID80JB_okAK1QChU41GGXM4tYA-e6wVKz52NM0SSUCoC-ZvRkcFl0zFijhWheVHweUDEErM0tGytoCil1WnVSPrdL5Ptx85VMM0l7pLYViZTfPXuy8yQsrh6WLN-pZyclBA_SdWBxMnCMNG_VkvN9tpsp8rAu4kX4yzng2P0f_8wtwPWLtqF4me2_phRw4uovKG6J1km3rYfW-cBJ9kLJbpixRitvFV3MwT4wWdO-ktN0PHm-DszgszAHaZvnrzw'
        },
        480: {
            resolution: 480,
            src: 'https://static.videezy.com/system/resources/previews/000/008/302/original/Dark_Haired_Girl_angry_-what-!-_1.mp4'
        },
        360 : {
            resolution: 360,
            src: 'http://media.w3.org/2010/05/bunny/movie.mp4'
        }
    },
    videoRes: 720,
    nextLecture: {
        _id: 6,
        type: 0
    },
    prevLecture: {
        _id: 2,
        type: 1
    },
    resources: {
        downloadable: [
            {
                _id: 'resource_1',
                name: '300.jpg',
                extra: '01:30',
                url: 'https://i.picsum.photos/id/443/200/300.jpg'
            },
            {
                _id: 'resource_2',
                name: 'test-pdf.pdf',
                extra: '256 KB',
                url: 'https://s1.q4cdn.com/806093406/files/doc_downloads/test.pdf'
            },
            {
                _id: 'resource_3',
                name: 'movie.mp4',
                extra: '36.5 KB',
                url: 'http://media.w3.org/2010/05/bunny/movie.mp4'
            }
        ],
        external: [
            {
                _id: 'resource_4',
                name: 'Test blog',
                url: 'https://fb.com'
            },
            {
                _id: 'resource_5',
                name: 'Legends never die',
                url: 'https://google.com.vn'
            },
            {
                _id: 'resource_14',
                name: 'Test blog',
                url: 'https://fb.com'
            }
        ]
    }
};