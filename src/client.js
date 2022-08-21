// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './components/App';
// import { AppContainer } from 'react-hot-loader';
// const container = document.getElementById('app');

// function render(Root) {
//     ReactDOM.render(<AppContainer><Root/></AppContainer>, document.getElementById('app'));
// }

// render(App);

// if(module.hot) {
//     module.hot.accept('./components/App', () => {
//         render(require('./components/App').default);
//     });
// }
import React from 'react';
import { hot } from 'react-hot-loader';
 
const App = () => <div>Hello World!</div>;
 
export default hot(module)(App);