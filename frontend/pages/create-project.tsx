import Link from 'next/link';
import Image from 'next/image';
import * as Yup from 'yup';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { CheckCircleIcon, PhotoIcon } from '@heroicons/react/24/solid';
import { API_URL } from './../config';
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

    const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>, action: () => void) => {
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

    const renderFileUploadLabel = () => {
        if (formik.values.selectedFile) {
            return (
                <>
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" aria-hidden="true" />
                    <span>Upload complete</span>
                </>
            );
        } else {
            return <span>Upload a file</span>;
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
                const formData = new FormData();
                formData.append('name', values.name);
                formData.append('description', values.description);
                formData.append('selectedFile', values.selectedFile);
                values.members.forEach((member, index) => {
                    formData.append(`members[${index}]`, member);
                });
                values.material.forEach((material, index) => {
                    formData.append(`material[${index}]`, material);
                });
                const response = await fetch(`${API_URL}/projects`, {
                    method: 'POST',
                    body: formData,
                });
                if (!response.ok)
                    toast.error(`HTTP error! Status: ${response.status}`, );
                else {
                    toast.success('Your project has been created!');
                    formik.resetForm();
                }
            } catch (error: unknown) {
                toast.error(`An error occurred: ${error}`);
            }
        },
    });

    const buttonBox = 'w-full px-3 py-2 md:w-auto text-sm text-white font-semibold shadow-sm rounded-md focus-visible:outline-2 focus-visible:outline-offset-2';
    const label = 'block text-sm font-medium leading-6 text-gray-900';

    return (
        <div className="flex flex-col items-center mt-24 mb-24">
            <div className="w-4/5 bg-white rounded-lg shadow-lg h-auto p-10">
                <form onSubmit={formik.handleSubmit}>
                    <div className="flex flex-col md:flex-row items-start">
                        <div className="md:col-span-3 mb-4 md:mb-0">
                            <label htmlFor="name" className={`${label}`}>
                                Project name
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="form-box"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onKeyDown={(e) => handleEnterKey(e, () => {})}
                                />
                                {formik.touched.name && formik.errors.name && (
                                    <p className="text-red-500 mt-2 md:text-sm">{formik.errors.name}</p>
                                )}
                            </div>
                        </div>

                        <div className="md:col-span-3 md:ml-12 lg:ml-20">
                            <label htmlFor="members" className={`${label}`}>
                                Members
                            </label>
                            <div className="flex mt-2">
                                <input
                                    type="text"
                                    id="members"
                                    name="newMembers"
                                    className="mr-2 form-box"
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
                            <label htmlFor="description" className={`${label}`}>
                                Description
                            </label>
                            <div className="mt-2">
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={10}
                                    maxLength={projectDescriptionMaxLength}
                                    className="form-box"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                />
                            </div>
                            <p className="text-sm text-gray-500">{`${formik.values.description.length}/${projectDescriptionMaxLength} characters`}</p>
                            {formik.touched.description && formik.errors.description && (
                                <p className="text-red-500 mt-2 md:text-sm">{formik.errors.description}</p>
                            )}
                        </div>

                        <div className="md:col-span-3 md:ml-12 lg:ml-20">
                            <label htmlFor="material" className={`${label}`}>
                                Materials
                            </label>
                            <div className="flex mt-2">
                                <input
                                    type="text"
                                    id="material"
                                    name="newMaterials"
                                    className="mr-2 form-box"
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
                        <label htmlFor="cover-photo" className={`${label}`}>
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
                                    <label htmlFor="file-upload" className="file-uploader flex items-center">
                                        {renderFileUploadLabel()}
                                        <input id="file-upload" type="file" className="sr-only" onChange={(e) => handleFileChange(e)} multiple accept="image/*" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-24 flex flex-col items-center justify-end gap-y-4 md:flex-row md:items-center md:justify-end md:gap-x-6">
                        <Link href="/project">
                            <button type="button" className={`bg-red-600 hover:bg-red-500 focus-visible:outline-red-600 ${buttonBox}`}>
                                Cancel
                            </button>
                        </Link>
                        <button type="submit" className={`bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600 ${buttonBox}`}>
                            Create Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProject;
