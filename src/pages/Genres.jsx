import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiUrl } from '../config/config';

const Genres = () => {
  const { genreId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genreName, setGenreName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenreItems = async () => {
      try {
        const res = await fetch(`${apiUrl}/list-genre-items/${genreId}`, {
          credentials: 'include',
        });
        const data = await res.json();

        if (res.ok) {
          setItems(data.items);
          if (data.items.length > 0) {
            setGenreName(data.items[0].genre_name);
          }
        } else {
          console.error('Failed to fetch genre items:', data.error);
        }
      } catch (err) {
        console.error('Error fetching genre items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGenreItems();
  }, [genreId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ color: '#f60000' }}>{genreName || 'Genre'} Items</h1>
      {items.length === 0 ? (
        <p>No items found for this genre.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1.5rem',
            marginTop: '1rem',
          }}
        >
          {items.map((item) => (
            <div
              key={`${item.item_id}-${item.category}`}
              onClick={() => navigate(`/details/${item.category}/${item.item_id}`)}
              style={{
                backgroundColor: '#1c1c1c',
                padding: '1rem',
                borderRadius: '12px',
                color: 'white',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <img
                src={item.image_url}
                alt={item.title}
                style={{
                  width: '100%',
                  height: '300px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
              <h3 style={{ marginTop: '0.75rem', textAlign: 'center' }}>{item.title}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Genres;
