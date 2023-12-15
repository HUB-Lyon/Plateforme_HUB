import React, { useState, useEffect} from 'react';
import matter from 'gray-matter';
import MarkdownView from 'react-showdown';
import { API_URL } from '../config.js';
import {
    TrashIcon,
    PlusIcon,
    PencilIcon,
} from '@heroicons/react/24/outline';
import DialogComponent from '../components/dialog';

const admin = true;

const STORAGE_KEY = 'ARTICLE_POST';
const STORAGE_KEY2 = 'ARTICLE_PATCH';

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
    const [openAdd, setOpenAdd] = useState(false);
    const handleOpenAdd = () => setOpenAdd(true);
    const handleCloseAdd = () => setOpenAdd(false);

    const [valueAdd, setValueAdd] = useState('');
    useEffect(() => {
        setValueAdd(localStorage.getItem(STORAGE_KEY) || '');
    }, []);
    const updateAdd = (newValue: string) => {
        localStorage.setItem(STORAGE_KEY, newValue);
        setValueAdd(newValue);
    };

    const [openPatch, setOpenPatch] = useState(false);
    const handleOpenPatch = (content: string) => {
        setValuePatch(content);
        setOpenPatch(true);
    };
    const handleClosePatch = () => setOpenPatch(false);

    const [valuePatch, setValuePatch] = useState('');
    useEffect(() => {
        setValuePatch(localStorage.getItem(STORAGE_KEY2) || '');
    }, []);
    const updatePatch = (newValue: string) => {
        localStorage.setItem(STORAGE_KEY2, newValue);
        setValuePatch(newValue);
    };

    const [articlesData, setArticlesData] = useState(initialArticlesData);

    async function addaction (value: string) {
        const response = await addArticle(`Article_${new Date().toISOString()}`, value);
        const newarticle = await response.json();
        setArticlesData(old => [...old, newarticle]);
        setOpenAdd(false);
        updateAdd('');
    }

    async function patchaction (value: string, id: number, name: string) {
        const response = await patchArticle(id, name, value);
        const updatedarticle = await response.json();
        setArticlesData(old => old.map(article => (article.id === id ? updatedarticle : article)));
        setOpenPatch(false);
        updatePatch('');
    }

    return (
        <div>
            <h1 id="openModal" className="text-4xl text-center font-bold">Articles</h1>
            { admin && (<button onClick={handleOpenAdd} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded ml-8 flex items-center" ><PlusIcon className="lg:w-9 lg:h-9 md:w-7 md:h-7 sm:w-5 sm:h-5 w-5 h-5 inline-block"/> Add
            </button>)}
            <DialogComponent open={openAdd} title='Add Article' onClose={handleCloseAdd} value={valueAdd} update={updateAdd} action={() => addaction(valueAdd)}/>
            <div className="markdown flex flex-col items-center gap-y-10 mb-10">
                {articlesData.map(({ content, id, name}, index) => (
                    <div key={index} className="group markdown">
                        <div className="flex-box w-full md:px-8 px-4 md:py-8 py-4 relative">
                            <MarkdownView
                                markdown={content}
                                options={{ tables: true, emoji: true }}
                                flavor="github"
                            />
                            { admin && (<button
                                onClick={() => {
                                    deleteArticle(id);
                                    setArticlesData(old => old.filter(article => article.id !== id));
                                }}
                                className="py-2 px-4 rounded absolute right-0 top-0">
                                <TrashIcon className="group-hover:text-red-500 lg:text-white xl:text-white text-red-500 lg:w-9 lg:h-9 md:w-7 md:h-7 sm:w-5 sm:h-5 w-5 h-5"/>
                            </button>)}
                            { admin && (<button
                                onClick={() => handleOpenPatch(content)}
                                className="py-2 px-4 rounded absolute right-0 bottom-0">
                                <PencilIcon className="group-hover:text-orange-500 lg:text-white xl:text-white text-orange-500 lg:w-9 lg:h-9 md:w-7 md:h-7 sm:w-5 sm:h-5 w-5 h-5"/>
                            </button>)}
                            <DialogComponent open={openPatch} title='Edit Article' onClose={handleClosePatch} value={valuePatch} update={updatePatch} action={() => patchaction(valuePatch, id, name)}/>
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
