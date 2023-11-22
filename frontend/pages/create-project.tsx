import React, { useState, useEffect } from 'react';
import { PhotoIcon } from '@heroicons/react/24/solid'

function CreateProject() {
  const [projectName, setProjectName] = useState('');
  const [aboutProject, setAboutProject] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [material, setMaterial] = useState<string[]>([]);
  const [materialsList, setMaterialList] = useState<string[]>([]);
  const [newMaterial, setNewMaterial] = useState('');
  const [listOfParticipant, setLists] = useState<string[]>([]);
  const [newList, setNewList] = useState('');
  const [error, setError] = useState<string>('');
  const maxCharacterLimit = 1000;

  const handleAboutProjectChange = (e: any) => {
    const inputValue = e.target.value;
    if (inputValue.length <= maxCharacterLimit) {
      setAboutProject(inputValue);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const addParticipant = () => {
    if (newList.trim() !== '') {
      setLists([...listOfParticipant, newList]);
      setNewList('');
    }
  };
  const removeParticipant = (index: number) => {
    const updatedGuests = [...listOfParticipant];
    updatedGuests.splice(index, 1);
    setLists(updatedGuests);
  };

  useEffect(() => {
    // To be change with link to json real path that backend provide
    fetch('/test.json')
      .then(response => response.json())
      .then(data => setMaterialList(data.ingredients.map((ingredient: any) => ingredient.name)))
      .catch(error => console.error('Error during materials loading:', error));
  }, []);

  const isMaterialValid = (material: string) => {
    return materialsList.includes(material);
  };

  const addMaterial = () => {
    if (newMaterial.trim() !== '' && isMaterialValid(newMaterial)) {
      setMaterial([...material, newMaterial]);
      setNewMaterial('');
      setError('');
    } else {
      setError('');
      setTimeout(() => {
        setError('Invalid materials.');
      }, 50);
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  };

  const removeMaterial = (index: number) => {
    const updatedMaterials = [...material];
    updatedMaterials.splice(index, 1);
    setMaterial(updatedMaterials);
  };

  const handleButtonClick = () => {
    const formData = {
      projectName,
      aboutProject,
      listOfParticipant,
      material,
      selectedFile,
    };
    // To be removed (for test)
    console.log('Data retrieved:', formData);
    console.log('Data retrieved:', listOfParticipant);
    console.log('Data retrieved:', material);
    console.log('Selected File:', selectedFile);
  };

  return (
    <div className="flex flex-col items-center mt-24 mb-24">
      <div className="w-4/5 bg-white rounded-lg shadow-lg h-auto p-10">
        <div className="flex flex-col md:flex-row items-start">
          <div className="md:col-span-3 mb-4 md:mb-0">
            <label htmlFor="project-name" className="block text-sm font-medium leading-6 text-gray-900">
              Project name
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="project-name"
                className="p-1 block w-full md:w-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:text-sm md:leading-6"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
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
                className="mr-2 p-1 block w-full md:w-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:text-sm md:leading-6"
                value={newList}
                onChange={(e) => setNewList(e.target.value)}
              />
              <button className="bg-blue-500 text-white text-sm p-1 rounded-md" onClick={addParticipant}>
                Add
              </button>
            </div>
            <div className="mt-2 break-all">
              {listOfParticipant.map((guest, index) => (
                <div key={index} className="text-sm">
                  {guest}
                  <button className="text-red-500 ml-5" onClick={() => removeParticipant(index)}>
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
                rows={4}
                className="p-1 block w-full md:w-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:text-sm md:leading-6"
                value={aboutProject}
                onChange={handleAboutProjectChange}
              />
            </div>
            <p className="text-sm text-gray-500">{`${aboutProject.length}/${maxCharacterLimit} characters`}</p>
          </div>

          <div className="md:col-span-3 md:ml-12 lg:ml-20">
            <label htmlFor="material" className="block text-sm font-medium leading-6 text-gray-900">
              Material
            </label>
            <div className="flex mt-2">
              <input
                type="text"
                id="material"
                className="mr-2 p-1 block w-full md:w-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:text-sm md:leading-6"
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value)}
              />
              <button className="bg-blue-500 text-white text-sm p-1 rounded-md" onClick={addMaterial}>
                Add
              </button>
            </div>
            <div className="mt-2 text-sm">
              <p className="text-red-500">{error}</p>
            </div>
            <div className="mt-2 break-all">
              {material.map((guest, index) => (
                <div key={index} className="text-sm">
                  {guest}
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
            <a href="/project">
              Cancel
            </a>
          </button>
          <button type="button" onClick={handleButtonClick} className="w-full md:w-auto rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateProject;
