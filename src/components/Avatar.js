import React, { useState, useEffect } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const Avatar = ({ imagePath }) => {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            const storage = getStorage();
            const pathReference = ref(storage, imagePath);

            try {
                const url = await getDownloadURL(pathReference);
                setImageUrl(url);
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        };

        fetchImage();
    }, [imagePath]);

    return imageUrl ? <img src={imageUrl} alt="Avatar" /> : <p>Loading...</p>;
};

export default Avatar;

