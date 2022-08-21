import express from 'express'
import React from 'react'
import ReactDOM from 'react-dom'
import StyleContext from 'isomorphic-style-loader/StyleContext'
import App from './App.js'

const server = express()
const port = process.env.PORT || 8080

// Server-side rendering of the React app
server.get('*', (req, res, next) => {
  const css = new Set() // CSS for all rendered React components
  const insertCss = (...styles) => styles.forEach(style => css.add(style._getCss()))
  const body = ReactDOM.renderToString(
    <StyleContext.Provider value={{ insertCss }}>
      <App />
    </StyleContext.Provider>
  )
  const html = `<!doctype html>
    <html>
      <head>
        <script src="client.js" defer></script>
        <style>${[...css].join('')}</style>
      </head>
      <body>
        <div id="root">${body}</div>
      </body>
    </html>`
  res.status(200).send(html)
})

server.listen(port, () => {
  console.log(`Node.js app is running at http://localhost:${port}/`)
})