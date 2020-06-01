import Vue from 'vue'
import Router from 'vue-router'

import Home from '../components/Home'
import Login from '../components/Login'

Vue.use(Router);

let router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home,
            meta:{
                requireLogin: true
            }
        }, {
            path: '/login',
            name: 'Login',
            component: Login,
        }, {
            path: '/start',
            component: Home,
            meta:{
                requireLogin: true
            }
            // children: [
            //     {
            //         path: 'data',
            //         name: 'Data',
            //         component: Data,
            //     }
            // ]
        }
    ]
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requireLogin)){  // 判断该路由是否需要登录权限
        if (sessionStorage.getItem('token')) {  // 判断当前用户的登录信息loginInfo是否存在
            next();
        } else {
            console.info(to.fullPath);
            next({
                path: '/login',
                query: { url: to.fullPath}
            })
        }
    } else {
        next();
    }

});

export default router;
