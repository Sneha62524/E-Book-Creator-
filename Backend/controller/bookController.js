const Book = require("../models/Book");

// @desc Create a new book
//@route POST /api/books
// @access Private
const createBook = async (req, res) => {
  try {
    const { title, author, subtitle } = req.body;
    const chapters = req.body.chapters || req.body.Chapters || [];

    if (!title || !author) {
      return res.status(400).json({ message: "Please provide a title and author" });
    }

    const book = await Book.create({
      userId: req.user._id,
      title,
      author,
      subtitle: subtitle || "",
      chapters: Array.isArray(chapters) ? chapters : []
    });

    res.status(201).json(book);
  } catch (error) {
    console.error("Error creating book :", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc  Get all books for a user
//@route  GET / api / books
// @access Private
const getBooks = async (req, res) => {
    try {
        const books = await Book.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(books);
    } catch (error) {
        console.error("Error fetching book :", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc Get a single book by ID
// @route Get /api/books/:id
// @access Private
const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized to view this book" });
        }

        res.status(200).json(book);
    } catch {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc  update a book
// @route Put /api/books/:id
// @access Private
const updateBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized to update this book" });
        }

        const updateBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        res.status(200).json(updateBook);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc Delete a book by ID
// @route Delete /api/books/:id
// @access Private
const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized to delete this book" });
        }

        await book.deleteOne();

        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc  update a book cover image
// @route Put /api/books/cover/:id
// @access Private
const updateBookCover = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized to update this book" });
        }

        if (req.file) {
            book.coverImage = `/upload/${req.file.filename}`;
        }

        const updatedBook = await book.save();
        res.status(200).json(updatedBook);
    } catch (error) {
        console.error("Error updating book cover:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    createBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook,
    updateBookCover,
}