require("dotenv").config();
const connect = require("./lib/connect");
const express = require("express");
const cors = require("cors");
const app = express();
const dayjs = require("dayjs");
const port = process.env.PORT || 3000;
const Book = require("./models/books");
const Copy = require("./models/copies");
const Rental = require("./models/rentals");
const User = require("./models/users");

app.use(express.json(), cors());

app.get("/", (req, res) => res.type("html").send(html));

const server = app.listen(port, () =>
  console.log(`Express app listening on port ${port}!`)
);
//Seeing the existing users
app.get("/users", async (req, res) => {
  await connect();
  const users = await User.find();
  res.json(users);
  console.log("You are seeing the users");
});

//Creating a new user
app.post("/users", async (req, res) => {
  await connect();
  const { name } = req.body;
  if (!name) {
    return { message: "Please write a name" };
  }
  const foundUser = await User.findOne({ name: name });
  if (foundUser) {
    return res.json({ id: foundUser._id, name: foundUser.name });
  } else {
    const created = await User.create({ name });
    return res.json({ id: created._id, name: created.name });
  }
});

//Seeing the existing books
app.get("/books", async (req, res) => {
  await connect();
  const books = await Book.find();
  res.json(
    books.map((book) => {
      const bookObject = book.toObject();
      const { _id: id, ...restOfBook } = bookObject;
      return {
        id,
        ...restOfBook,
      };
    })
  );
});

//Checking up an specific book
app.get("/books/:bookId", async (req, res) => {
  await connect();
  const { bookId } = req.params;
  console.log(bookId);
  const selectedBook = await Book.findOne({ _id: bookId });
  console.log("selectedBook: ", selectedBook);
  const copies = await Copy.find({ bookId: selectedBook._id });
  console.log("book ID:", bookId);
  console.log("copies:", copies);
  const totalCopies = copies.length;
  console.log("Total copies:", copies.length);
  const listOfAvailableCopies = copies.filter((copy) => copy.rented === false);
  console.log("listOfAvailableCopies", listOfAvailableCopies);
  const availableCopies = listOfAvailableCopies.length;
  console.log({ availableCopies });
  if (availableCopies === 0) {
    res.json("This book is not available");
  } else {
    return res.json({
      id: selectedBook._id,
      title: selectedBook.title,
      totalCopies: totalCopies,
      copiesInStock: availableCopies,
      coverImage: selectedBook.img,
    });
  }
});
//Renting a book
app.post("/books/:bookId/rent", async (req, res) => {
  await connect();
  const { userId } = req.body;
  const { bookId } = req.params;
  const copyToRent = await Copy.findOne({ bookId: bookId, rented: false });
  console.log("copy to rent: ", copyToRent, "bookId: ", bookId);
  const today = dayjs();
  const newRental = await Rental.create({
    title: copyToRent?.title,
    copyId: copyToRent?._id,
    bookId: bookId,
    userId: userId,
    rentalDate: today.toDate(),
    rentalEnd: today.add(2, "week").toDate(),
  });
  if (newRental) {
    const choosenId = copyToRent._id;
    console.log(copyToRent);
    const changeStatus = await Copy.findOneAndUpdate(
      { _id: choosenId },
      { rented: true }
    );
    console.log(newRental);
    res.json({ newRental });
  }
});
//Get the rented books by an user
app.get("/users/:userId/rentals", async (req, res) => {
  await connect();
  const { userId } = req.params;
  console.log(userId);

  const rentedBooks = await Rental.find({
    userId: userId,
  });
  console.log(rentedBooks);
  res.json(rentedBooks);
});
server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Welcome to the library!
    </section>
    
  </body>
</html>
`;
