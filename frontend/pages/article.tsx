import React, { useState, useEffect, Fragment} from 'react';
import matter from 'gray-matter';
import MarkdownView from 'react-showdown';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { API_URL } from '../config.js';
import { Dialog, Transition} from '@headlessui/react';
import {
    TrashIcon,
    PlusIcon,
    PencilIcon,
} from '@heroicons/react/24/outline';

const admin = true;

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

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

    return (
        <div>
            <h1 id="openModal" className="text-4xl text-center font-bold">Articles</h1>
            { admin && (<button onClick={handleOpenAdd} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded ml-8 flex items-center" ><PlusIcon className="lg:w-9 lg:h-9 md:w-7 md:h-7 sm:w-5 sm:h-5 w-5 h-5 inline-block"/> Add
            </button>)}
            <Transition show={openAdd} as={Fragment}>
                <Dialog onClose={handleCloseAdd} className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                            Add Article
                                            </Dialog.Title>
                                            <div className="mt-2 w-full">
                                                <ReactQuill
                                                    theme="snow"
                                                    value={valueAdd}
                                                    onChange={updateAdd}
                                                    className="h-full w-full text-black"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        onClick={async () => {
                                            const response = await addArticle(`Article_${new Date().toISOString()}`, valueAdd);
                                            const newarticle = await response.json();
                                            setArticlesData(old => [...old, newarticle]);
                                            setOpenAdd(false);
                                            updateAdd('');
                                        }}
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                    Add Article
                                    </button>
                                    <button
                                        onClick={handleCloseAdd}
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                    Cancel
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
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
                            <Transition show={openPatch} as={Fragment}>
                                <Dialog onClose={handleClosePatch} className="fixed z-10 inset-0 overflow-y-auto">
                                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                        <Transition.Child
                                            as={Fragment}
                                            enter="ease-out duration-300"
                                            enterFrom="opacity-0"
                                            enterTo="opacity-100"
                                            leave="ease-in duration-200"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                                        </Transition.Child>
                                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                                        &#8203;
                                        </span>
                                        <Transition.Child
                                            as={Fragment}
                                            enter="ease-out duration-300"
                                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                                            leave="ease-in duration-200"
                                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                        >
                                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                                    <div className="sm:flex sm:items-start">
                                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                            <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                                            Patch Article
                                                            </Dialog.Title>
                                                            <div className="mt-2 w-full">
                                                                <ReactQuill
                                                                    theme="snow"
                                                                    value={valuePatch}
                                                                    onChange={updatePatch}
                                                                    className="h-full w-full text-black"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                                    <button
                                                        onClick={async () => {
                                                            const response = await patchArticle(id, name, valuePatch);
                                                            const updatedarticle = await response.json();
                                                            setArticlesData(old => old.map(article => (article.id === id ? updatedarticle : article)));
                                                            setOpenPatch(false);
                                                            updatePatch('');
                                                        }}
                                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-500 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                                    >
                                                    Edit Article
                                                    </button>
                                                    <button
                                                        onClick={handleClosePatch}
                                                        type="button"
                                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                                    >
                                                    Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </Transition.Child>
                                    </div>
                                </Dialog>
                            </Transition>
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
