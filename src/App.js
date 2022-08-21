import { hot } from 'react-hot-loader/root';
import React from 'react'

const App = () => <div>Hello World!</div>;

export default hot(module)(App);
// import ReactDOM from 'react-dom'
// import StyleContext from 'isomorphic-style-loader/StyleContext'
// //import App from './App.js'
// class App extends React.Component {
//   render() {
//     const { name } = this.props;
//     return (
//       <>
//         <h1>
//           Hello {name}
//         </h1>
//       </>
//     );
//   }
// }

// export default hot(App);


// const insertCss = (...styles) => {
//   const removeCss = styles.map(style => style._insertCss())
//   return () => removeCss.forEach(dispose => dispose())
// }

// ReactDOM.hydrate(
//   <StyleContext.Provider value={{ insertCss }}>
//     <App />
//   </StyleContext.Provider>,
//   document.getElementById('root')
)