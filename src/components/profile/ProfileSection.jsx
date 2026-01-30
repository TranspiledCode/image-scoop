import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { User, Mail, Calendar, Edit2, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ref, get, set } from 'firebase/database';
import { database } from '../../config/firebase';

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Card = styled.div`
  background: #f9fafb;
  border: 2px solid #f3f4f6;
  border-radius: 16px;
  padding: 24px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: transparent;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #ec4899;
    color: #ec4899;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({ background }) => background || 'rgba(236, 72, 153, 0.1)'};
  color: ${({ color }) => color || '#ec4899'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const InfoContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const InfoLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.div`
  font-size: 15px;
  color: #1f2937;
  font-weight: 600;
`;

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #374151;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 15px;
  font-family: inherit;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #ec4899;
    box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #ec4899 0%, #f97316 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const CancelButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: transparent;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  color: #6b7280;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #d1d5db;
    color: #374151;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #dc2626;
  padding: 12px;
  border-radius: 8px;
  font-size: 13px;
`;

const ProfileSection = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [editedName, setEditedName] = useState('');

  useEffect(() => {
    const loadProfileData = async () => {
      if (!currentUser) return;

      try {
        const profileRef = ref(database, `users/${currentUser.uid}/profile`);
        const snapshot = await get(profileRef);

        if (snapshot.exists()) {
          setProfileData(snapshot.val());
          setEditedName(snapshot.val().displayName || '');
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      }
    };

    loadProfileData();
  }, [currentUser]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedName(profileData?.displayName || '');
    setError('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedName(profileData?.displayName || '');
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    if (!editedName.trim()) {
      setError('Display name cannot be empty');
      return;
    }

    if (editedName.trim().length < 2) {
      setError('Display name must be at least 2 characters');
      return;
    }

    if (editedName.trim().length > 50) {
      setError('Display name must be less than 50 characters');
      return;
    }

    setIsLoading(true);

    try {
      await updateUserProfile({ displayName: editedName.trim() });

      await set(
        ref(database, `users/${currentUser.uid}/profile/displayName`),
        editedName.trim(),
      );

      setProfileData({ ...profileData, displayName: editedName.trim() });
      setIsEditing(false);
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!profileData) {
    return <div>Loading profile...</div>;
  }

  return (
    <Section>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          {!isEditing && (
            <EditButton onClick={handleEdit}>
              <Edit2 />
              Edit
            </EditButton>
          )}
        </CardHeader>

        {isEditing ? (
          <EditForm onSubmit={handleSave}>
            <InputGroup>
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                disabled={isLoading}
                autoFocus
              />
            </InputGroup>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <ButtonGroup>
              <CancelButton
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X />
                Cancel
              </CancelButton>
              <SaveButton type="submit" disabled={isLoading}>
                <Check />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </SaveButton>
            </ButtonGroup>
          </EditForm>
        ) : (
          <ProfileInfo>
            <InfoRow>
              <IconWrapper background="rgba(236, 72, 153, 0.1)" color="#ec4899">
                <User />
              </IconWrapper>
              <InfoContent>
                <InfoLabel>Display Name</InfoLabel>
                <InfoValue>{profileData.displayName || 'Not set'}</InfoValue>
              </InfoContent>
            </InfoRow>

            <InfoRow>
              <IconWrapper background="rgba(59, 130, 246, 0.1)" color="#3b82f6">
                <Mail />
              </IconWrapper>
              <InfoContent>
                <InfoLabel>Email Address</InfoLabel>
                <InfoValue>{profileData.email}</InfoValue>
              </InfoContent>
            </InfoRow>

            <InfoRow>
              <IconWrapper background="rgba(16, 185, 129, 0.1)" color="#10b981">
                <Calendar />
              </IconWrapper>
              <InfoContent>
                <InfoLabel>Member Since</InfoLabel>
                <InfoValue>{formatDate(profileData.createdAt)}</InfoValue>
              </InfoContent>
            </InfoRow>
          </ProfileInfo>
        )}
      </Card>
    </Section>
  );
};

export default ProfileSection;
