const Settings: React.FC = () => {
    const handleLogout = () => {
    };

    return (
        <div className="flex items-center justify-center h-[75vh]">
            <div className="w-1/4 bg-white rounded-lg shadow-lg p-10">
                <div className="flex justify-center">
                    <div>
                        <h1 className="text-2xl font-bold mb-8">Settings</h1>
                        <button onClick={handleLogout} className="text-xl bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600" >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
