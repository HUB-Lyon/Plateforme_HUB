import React from 'react';
import Link from 'next/link';
import { CheckCircleIcon, PhotoIcon } from '@heroicons/react/24/solid';
import { useFormik } from 'formik';
import Image from 'next/image';

const CreateProject: React.FC = () => {
    const projectDescriptionMaxLength = 1500;

    const formik = useFormik({
        initialValues: {
            projectName: '',
            aboutProject: '',
            selectedFile: null,
            listOfParticipant: [] as string[],
            newList: '',
            material: [] as string[],
            newMaterial: '',
        },
        onSubmit: async (values) => {
            console.log(values.selectedFile);
            try {
                await fetch('http://localhost:3000/projects', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: values.projectName,
                        description: values.aboutProject,
                        image: values.selectedFile,
                        member_id: values.listOfParticipant,
                        leader_id: '321',
                        status: 'azezd',
                    }),
                });
            } catch (error) {
                console.log(error);
            }
        },
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

    const addParticipant = () => {
        if (formik.values.newList.trim() !== '') {
            formik.setFieldValue('listOfParticipant', [...formik.values.listOfParticipant, formik.values.newList]);
            formik.setFieldValue('newList', '');
        }
    };

    const removeParticipant = (email: string) => {
        const updatedParticipants = formik.values.listOfParticipant.filter(participant => participant !== email);
        formik.setFieldValue('listOfParticipant', updatedParticipants);
    };

    const addMaterial = () => {
        if (formik.values.newMaterial.trim() !== '') {
            formik.setFieldValue('material', [...formik.values.material, formik.values.newMaterial]);
            formik.setFieldValue('newMaterial', '');
        }
    };

    const removeMaterial = (index: number) => {
        formik.setFieldValue('material', formik.values.material.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col items-center mt-24 mb-24">
            <div className="w-4/5 bg-white rounded-lg shadow-lg h-auto p-10">
                <form onSubmit={formik.handleSubmit}>
                    <div className="flex flex-col md:flex-row items-start">
                        <div className="md:col-span-3 mb-4 md:mb-0">
                            <label htmlFor="project-name" className="block text-sm font-medium leading-6 text-gray-900">
                                Project name
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    id="project-name"
                                    name="projectName"
                                    className="p-1 block w-full md:w-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:text-sm md:leading-6"
                                    value={formik.values.projectName}
                                    onChange={formik.handleChange}
                                />
                            </div>
                        </div>

                        <div className="md:col-span-3 md:ml-12 lg:ml-20">
                            <label htmlFor="listOfParticipant" className="block text-sm font-medium leading-6 text-gray-900">
                                List of participants
                            </label>
                            <div className="flex mt-2 ">
                                <input
                                    type="text"
                                    id="listOfParticipant"
                                    name="newList"
                                    className="mr-2 p-1 block w-full md:w-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:text-sm md:leading-6"
                                    value={formik.values.newList}
                                    onChange={formik.handleChange}
                                    onKeyDown={(e) => handleKeyDown(e, addParticipant)}
                                />
                                <button type="button" className="bg-blue-500 text-white text-sm p-1 rounded-md" onClick={addParticipant}>
                                    Add
                                </button>
                            </div>
                            <div className="mt-2 break-all">
                                {formik.values.listOfParticipant.map((guest, index) => (
                                    <div key={index} className="text-sm">
                                        {guest}
                                        <button type="button" className="text-red-500 ml-5" onClick={() => removeParticipant(guest)}>
                                            Cancel
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-start mt-10">
                        <div className="col-span-full mb-4 md:mb-0">
                            <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                                About the project
                            </label>
                            <div className="mt-2">
                                <textarea
                                    id="about"
                                    name="aboutProject"
                                    rows={10}
                                    maxLength={projectDescriptionMaxLength}
                                    className="p-1 block w-full md:w-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:text-sm md:leading-6"
                                    value={formik.values.aboutProject}
                                    onChange={formik.handleChange}
                                />
                            </div>
                            <p className="text-sm text-gray-500">{`${formik.values.aboutProject.length}/${projectDescriptionMaxLength} characters`}</p>
                        </div>

                        <div className="md:col-span-3 md:ml-12 lg:ml-20">
                            <label htmlFor="material" className="block text-sm font-medium leading-6 text-gray-900">
                                Materials
                            </label>
                            <div className="flex mt-2">
                                <input
                                    type="text"
                                    id="material"
                                    name="newMaterial"
                                    className="mr-2 p-1 block w-full md:w-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:text-sm md:leading-6"
                                    value={formik.values.newMaterial}
                                    onChange={formik.handleChange}
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
        </div>
    );
};

export default CreateProject;
