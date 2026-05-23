import { Suspense, type ReactNode } from 'react';

function App(): Node {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>FeedMind</title>
      </head>
      <body>
        <Suspense fallback={<div>Loading...</div>}>
          <App />
        </Suspense>
      </body>
    </html>
  );
}

export default App;