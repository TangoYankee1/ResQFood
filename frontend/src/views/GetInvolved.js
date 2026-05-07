import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RoleCard = ({ icon, title, description, selected, onClick }) => (
  <div
    className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-4 ${
      selected ? 'border-emerald-600 bg-emerald-50' : 'border-zinc-200 bg-white'
    }`}
    onClick={onClick}
  >
    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selected ? 'bg-emerald-600' : 'bg-zinc-100'}`}>
      <span className={`material-symbols-outlined ${selected ? 'text-white' : 'text-zinc-600'}`}>{icon}</span>
    </div>
    <div>
      <h3 className="font-bold text-zinc-800">{title}</h3>
      <p className="text-sm text-zinc-500">{description}</p>
    </div>
  </div>
);

function GetInvolved() {
  const [isLogin, setIsLogin] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Donor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const roles = [
    { icon: 'volunteer_activism', title: 'Donor', description: 'I have surplus food to give' },
    { icon: 'local_shipping', title: 'Volunteer', description: 'I can help pick up & deliver' },
    { icon: 'groups', title: 'Beneficiary', description: 'My organization receives food' },
    { icon: 'analytics', title: 'LGU Personnel', description: 'I monitor analytics & reports' },
    { icon: 'admin_panel_settings', title: 'Admin', description: 'I manage the platform' },
  ];

  const handleAuthAction = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = isLogin ? '/api/users/login' : '/api/users/register';
    const payload = isLogin
      ? { email, password }
      : { username: fullName, email, password, role: selectedRole };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred.');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        // Redirect to onboarding for new users, dashboard for logging in users
        if (isLogin) {
          navigate('/dashboard');
        } else {
          navigate('/onboarding');
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <div className="bg-stone-50 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-emerald-800 text-3xl">restaurant</span>
          <span className="text-2xl font-black text-emerald-900 tracking-tighter">ResQFood</span>
        </div>
        <h1 className="text-4xl font-extrabold text-zinc-800 mb-2">
          {isLogin ? 'Sign in to your account' : 'Create your account'}
        </h1>
        <p className="text-zinc-500 mb-8">
          {isLogin ? 'Welcome back!' : 'Choose your role to get started.'}
        </p>

        {!isLogin && (
          <div className="mb-8">
            <p className="font-semibold text-zinc-600 mb-4">I am a...</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((role) => (
                <RoleCard
                  key={role.title}
                  icon={role.icon}
                  title={role.title}
                  description={role.description}
                  selected={selectedRole === role.title}
                  onClick={() => setSelectedRole(role.title)}
                />
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleAuthAction}>
          <div className={`grid grid-cols-1 ${!isLogin ? 'md:grid-cols-2' : ''} gap-6 mb-6`}>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-2" htmlFor="full-name">
                  Full name
                </label>
                <input
                  className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  id="full-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}
            <div className={isLogin ? 'col-span-1' : ''}>
              <label className="block text-sm font-medium text-zinc-600 mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-zinc-600 mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {!isLogin && <p className="text-xs text-zinc-400 mt-2">At least 8 characters.</p>}
          </div>

          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

          <button
            className="w-full bg-emerald-800 text-white font-bold py-4 rounded-lg hover:bg-emerald-700 transition-colors text-lg"
            type="submit"
          >
            {isLogin ? 'Sign In' : 'Create account'}
          </button>
        </form>
        <p className="text-center text-zinc-500 mt-8">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={toggleAuthMode} className="font-semibold text-emerald-600 hover:underline">
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default GetInvolved;