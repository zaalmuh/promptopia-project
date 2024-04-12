'use client';
import React, { useEffect, useState } from 'react';
import PromptCard from './PromptCard';

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard key={post._id} post={post} handleTagClick={handleTagClick} />
      ))}
    </div>
  );
};

export default function Feed() {
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchedResult, setSearchedResult] = useState([]);
  const [posts, setPosts] = useState([]);

  const handleTagClick = (tagName) => {
    setSearchText(tagName);
    setSearchedResult(filterPosts(tagName));
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPosts(e.target.value);
        setSearchedResult(searchResult);
      }, 500)
    );
  };

  const filterPosts = (text) => {
    const regex = new RegExp(text, 'i');
    return posts.filter((post) => {
      return regex.test(post.creator.username) || regex.test(post.tag) || regex.test(post.prompt);
    });
  };

  const fetchPosts = async () => {
    const response = await fetch('/api/prompt');
    const data = await response.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <section className="feed">
      <form className="relative w-full flex-center" onSubmit={(e) => e.preventDefault()}>
        <input className="search_input peer" type="text" placeholder="Search for a tag or a username" value={searchText} onChange={handleSearchChange} required />
      </form>
      {searchText ? <PromptCardList data={searchedResult} handleTagClick={handleTagClick} /> : <PromptCardList data={posts} handleTagClick={handleTagClick} />}
    </section>
  );
}
