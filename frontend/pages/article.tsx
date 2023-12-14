import React, { useState, useEffect } from 'react';
import matter from 'gray-matter';
import MarkdownView from 'react-showdown';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { API_URL } from '../config.js';
import {
    TrashIcon,
    PlusIcon,
    PencilIcon,
} from '@heroicons/react/24/outline';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const STORAGE_KEY = 'ARTICLE_POST';
const STORAGE_KEY2 = 'ARTICLE_PATCH';

const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '0.8',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

interface ArticleProps {
  articlesData: Array<{ content: string; name: string; id: number }>;
}

interface ArticleData {
    id: number;
    name: string;
    content: string;
}

function deleteArticle(id: number) {
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    fetch(`${API_URL}/article/${id}`, options);
}

async function addArticle(name: string, content: string){
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body:
            JSON.stringify({
                name: name,
                content: content,
            }),
    };
    return fetch(`${API_URL}/article/`, options);
}

function patchArticle(id: number, name: string, content: string) {
    const options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body:
            JSON.stringify({
                name: name,
                content: content,
            }),
    };
    return fetch(`${API_URL}/article/${id}`, options);
}

const Article: React.FC<ArticleProps> = ({ articlesData: initialArticlesData }) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [open2, setOpen2] = useState(false);
    const handleOpen2 = (content: string) => {
        setValue2(content);
        setOpen2(true);
    };
    const handleClose2 = () => setOpen2(false);

    const [value, setValue] = useState('');
    useEffect(() => {
        setValue(localStorage.getItem(STORAGE_KEY) || '');
    }, []);
    const update = (newValue: string) => {
        localStorage.setItem(STORAGE_KEY, newValue);
        setValue(newValue);
    };

    const [value2, setValue2] = useState('');
    useEffect(() => {
        setValue2(localStorage.getItem(STORAGE_KEY2) || '');
    }, []);
    const update2 = (newValue: string) => {
        localStorage.setItem(STORAGE_KEY2, newValue);
        setValue2(newValue);
    };

    const [articlesData, setArticlesData] = useState(initialArticlesData);

    return (
        <div>
            <h1 id="openModal" className="text-4xl text-center font-bold">Articles</h1>
            <button onClick={handleOpen} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded ml-8 flex items-center" ><PlusIcon className="lg:w-9 lg:h-9 md:w-7 md:h-7 sm:w-5 sm:h-5 w-5 h-5 inline-block"/> Add
            </button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} >
                    <ReactQuill
                        theme="snow"
                        value={value}
                        onChange={update}
                        className="h-full text-black"
                    />
                    <button
                        onClick={async () => {
                            const response = await addArticle(`Article_${new Date().toISOString()}`, value);
                            const newarticle = await response.json();
                            setArticlesData(old => [...old, newarticle]);
                            setOpen(false);
                            update('');
                        }}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6" >Add Article</button>
                </Box>
            </Modal>
            <div className="markdown flex flex-col items-center gap-y-10 mb-10">
                {articlesData.map(({ content, id, name}, index) => (
                    <div key={index} className="group markdown">
                        <div className="flex-box w-full md:px-8 px-4 md:py-8 py-4 relative">
                            <MarkdownView
                                markdown={content}
                                options={{ tables: true, emoji: true }}
                                flavor="github"
                            />
                            <button
                                onClick={() => {
                                    deleteArticle(id);
                                    setArticlesData(old => old.filter(article => article.id !== id));
                                }}
                                className="py-2 px-4 rounded absolute right-0 top-0">
                                <TrashIcon className="group-hover:text-red-500 lg:text-white xl:text-white text-red-500 lg:w-9 lg:h-9 md:w-7 md:h-7 sm:w-5 sm:h-5 w-5 h-5"/>
                            </button>
                            <button
                                onClick={() => handleOpen2(content)}
                                className="py-2 px-4 rounded absolute right-0 bottom-0">
                                <PencilIcon className="group-hover:text-orange-500 lg:text-white xl:text-white text-orange-500 lg:w-9 lg:h-9 md:w-7 md:h-7 sm:w-5 sm:h-5 w-5 h-5"/>
                            </button>
                            <Modal
                                open={open2}
                                onClose={handleClose2}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={style} >
                                    <ReactQuill
                                        theme="snow"
                                        value={value2}
                                        onChange={update2}
                                        className="h-full text-black"
                                    />
                                    <button
                                        onClick={async () => {
                                            const response = await patchArticle(id, name, value2);
                                            const updatedarticle = await response.json();
                                            setArticlesData(old => old.map(article => (article.id === id ? updatedarticle : article)));
                                            setOpen2(false);
                                            update2('');
                                        }}
                                        className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mt-6" >Edit Article</button>
                                </Box>
                            </Modal>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export async function getServerSideProps() {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const result = await fetch(`${API_URL}/article/`, options);
    const articles = await result.json();

    const articlesData = articles.map((article: ArticleData) => {
        const { content } = matter(article);
        const name = article.name;
        const id = article.id;
        return {
            content,
            name,
            id,
        };
    });

    return {
        props: {
            articlesData,
        },
    };
}

export default Article;
