import React, { useState, useEffect } from 'react';
import matter from 'gray-matter';
import MarkdownView from 'react-showdown';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import {
    TrashIcon,
    PlusIcon,
} from '@heroicons/react/24/outline';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const STORAGE_KEY = 'ARTICLE';

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
  articlesData: Array<{ content: string; frontmatter: { title: string; date: string }; name: string; id: number }>;
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
    fetch(`http://localhost:3000/article/${id}`, options);
}

function addArticle(name: string, content: string) {
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
    fetch('http://localhost:3000/article/', options);
}

const Article: React.FC<ArticleProps> = ({ articlesData }) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [value, setValue] = useState('');
    useEffect(() => {
        setValue(localStorage.getItem(STORAGE_KEY) || '');
    }, []);
    const update = (newValue: string) => {
        localStorage.setItem(STORAGE_KEY, newValue);
        setValue(newValue);
    };

    return (
        <div>
            <h1 id="openModal" className="text-7xl text-center mb-6 font-bold">Articles</h1>
            <button onClick={handleOpen} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded ml-8" ><PlusIcon className="lg:w-9 lg:h-9 md:w-7 md:h-7 sm:w-5 sm:h-5 w-5 h-5 inline-block"/> Add
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
                        onClick={() => {
                            addArticle('test', value);
                            setOpen(false);
                            update('');
                        }}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6" >Add Article</button>
                </Box>
            </Modal>
            <div className="markdown flex flex-col items-center gap-y-10 mb-10">
                {articlesData.map(({ content, frontmatter, id}, index) => (
                    <div key={index} className="group markdown">
                        <h1>{frontmatter.title}</h1>
                        <p>{frontmatter.date}</p>
                        <div className="flex-box w-full md:px-8 px-4 md:py-8 py-4 relative">
                            <MarkdownView
                                markdown={content}
                                options={{ tables: true, emoji: true }}
                                flavor="github"
                            />
                            <button
                                onClick={() => {
                                    deleteArticle(id);
                                }}
                                className="py-2 px-4 rounded absolute right-0 top-0">
                                <TrashIcon className="group-hover:text-red-500 lg:text-white xl:text-white text-red-500 lg:w-9 lg:h-9 md:w-7 md:h-7 sm:w-5 sm:h-5 w-5 h-5"/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export async function getStaticProps() {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const result = await fetch('http://localhost:3000/article/', options);
    const articles = await result.json();

    const articlesData = articles.map((article: ArticleData) => {
        const { content, data } = matter(article);
        const name = article.name;
        const id = article.id;
        return {
            content,
            frontmatter: data,
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
