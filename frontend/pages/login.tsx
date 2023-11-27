import React, { useState } from 'react';
import Image from 'next/image';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // handle login
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full p-6 space-y-6 bg-white shadow-md">
                <Image className="max-w-20 max-h-60" src="/image/logo-microsoft.png" alt="logo microsoft" width={200} height={200}/>
                <h2 className="text-3xl font-extrabold text-gray-800">Sign in</h2>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                            E-mail
                        </label>
                        <input type="email" id="email" name="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 p-2 w-full border rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                            Password
                        </label>
                        <input type="password" id="password" name="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 p-2 w-full border rounded-md" />
                    </div>
                    <div>
                        <button type="button" onClick={handleLogin} className="w-full bg-blue-500 text-white p-2 rounded-md" >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
