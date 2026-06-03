import React from 'react';

function App() {
  return React.createElement('div', {
    className: 'min-h-screen bg-background text-foreground'
  },
    React.createElement('header', { className: 'border-b' },
      React.createElement('nav', { className: 'container mx-auto flex items-center justify-between p-4' },
        React.createElement('h1', { className: 'text-xl font-bold' }, 'FeedMind'),
        React.createElement('div', { className: 'flex gap-4' },
          React.createElement('a', { href: '/login', className: 'text-sm hover:underline' }, 'Login'),
          React.createElement('a', { href: '/register', className: 'text-sm hover:underline' }, 'Register')
        )
      )
    ),
    React.createElement('main', { className: 'container mx-auto p-4' },
      React.createElement('h2', { className: 'text-3xl font-bold mb-4' }, 'Your RSS Reader'),
      React.createElement('p', { className: 'text-muted-foreground' }, 'AI-powered RSS reader with read-later functionality.')
    )
  );
}

export default App;