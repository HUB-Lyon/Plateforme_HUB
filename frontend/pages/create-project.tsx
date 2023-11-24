import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import { PhotoIcon } from '@heroicons/react/24/solid'
import { useFormik } from 'formik';

interface CreateProjectProps {}

const CreateProject: React.FC<CreateProjectProps> = () => {
    const maxCharacterLimit = 20;
    const [materialsList, setMaterialsList] = useState<string[]>([]);

    const formik = useFormik({
        initialValues: {
            projectName: '',
            aboutProject: '',
            selectedFile: null,
            listOfParticipant: [] as string[],
            newList: '',
            material: [] as string[],
            newMaterial: '',
            error: '',
        },
        onSubmit: (values) => {
          // Handle form submission
        },
    });

    const handleAboutProjectChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const inputValue = e.target.value;
        if (inputValue.length <= maxCharacterLimit) {
            formik.setFieldValue('aboutProject', inputValue);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.currentTarget.files?.[0];
        formik.setFieldValue('selectedFile', file);
    };

    const addParticipant = () => {
        if (formik.values.newList.trim() !== '') {
            formik.setFieldValue('listOfParticipant', [...formik.values.listOfParticipant, formik.values.newList]);
            formik.setFieldValue('newList', '');
        }
    };

    const removeParticipant = (index: number) => {
        formik.setFieldValue('listOfParticipant', formik.values.listOfParticipant.filter((_, i) => i !== index));
    };

    const isMaterialValid = (material: string) => {
        return materialsList.includes(material);
    };

    const addMaterial = () => {
        if (formik.values.newMaterial.trim() !== '' && isMaterialValid(formik.values.newMaterial)) {
            formik.setFieldValue('material', [...formik.values.material, formik.values.newMaterial]);
            formik.setFieldValue('newMaterial', '');
            formik.setFieldValue('error', '');
        } else {
            formik.setFieldValue('error', 'This material is not available');
        }
    };

    useEffect(() => {
        // To be changed with the real path that the backend provides
        fetch('/test.json')
            .then((response) => response.json())
            .then((data) => {
              const materialsList = data.participant.map((participant: any) => participant.name);
              setMaterialsList(materialsList);
            })
            .catch((error) => console.error('Error during materials loading:', error));
    }, []);

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
                                />
                                <button type="button" className="bg-blue-500 text-white text-sm p-1 rounded-md" onClick={addParticipant}>
                                    Add
                                </button>
                            </div>
                            <div className="mt-2 break-all">
                                {formik.values.listOfParticipant.map((guest, index) => (
                                    <div key={index} className="text-sm">
                                        {guest}
                                        <button type="button" className="text-red-500 ml-5" onClick={() => removeParticipant(index)}>
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
                                    rows={4}
                                    className="p-1 block w-full md:w-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:text-sm md:leading-6"
                                    value={formik.values.aboutProject}
                                    onChange={handleAboutProjectChange}
                                />
                            </div>
                            <p className="text-sm text-gray-500">{`${formik.values.aboutProject.length}/${maxCharacterLimit} characters`}</p>
                        </div>

                        <div className="md:col-span-3 md:ml-12 lg:ml-20">
                            <label htmlFor="material" className="block text-sm font-medium leading-6 text-gray-900">
                                Material
                            </label>
                            <div className="flex mt-2">
                                <input
                                    type="text"
                                    id="material"
                                    name="newMaterial"
                                    className="mr-2 p-1 block w-full md:w-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:text-sm md:leading-6"
                                    value={formik.values.newMaterial}
                                    onChange={formik.handleChange}
                                />
                                <button type="button" className="bg-blue-500 text-white text-sm p-1 rounded-md" onClick={addMaterial}>
                                    Add
                                </button>
                            </div>
                            <div className="mt-2 text-sm">
                                <p className="text-red-500">{formik.values.error}</p>
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
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                            <div className="text-center">
                                <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                        <span>Upload a file</span>
                                        <input id="file-upload" type="file" className="sr-only" onChange={(e) => handleFileChange(e)} />
                                    </label>
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
