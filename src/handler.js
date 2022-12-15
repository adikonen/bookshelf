const { nanoid } = require('nanoid');
const booklist = require('./booklist');

const store = (request, h) => {
  try {
    const {
      name, year, author, summary, publisher, pageCount, readPage, reading,
    } = request.payload;

    if (name === null || name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }

    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = readPage === pageCount;

    const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      insertedAt,
      updatedAt,
    };

    booklist.push(newBook);
    const isSuccess = booklist.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response;
    }
    // jika tidak sukses maka jalankan catch
    throw new Error('Variable isSuccess bernilai false');
  } catch (err) {
    const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
  }
};

const index = (request, h) => {
  const { name, reading, finished } = request.query;
  // array index ke-0 bernilai false dan 1 bernilai true
  const convert = [false, true];
  const isReading = convert[reading];
  const isFinished = convert[finished];

  const filteredBooks = booklist.filter((book) => {
    // jika querystring kosong / nilai diberikan tidak sesuai maka beri nilai true
    let nameFilled = name === undefined;
    let readingFilled = isReading === undefined;
    let finishedFilled = isFinished === undefined;
    const isNameQueryIncludedInBook = book.name?.toLowerCase().includes(name?.toLowerCase());

    if (isNameQueryIncludedInBook) {
      nameFilled = true;
    }
    if (book.reading === isReading) {
      readingFilled = true;
    }
    if (book.finished === isFinished) {
      finishedFilled = true;
    }

    return (nameFilled && readingFilled && finishedFilled);
  });

  const books = filteredBooks.map((book) => {
    // eslint-disable-next-line no-shadow
    const { id, name, publisher } = book;
    return { id, name, publisher };
  });

  const response = h.response({
    status: 'success',
    data: {
      books,
    },
  });
  response.code(200);
  return response;
};

const show = (request, h) => {
  const { bookId } = request.params;

  const book = booklist.find((item) => bookId === item.id);

  if (book === null || book === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      book,
    },
  });
  response.code(200);
  return response;
};

const update = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const { bookId } = request.params;
  const updatedAt = new Date().toISOString();

  if (name === null || name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const i = booklist.findIndex((book) => book.id === bookId);
  const finished = readPage === pageCount;
  if (i !== -1) {
    booklist[i] = {
      ...booklist[i],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const destroy = (request, h) => {
  const { bookId } = request.params;
  const i = booklist.findIndex((book) => book.id === bookId);

  if (i !== -1) {
    booklist.splice(i, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  index, show, store, update, destroy,
};
