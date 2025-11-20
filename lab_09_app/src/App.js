import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State for Adding/Editing
  const [formData, setFormData] = useState({ title: '', description: '', urlToImage: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // --- 1. GET Operation (Fetch Data) ---
  useEffect(() => {
    const fetchNews = async () => {
      try {
        // ACCESSING THE VARIABLE FROM .ENV FILE
        const apiKey = process.env.REACT_APP_NEWS_API_KEY; 

        if (!apiKey) {
            console.error("API Key is missing! Check your .env file.");
        }

        // Fetching Top Headlines
        const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Add a unique ID to each article for CRUD operations
        const formattedArticles = data.articles.map((art, index) => ({
          ...art,
          id: index + Date.now(), 
          urlToImage: art.urlToImage || 'https://via.placeholder.com/300x200?text=No+Image'
        }));
        
        setArticles(formattedArticles);
        setLoading(false);
      } catch (err) {
        console.log("Switching to fallback data due to:", err.message);
        // Fallback data logic
        setArticles([
          { id: 1, title: 'Project Demo News 1', description: 'This is fallback data because NewsAPI blocks free-tier requests from GitHub Pages.', urlToImage: 'https://via.placeholder.com/300x200?text=Demo+1' },
          { id: 2, title: 'Project Demo News 2', description: 'You can still Edit, Delete, and Add new items to test the UI.', urlToImage: 'https://via.placeholder.com/300x200?text=Demo+2' },
          { id: 3, title: 'React CRUD Lab', description: 'The system allows full Create, Read, Update, and Delete simulation.', urlToImage: 'https://via.placeholder.com/300x200?text=Lab+Work' }
        ]);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // --- 2. POST Operation (Add Data) ---
  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return alert("Please fill in fields");

    const newArticle = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      urlToImage: formData.urlToImage || 'https://via.placeholder.com/300x200?text=New+Post'
    };

    setArticles([newArticle, ...articles]);
    setFormData({ title: '', description: '', urlToImage: '' });
  };

  // --- 3. PUT Operation (Update Data) ---
  const startEdit = (article) => {
    setIsEditing(true);
    setEditId(article.id);
    setFormData({ 
      title: article.title, 
      description: article.description, 
      urlToImage: article.urlToImage 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedArticles = articles.map((art) => 
      art.id === editId ? { ...art, ...formData } : art
    );
    setArticles(updatedArticles);
    setIsEditing(false);
    setEditId(null);
    setFormData({ title: '', description: '', urlToImage: '' });
  };

  // --- 4. DELETE Operation ---
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this news?")) {
      const filteredArticles = articles.filter((art) => art.id !== id);
      setArticles(filteredArticles);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>📰 Daily News Feed</h1>
      </header>

      <div className="form-container">
        <h2>{isEditing ? 'Edit News' : 'Add News'}</h2>
        <form onSubmit={isEditing ? handleUpdate : handleAdd}>
          <input 
            type="text" 
            placeholder="News Title" 
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})} 
            required
          />
          <input 
            type="text" 
            placeholder="Image URL (optional)" 
            value={formData.urlToImage} 
            onChange={e => setFormData({...formData, urlToImage: e.target.value})} 
          />
          <textarea 
            placeholder="News Description" 
            value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})} 
            required
          />
          <button className={isEditing ? "btn-update" : "btn-add"} type="submit">
            {isEditing ? 'Update News' : 'Post News'}
          </button>
          {isEditing && <button className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>}
        </form>
      </div>

      <div className="news-grid">
        {loading ? <p>Loading News...</p> : articles.map((article) => (
          <div key={article.id} className="news-card">
            <img src={article.urlToImage} alt="news" className="card-img" />
            <div className="card-body">
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              <div className="card-actions">
                <button className="btn-edit" onClick={() => startEdit(article)}>Edit</button>
                <button className="btn-delete" onClick={() => handleDelete(article.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;