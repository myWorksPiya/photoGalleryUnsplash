import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import Photos from './Photos';

const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;
const baseUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

function App() {
	const [ loading, setLoading ] = useState(false);
	const [ images, setImages ] = useState([]);
	const [ page, setPage ] = useState(0);
	const [ query, setQuery ] = useState('');
	
	const fetchImages = async () => {
		setLoading(true);
		let url;
		const urlPage = `&page=${page}`;
		const urlQuery = `&query=${query}`;
		//console.log(page);

		if (query) {
			url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
		} else {
			url = `${baseUrl}${clientID}${urlPage}`;
		}
		try {
			const response = await fetch(url)
			const data = await response.json()
			setImages((oldImages) => {
				if (query && page === 1) {
					return data.results
				} else if (query) {
					return [ ...oldImages, ...data.results ]
				} else {
					return [ ...oldImages, ...data ]
				}
			})
			setLoading(false);
		} catch (err) {
			console.log(err);
			setLoading(false);
		}
	};
	useEffect(() => {
			fetchImages()
			// eslint-disable-next-line 
		},[page])
	useEffect(() => {
		const event = window.addEventListener('scroll', () => {
			if ((!loading && window.innerHeight + window.scrollY) >= document.body.scrollHeight - 2) {
				setPage((oldPage) => {
					return oldPage + 1;
				})
			}	
		})
		return () => window.removeEventListener('scroll', event)
		// eslint-disable-next-line 
	}, [])
	const handleSubmit = (event) => {
		event.preventDefault()
		//fetchImages()
		setPage(1)		
	}

	return (
		<main>
			<section className='search'>
				<h1 className='title'>Photo Gallery</h1>
				<form className='search-form' value={query} onChange={(e) => setQuery(e.target.value)}>
					<input type='text' placeholder='search here for images' className='form-input' />
					<button type='submit' className='submit-btn' onClick={handleSubmit}>
						<FaSearch />
					</button>
				</form>
			</section>
			<section className='photos'>
				<div className='photo-center'>
					{images.map((image) => {
						//console.log(image);
						return <Photos key={image.id} {...image} />;
					})}
				</div>
				{loading && <h2 className='loading'>Loading....</h2>}
			</section>
		</main>
	);
}

export default App;
