import Homepage from './home'
export default {
    path:'/',
    async action({store}){
        const title = "React Webpack 5";//store.getState().siteSettings.data.siteTitle;
        const description ="React Webpack5";// store.getState().siteSettings.data.metaDescription;
        const listingFields = {};//store.getState().listingFields.data;
        const layoutType = "1";//store.getState().siteSettings.data.homePageType;

        // if (listingFields === undefined) {
        //   store.dispatch(getListingFields());
        // }
    
        return {
        title,
        description,
        listingFields,
        chunk: 'home',
        component: <Homepage />,
        };
    }
}