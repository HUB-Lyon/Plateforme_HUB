import Link from 'next/link';
import Image from 'next/image';
import * as Yup from 'yup';
import React, {useState} from 'react';
import {API_URL} from './../config';
import { CheckCircleIcon, PhotoIcon } from '@heroicons/react/24/solid';
import { useFormik } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateProject: React.FC = () => {
    const projectDescriptionMaxLength = 1500;
    const [newMembers, setNewMember] = useState('');
    const [newMaterials, setNewMaterials] = useState('');

    const validationSchema = Yup.object({
        name: Yup.string().required('The project name field is necessary!'),
        description: Yup.string().required('The description field is necessary!'),
    });

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        action: () => void
    ) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            action();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.currentTarget.files?.[0];

        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const base64Data = event.target?.result as string;
                formik.setFieldValue('selectedFile', base64Data);
            };
        }
    };

    const addMembers = () => {
        if (newMembers.trim() !== '') {
            formik.setFieldValue('members', [...formik.values.members, newMembers]);
            setNewMember('');
        }
    };

    const handleMemberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMember(e.currentTarget.value);
    };

    const removeMembers = (email: string) => {
        const updatedMembers = formik.values.members.filter(members => members !== email);
        formik.setFieldValue('members', updatedMembers);
    };

    const addMaterial = () => {
        if (newMaterials.trim() !== '') {
            formik.setFieldValue('material', [...formik.values.material, newMaterials]);
            setNewMaterials('');
        }
    };

    const handleMaterialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMaterials(e.currentTarget.value);
    };

    const removeMaterial = (index: number) => {
        formik.setFieldValue('material', formik.values.material.filter((_, i) => i !== index));
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            selectedFile: '',
            members: [] as string[],
            material: [] as string[],
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await fetch(`${API_URL}/projects`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        json: values,
                    }),
                });
                if (!response.ok)
                    throw new Error(`HTTP error! Status: ${response.status}`);
                toast.success('Your project has been created!', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: false,
                });
                formik.resetForm();
            } catch (error: unknown) {
                if (error instanceof Error) {
                    toast.error(`An error occurred: ${error.message}`, {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                    });
                } else {
                    toast.error('An unknown error occurred', {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                    });
                }
            }
        },
    });

    return (
        <div className="flex flex-col items-center mt-24 mb-24">
            <div className="w-4/5 bg-white rounded-lg shadow-lg h-auto p-10">
                <form onSubmit={formik.handleSubmit}>
                    <div className="flex flex-col md:flex-row items-start">
                        <div className="md:col-span-3 mb-4 md:mb-0">
                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                Project name
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="p-1 block w-full md:w-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:text-sm md:leading-6"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                                {formik.touched.name && formik.errors.name ? (
                                    <p className="text-red-500 mt-2 md:text-sm">{formik.errors.name}</p>
                                ) : null}
                            </div>
                        </div>

                        <div className="md:col-span-3 md:ml-12 lg:ml-20">
                            <label htmlFor="members" className="block text-sm font-medium leading-6 text-gray-900">
                                Members
                            </label>
                            <div className="flex mt-2 ">
                                <input
                                    type="text"
                                    id="members"
                                    name="newMembers"
                                    className="mr-2 p-1 block w-full md:w-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:text-sm md:leading-6"
                                    value={newMembers}
                                    onChange={handleMemberChange}
                                    onKeyDown={(e) => handleKeyDown(e, addMembers)}
                                />
                                <button type="button" className="bg-blue-500 text-white text-sm p-1 rounded-md" onClick={addMembers}>
                                    Add
                                </button>
                            </div>
                            <div className="mt-2 break-all">
                                {formik.values.members.map((guest, index) => (
                                    <div key={index} className="text-sm">
                                        {guest}
                                        <button type="button" className="text-red-500 ml-5" onClick={() => removeMembers(guest)}>
                                            Cancel
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-start mt-10">
                        <div className="col-span-full mb-4 md:mb-0">
                            <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                                Description
                            </label>
                            <div className="mt-2">
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={10}
                                    maxLength={projectDescriptionMaxLength}
                                    className="p-1 block w-full md:w-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:text-sm md:leading-6"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                />
                            </div>
                            <p className="text-sm text-gray-500">{`${formik.values.description.length}/${projectDescriptionMaxLength} characters`}</p>
                            {formik.touched.description && formik.errors.description ? (
                                <p className="text-red-500 mt-2 md:text-sm">{formik.errors.description}</p>
                            ) : null}
                        </div>

                        <div className="md:col-span-3 md:ml-12 lg:ml-20">
                            <label htmlFor="material" className="block text-sm font-medium leading-6 text-gray-900">
                                Materials
                            </label>
                            <div className="flex mt-2">
                                <input
                                    type="text"
                                    id="material"
                                    name="newMaterials"
                                    className="mr-2 p-1 block w-full md:w-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:text-sm md:leading-6"
                                    value={newMaterials}
                                    onChange={handleMaterialChange}
                                    onKeyDown={(e) => handleKeyDown(e, addMaterial)}
                                />
                                <button type="button" className="bg-blue-500 text-white text-sm p-1 rounded-md" onClick={addMaterial}>
                                    Add
                                </button>
                            </div>
                            <div className="mt-2 break-all">
                                {formik.values.material.map((material, index) => (
                                    <div key={index} className="text-sm">
                                        {material}
                                        <button className="text-red-500 ml-5" onClick={() => removeMaterial(index)}>
                                            Cancel
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="col-span-full mt-10">
                        <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                            Cover photo
                        </label>
                        <div className="mt-2 flex flex-col items-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                            <div className="text-center">
                                {formik.values.selectedFile ? (
                                    <>
                                        {formik.values.selectedFile && (
                                            <div className="mt-4">
                                                <Image src={formik.values.selectedFile} alt="Preview" width={100} height={100} className="h-auto w-52 rounded-lg" />
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                )}
                                <div className="mt-4 flex flex-col items-center text-sm leading-6 text-gray-600">
                                    {formik.values.selectedFile ? (
                                        <div className="flex items-center mb-2">
                                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" aria-hidden="true" />
                                            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                                <span>Upload complete</span>
                                                <input id="file-upload" type="file" className="sr-only" onChange={(e) => handleFileChange(e)} multiple accept="image/*"/>
                                            </label>
                                        </div>
                                    ) : (
                                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                            <span>Upload a file</span>
                                            <input id="file-upload" type="file" className="sr-only" onChange={(e) => handleFileChange(e)} multiple accept="image/*"/>
                                        </label>
                                    )}
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-24 flex flex-col items-center justify-end gap-y-4 md:flex-row md:items-center md:justify-end md:gap-x-6">
                        <button type="button" className="w-full md:w-auto rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                            <Link href="/project">
                                Cancel
                            </Link>
                        </button>
                        <button type="submit" className="w-full md:w-auto rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Create Project
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default CreateProject;
