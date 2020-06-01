import Vue from 'vue'
import Router from 'vue-router'

import Home from '../components/Home'
import Login from '../components/Login'
import Init from "../components/Init";
import page404 from "../components/404";
import Select from "../components/init/Select";
import Config from "../components/init/Config";

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
            path: '/init',
            name: 'Init',
            component: Init,
            meta:{
                requireLogin: true
            },
            children: [
                {
                    path: 'select',
                    name: 'Select',
                    component: Select,
                }, {
                    path: 'config',
                    name: 'Config',
                    component: Config,
                }
            ]
        }, {
            path: '*',    // 此处需特别注意至于最底部
            name: 'page404',
            component: page404,
        }
    ]
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requireLogin)){  // 判断该路由是否需要登录权限
        let token = sessionStorage.getItem('token');
        let tokenStart = sessionStorage.getItem('tokenStart');
        let oneHourAgo = new Date().getTime() - 3600000;
        if (token !== undefined && oneHourAgo < tokenStart) {  // 判断当前用户的登录信息是否存在，并且没有过期
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
