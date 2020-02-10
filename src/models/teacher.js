import { delay } from '@/utils/utils';
import COURSES from '@/assets/fakers/mostPopular';
const TEACHER = {
    _id: 1,
    name: 'Ngọc Hạnh Vương',
    avatar: 'https://scontent.fdad1-1.fna.fbcdn.net/v/t1.0-9/51059227_2091470127614437_5419405170205261824_o.jpg?_nc_cat=106&_nc_ohc=LnSzD5KUUN4AX8EolVa&_nc_ht=scontent.fdad1-1.fna&oh=95b1eba87a97f6266a625c07caf68566&oe=5EAE6D56',
    isFollowed: true,
    numOfCourses: 31,
    numOfStudents: 468544,
    numOfReviews: 19203,
    biography: `
    <p></p><p>Andrei is the instructor of the <strong>highest rated&nbsp;Web Development course on Udemy as well as&nbsp;one of the fastest&nbsp;growing.&nbsp;</strong>His graduates have&nbsp;moved&nbsp;on to work for&nbsp;some of the biggest tech&nbsp;companies around the world like Apple, Google, Amazon, JP Morgan, IBM, UNIQLO etc...&nbsp;He&nbsp;has&nbsp;been working as a senior software developer in&nbsp;Silicon Valley and Toronto for many years,&nbsp;and&nbsp;is now taking all that he has learned,&nbsp;to teach&nbsp;programming skills and&nbsp;to help you&nbsp;discover the amazing career opportunities that being a developer allows in&nbsp;life.&nbsp;</p><p>Having been&nbsp;a self taught programmer,&nbsp;he understands that there is an&nbsp;overwhelming number of online courses, tutorials and books&nbsp;that are overly verbose and inadequate at teaching proper skills.&nbsp;Most people feel paralyzed and don't know where to start when learning a complex subject matter, or even worse, most people don't have $20,000 to spend on a coding bootcamp.&nbsp;<strong>Programming skills should be affordable and open to all. An education material&nbsp;should teach real life skills that are current and&nbsp;they should not waste a student's valuable time.</strong>&nbsp;
    Having learned important&nbsp;lessons from working for Fortune 500 companies, tech startups, to even&nbsp;founding his own business, he is now dedicating 100% of his time to&nbsp;teaching others valuable&nbsp;software development skills&nbsp;in order to take control of their life and work in an exciting industry with infinite possibilities.&nbsp;</p><p>Andrei promises you that there are no other courses out there as comprehensive and as well explained.&nbsp;<strong>He believes that in order to learn anything of value, you need to start with the foundation and develop the roots of the tree. Only from there will you be able to learn concepts and specific skills(leaves) that connect to the foundation. Learning becomes exponential when structured in this way.</strong>&nbsp;</p><p>Taking his experience in educational psychology and coding, Andrei's courses will take you on an understanding of complex subjects that you never thought would be possible.&nbsp;&nbsp;
    </p><p><strong>See you inside the courses!</strong></p><p><br></p><p></p>`,
    twitter: 'https://twitter.com/',
    facebook: 'https://fb.com/ngochanhvuong',
    youtube: 'https://youtube.com/',
    instagram: 'https://instagram.com/'
};

const initialState = {
    info: null,
    courses: {
        hasMore: true,
        list: null
    }
};

export default {
    namespace: 'teacher',
    state: initialState,
    effects: {
        *fetch({ payload: teacherId }, { call, put }) {

        },
        *fetchCourses({ payload: teacherId }, { call, put }) {

        },
        *moreCourses({ payload: teacherId }, { call, put, select }) {

        },
        *allCourses({ payload: teacherId }, { call, put, select }) {

        },
        *follow({ payload: teacherId }, { call, put }) {

        },
        *unfollow({ payload: teacherId }, { call, put }) {

        }
    },
    reducers: {
        save(state, { payload }) {

        },
        saveStatus(state, { payload: status }) {

        },
        saveCourses(state, { payload }) {

        },
        pushCourses(state, { payload }) {

        },
        reset() {
            return { ...initialState };
        }
    }
}