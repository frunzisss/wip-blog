// this file holds all the configs and hardcoded strings for better readability
export const config = {
    port: process.env.PORT || 5000,
    ARTICLES_PATH: './public/posts',
    DEFAULT_ROUTE_MESSAGE: 'Welcome to WIP blog',
    BLOG_ROUTE: '/blog/:title',
    DEFAULT_ROUTE: '/',
    NOT_FOUND_ROUTE: '/404',
    NOT_FOUND_ROUTE_MESSAGE: 'Oops. Something went wrong!',
    POSTS_ROUTE: '/posts'

}