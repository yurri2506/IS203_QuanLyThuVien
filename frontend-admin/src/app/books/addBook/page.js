import React from 'react'

function page() {
  return (
    <div>Add Book</div>
  )
}

export default page


/**
 * 'use client';
import React, { useState } from 'react';
import axios from 'axios';

const AddBookPage = () => {
    const [bookData, setBookData] = useState({
        tenSach: '',
        moTa: '',
        maTheLoai: '',
        maTacGia: '',
        maNXB: '',
        namXB: '',
        trongLuong: '',
        tinhTrang: '',
        soLTK: '',
        donGia: '',
        soLuongMuon: '',
    });
    const [images, setImages] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        setImages(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('book', JSON.stringify(bookData));

        for (let i = 0; i < images.length; i++) {
            formData.append('image', images[i]);
        }

        try {
            const response = await axios.post('http://localhost:8088/api/book/addBook', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
            // Handle successful response (e.g., show success message)
        } catch (error) {
            console.error('Error adding book:', error);
        }
    };

    return (
        <div>
            <h2>Add Book</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="tenSach"
                    placeholder="Tên sách"
                    value={bookData.tenSach}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="moTa"
                    placeholder="Mô tả"
                    value={bookData.moTa}
                    onChange={handleInputChange}
                />
                <input
                    type="file"
                    name="image"
                    multiple
                    onChange={handleImageChange}
                />
                <button type="submit">Add Book</button>
            </form>
        </div>
    );
};

export default AddBookPage;

 */