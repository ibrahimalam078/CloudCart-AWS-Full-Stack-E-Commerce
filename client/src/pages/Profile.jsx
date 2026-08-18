import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/authService';
import { FiUser, FiMail, FiShield, FiSave, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await updateProfile({ name, email });
      updateUser(res.data);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-container">
      <div className="profile-container card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <h2 className="profile-name">{user?.name}</h2>
          <span className={`badge badge-${user?.role === 'admin' ? 'warning' : 'primary'} mt-1`}>
            <FiShield /> {user?.role.toUpperCase()}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-with-icon">
              <FiUser className="field-icon" />
              <input
                type="text"
                required
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <FiMail className="field-icon" />
              <input
                type="email"
                required
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Member Since</label>
            <input
              type="text"
              disabled
              className="form-input"
              value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-block btn-lg mt-3">
            {loading ? 'Saving Changes...' : <> <FiSave /> Save Profile Changes </>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
