const Handler = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: Handler.store,
  },
  {
    method: 'GET',
    path: '/books',
    handler: Handler.index,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: Handler.show,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: Handler.update,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: Handler.destroy,
  },
];

module.exports = routes;
