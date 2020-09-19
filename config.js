// this file holds all the configs and hardcoded strings for better readability
export const config = {
    port: process.env.PORT || 5000,
    POSTS_PATH: './public/posts',
    BLOG_ROUTE: '/blog/:title',
    DEFAULT_ROUTE: '/',
    NOT_FOUND_ROUTE: '/404',
    NOT_FOUND_ROUTE_MESSAGE: 'Oops. Something went wrong!',
    POSTS_ROUTE: '/posts',
    UPLOAD_ROUTE: '/upload'

}