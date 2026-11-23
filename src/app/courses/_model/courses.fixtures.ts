import type { CoursePlace, CourseSummary } from './course';

/** API 연결 전 코스 홈을 확인하기 위한 임시 장소 데이터입니다. */
const places = {
  onion: {
    id: 'onion-seongsu',
    name: '어니언 성수',
    category: '카페·디저트',
    neighborhood: '성수동',
    imageSrc: '/images/places/onion-seongsu.jpg',
  },
  seoulForest: {
    id: 'seoul-forest',
    name: '서울숲',
    category: '자연·산책',
    neighborhood: '성수동',
    imageSrc: '/images/places/seoul-forest.jpg',
  },
  blueElephant: {
    id: 'blue-elephant-seongsu',
    name: '블루엘리펀트 스페이스 성수',
    category: '전시·박물관',
    neighborhood: '성수동',
    imageSrc: '/images/places/blue-elephant-seongsu.jpg',
  },
  notePerfume: {
    id: 'note-perfume',
    name: '노트 퍼퓸 성수',
    category: '체험',
    neighborhood: '성수동',
    imageSrc: '/images/places/note-perfume.jpg',
  },
  mangwonMarket: {
    id: 'mangwon-market',
    name: '망원시장',
    category: '음식점',
    neighborhood: '망원동',
  },
  mangwonPark: {
    id: 'mangwon-hangang-park',
    name: '망원한강공원',
    category: '자연·산책',
    neighborhood: '망원동',
  },
  yeouidoPark: {
    id: 'yeouido-hangang-park',
    name: '여의도 한강공원',
    category: '자연·산책',
    neighborhood: '여의도동',
  },
  theHyundai: {
    id: 'the-hyundai-seoul',
    name: '더현대 서울',
    category: '쇼핑',
    neighborhood: '여의도동',
  },
  bukchon: {
    id: 'bukchon-hanok-village',
    name: '북촌한옥마을',
    category: '명소·전망',
    neighborhood: '가회동',
  },
  mmca: {
    id: 'mmca-seoul',
    name: '국립현대미술관 서울',
    category: '전시·박물관',
    neighborhood: '소격동',
  },
  euljiro: {
    id: 'euljiro-nogari-alley',
    name: '을지로 노가리골목',
    category: '음식점',
    neighborhood: '을지로3가',
  },
  sewoon: {
    id: 'sewoon-plaza',
    name: '세운상가',
    category: '명소·전망',
    neighborhood: '을지로3가',
  },
  ddp: {
    id: 'dongdaemun-ddp',
    name: '동대문디자인플라자',
    category: '전시·박물관',
    neighborhood: '을지로7가',
  },
  gwangjang: {
    id: 'gwangjang-market',
    name: '광장시장',
    category: '음식점',
    neighborhood: '종로5가',
  },
  seokchon: {
    id: 'seokchon-lake',
    name: '석촌호수',
    category: '자연·산책',
    neighborhood: '잠실동',
  },
  lotteTower: {
    id: 'lotte-world-tower',
    name: '롯데월드타워 서울스카이',
    category: '명소·전망',
    neighborhood: '신천동',
  },
} satisfies Record<string, CoursePlace>;

/** API 연결 전 코스 홈을 확인하기 위한 임시 코스 데이터입니다. 추천순으로 정렬되어 있습니다. */
export const recommendedCourses: readonly CourseSummary[] = [
  {
    id: 'seongsu-slow-afternoon',
    title: '성수에서 천천히 걷는 오후',
    region: '서울 성동구 성수동',
    durationLabel: '3시간',
    concepts: ['아늑함'],
    coverImageSrc: '/images/places/seoul-forest.jpg',
    places: [places.onion, places.seoulForest, places.blueElephant],
    likeCount: 128,
    publishedAt: '2026-11-12',
  },
  {
    id: 'seongsu-scent-and-art',
    title: '성수 향기와 전시 산책',
    region: '서울 성동구 성수동',
    durationLabel: '2~4시간',
    concepts: ['감성적'],
    coverImageSrc: '/images/places/note-perfume.jpg',
    places: [places.notePerfume, places.blueElephant, places.onion, places.seoulForest],
    likeCount: 342,
    publishedAt: '2026-11-10',
  },
  {
    id: 'mangwon-market-picnic',
    title: '망원 시장 먹방과 한강 피크닉',
    region: '서울 마포구 망원동',
    durationLabel: '2시간 이하',
    concepts: ['활기참'],
    places: [places.mangwonMarket, places.mangwonPark],
    likeCount: 57,
    publishedAt: '2026-11-08',
  },
  {
    id: 'yeouido-sunset',
    title: '여의도 노을 데이트',
    region: '서울 영등포구 여의도동',
    durationLabel: '4시간 초과',
    concepts: ['로맨틱'],
    places: [places.theHyundai, places.yeouidoPark],
    likeCount: 1290,
    publishedAt: '2026-11-05',
  },
  {
    id: 'bukchon-hanok-art',
    title: '북촌 한옥과 미술관 나들이',
    region: '서울 종로구 가회동',
    durationLabel: '2~4시간',
    concepts: ['조용함'],
    places: [places.bukchon, places.mmca],
    likeCount: 76,
    publishedAt: '2026-11-03',
  },
  {
    id: 'euljiro-retro-tour',
    title: '을지로에서 종로까지 레트로 골목 한 바퀴',
    region: '서울 중구 을지로3가',
    durationLabel: '4시간 초과',
    concepts: ['이색적', '활기참'],
    places: [places.euljiro, places.sewoon, places.ddp, places.gwangjang, places.mmca],
    likeCount: 905,
    publishedAt: '2026-10-30',
  },
  {
    id: 'jamsil-lake-night',
    title: '잠실 석촌호수 야경',
    region: '서울 송파구 잠실동',
    durationLabel: '2~4시간',
    concepts: ['로맨틱'],
    places: [places.seokchon, places.lotteTower],
    likeCount: 410,
    publishedAt: '2026-10-28',
  },
  {
    id: 'seongsu-forest-morning',
    title: '서울숲 아침 산책과 브런치',
    region: '서울 성동구 성수동',
    durationLabel: '2시간 이하',
    concepts: ['조용함'],
    coverImageSrc: '/images/places/onion-seongsu.jpg',
    places: [places.seoulForest, places.onion],
    likeCount: 0,
    publishedAt: '2026-10-25',
  },
  {
    id: 'mangwon-to-yeouido',
    title: '한강 따라 망원에서 여의도까지',
    region: '서울 마포구 망원동',
    durationLabel: '4시간 초과',
    concepts: ['활기참'],
    places: [places.mangwonMarket, places.mangwonPark, places.yeouidoPark],
    likeCount: 63,
    publishedAt: '2026-10-21',
  },
  {
    id: 'jongno-market-and-design',
    title: '광장시장 먹고 DDP 구경',
    region: '서울 종로구 종로5가',
    durationLabel: '2~4시간',
    concepts: ['이색적'],
    places: [places.gwangjang, places.ddp],
    likeCount: 218,
    publishedAt: '2026-10-18',
  },
  {
    id: 'seongsu-gallery-day',
    title: '성수 갤러리 데이',
    region: '서울 성동구 성수동',
    durationLabel: '2~4시간',
    concepts: ['감성적'],
    coverImageSrc: '/images/places/blue-elephant-seongsu.jpg',
    places: [places.blueElephant, places.notePerfume, places.onion],
    likeCount: 2310,
    publishedAt: '2026-10-15',
  },
  {
    id: 'jamsil-sky-date',
    title: '롯데타워 전망대와 호수 데이트',
    region: '서울 송파구 신천동',
    durationLabel: '4시간 초과',
    concepts: ['로맨틱'],
    places: [places.lotteTower, places.seokchon],
    likeCount: 154,
    publishedAt: '2026-10-12',
  },
];

/** API 연결 전 코스 홈을 확인하기 위한 임시 인기 코스 데이터입니다. 좋아요 많은 순으로 정렬되어 있습니다. */
export const popularCourses: readonly CourseSummary[] = [...recommendedCourses].sort(
  (a, b) => b.likeCount - a.likeCount,
);

/**
 * 임시 데이터에서 코스를 찾습니다.
 * @param courseId 찾을 코스 ID
 */
export function findCourseFixture(courseId: string) {
  return recommendedCourses.find((course) => course.id === courseId);
}
