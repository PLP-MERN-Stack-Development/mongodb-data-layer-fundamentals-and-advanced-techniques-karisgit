// ----------TASK-2: Basic CRUD Operations------------------

// Find all books in a specific genre
db.books.find({ genre: "Fantasy" });

// Find books published after a certain year (e.g., 1950)
db.books.find({ published_year: { $gt: 1950 } });

// Find books by a specific author (e.g., "Jane Austen")
db.books.find({ author: "Jane Austen" });

//  Update the price of a specific book (e.g., "The Hobbit")
db.books.updateOne(
    { title: "The Hobbit" },
    { $set: { price: 20.95 } }
  );

// Delete a book by its title (e.g., "The Alchemist")
db.books.deleteOne({ title: "The Alchemist" });
// --------------------------------------------------------



// --------Task 3: Advanced Queries----------------------

// 1. Find books that are both in stock and published after 2010
db.books.find({
    in_stock: true,
    published_year: { $gt: 2010 }
});

// 2. Use projection to return only title, author, and price fields
db.books.find(
    {},  // Empty filter to match all documents
    {
        _id: 0,         // Exclude _id field
        title: 1,       // Include title
        author: 1,      // Include author
        price: 1        // Include price
    }
);

// 3. Sort books by price (ascending and descending)
// Ascending order (lowest price first)
db.books.find().sort({ price: 1 });
// Descending order (highest price first)
db.books.find().sort({ price: -1 });

// 4. Implement pagination (5 books per page)
// Page 1
db.books.find()
   .sort({ _id: 1 })  // Sort by _id for consistent pagination
   .limit(5)          // Show 5 books per page
   .skip(0);          // Skip 0 for first page

// Page 2
db.books.find()
   .sort({ _id: 1 })
   .limit(5)
   .skip(5);          // Skip first 5 for second page

// Page 3
db.books.find()
   .sort({ _id: 1 })
   .limit(5)
   .skip(10);         // Skip first 10 for third page
//  --------------------------------------------------------



// ----------Task 4: Aggregation Pipeline------------------------
// - Calculate the average price of books by genre.
db.books.aggregate([
    {
        $group: {
            _id: "$genre",
            averagePrice: { $avg: "$price" },
            count: { $sum: 1 }
        }
    },
  {
    $project: {
            _id: 0,
            genre: "$_id",
            averagePrice: { $round: ["$averagePrice", 2] },  // Round to 2 decimal places
            count: 1
        }
  },
  { $sort: { averagePrice: -1 } }  // Sort by average price (highest first)
]);

// - Find the author with the most books in the collection.
db.books.aggregate([
    {
        $group: {
            _id: "$author",
            bookCount: { $sum: 1 },
            books: { $push: "$title" } 
        }
    },
    { $sort: { bookCount: -1 } }, //sort by book count (descending)
    { $limit: 1 }, //Get only the top author
  	{
      $project: {
        _id: 0,
        author: "$_id",
        bookCount: 1,
        sampleBooks: { $slice: ["$books", 3] } //show first 3 books
      }
    }
    
]);

// - Group books by publication decade and count them.
db.books.aggregate([
    {
        $project: {
            title: 1,
            published_year: 1,
            decade: {
                $subtract: [
                    "$published_year",
                    { $mod: ["$published_year", 10] }
                ]
            }
        }
    },
  {
    $group: {
        _id: "$decade",
        count: { $sum: 1 },
        books: { $push: { title: "$title", year: "$published_year" } }
      }
  },
  { $sort: { _id: 1 } },
  {
    $project: {
      _id: 0,
      decade: { $concat: [ { $toString: "$_id" }, "s" ] }, //format as "1990s"
      count: 1,
      sampleBooks: { $slice: ["$books", 2] } //show 2 sample books per decade
    }
  }
]);
// ---------------------------------------------------------------



//---------Task 5: Indexing---------------------------------------
// -Create a single-field index on the title field
db.books.createIndex({ title: 1 });

// -Create a compound index on author and published_year
db.books.createIndex({ author: 1, published_year: -1 });

// 3. Demonstrate performance improvement with explain()

// Example 1: Search by title (with and without index)
// Without index (COLLSCAN)
db.books.find({ title: "1984" }).explain("executionStats");

// After creating index (IXSCAN)
db.books.find({ title: "1984" }).hint({ title: 1 }).explain("executionStats");

// Example 2: Query using compound index
db.books.find({
    author: "George Orwell",
    published_year: { $gt: 1945 }
}).explain("executionStats");

// Example 3: Sort performance with index
db.books.find()
   .sort({ author: 1, published_year: -1 })
   .limit(10)
   .explain("executionStats");

// 4. List all indexes on the books collection
db.books.getIndexes();