export default {
        path: '/',
        async action({next}){
            const router =  await next();
            route.title = `${route.title || 'Untitled Page'} mo by route`;
            route.description = `${route.description || 'Untitled Page'} mo by route`;
            return router;
        }
    }
