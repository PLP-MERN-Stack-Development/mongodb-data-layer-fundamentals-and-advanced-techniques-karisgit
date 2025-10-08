# MongoDB Bookstore Project

This project demonstrates basic and advanced MongoDB operations on a book collection. It includes scripts to populate a MongoDB database with sample book data and perform various queries.

## Prerequisites

- Node.js (v14 or later)
- MongoDB (local instance or MongoDB Atlas)
- npm (comes with Node.js)

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd mongodb-data-layer-fundamentals-and-advanced-techniques-karisgit

Install dependencies:

npm install

Make sure MongoDB is running locally on the default port (27017). If using MongoDB Atlas, update the connection string in insert_books.js.



## Usage

### 1. Insert Sample Data

Run the following command to insert sample book data into your MongoDB:

```bash
node insert_books.js
```

This will:

- Connect to your local MongoDB instance
- Create a database named `plp_bookstore`
- Create a collection named `books`
- Insert sample book data

### 2. Run Queries

You can run the MongoDB queries in two ways:

#### Option 1: MongoDB Shell

1. Open MongoDB shell by running `mongosh` in your terminal
2. Switch to the database: `use plp_bookstore`
3. Copy and paste queries from `queries.js`

#### Option 2: Node.js Script

Create a new file (e.g., `run_queries.js`) with the following template:

```javascript
const { MongoClient } = require("mongodb");
const queries = require("./queries");

async function main() {
  const client = new MongoClient("mongodb://localhost:27017");

  try {
    await client.connect();
    const db = client.db("plp_bookstore");

    // Example:------Run your Query HERE-----------
    const result = await db
      .collection("books")
      .find({ genre: "Fiction" })
      .toArray();
    console.log(result);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
```
