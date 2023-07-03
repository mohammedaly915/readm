import * as BooksAPI from "./BooksAPI";
import './App.css';
import { Route, Routes } from "react-router-dom";

import { useState } from 'react';
import Search from "./components/Search";
import Home from "./components/Home";
import { useEffect } from "react";
function App() {
  const [showSearchPage,setShowSearchPage]=useState(false);
  const [books,setBooks]=useState([]);
  const [search,setSearch]=useState("");
  const [booksFromSearch,setBooksFromSearch]=useState([]);
  const [loadSearch,setLoadSearch]=useState(false);

  useEffect(()=>{
    BooksAPI.getAll().then((res) => setBooks(res))
  },[])
  const changeShelf = async (book, shelf) => {
    await BooksAPI.update(book, shelf);
    await BooksAPI.getAll().then((res) => {
      setBooks(res)
    });
    handleBooksSearch(search)
  };

  
  //Handle Books which you search
  const handleBooksSearch = async (search) => {
    await BooksAPI.search(search).then((res) => {
      if (res && !res.error) {
          setBooksFromSearch(res.map((booksSearch) => {
            books.forEach((book) => {
                    if (booksSearch.id === book.id) booksSearch.shelf = book.shelf
                  })
                  return booksSearch;
                }))
          setLoadSearch(true);
      } else {
          setBooksFromSearch(`No books like: " ${search} "`)

          setLoadSearch(false)
      }
    }); // then
    console.log("Search");
    console.log(booksFromSearch);
  };
// Handle Search input 
  const handleSearch = async (event) => {
    await setSearch(event.target.value)
    handleBooksSearch(search);
    console.log(`In HandleSearch ${search}`)
  };
  return (
    <>
      <div className="app">
          <Routes>
            <Route path="/search" element={<Search handleSearch={handleSearch} search={search} booksFromSearch={booksFromSearch} changeShelf={changeShelf} loadSearch={loadSearch} />}/>
            <Route path="/" element={<Home books={books} changeShelf={changeShelf} />}/>
          </Routes>
          
        </div>
    </>
  );
}

export default App;
