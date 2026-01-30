import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User,
  CreditCard,
  BarChart3,
  Lock,
  Settings,
  Receipt,
} from 'lucide-react';
import ProfileSection from '../components/profile/ProfileSection';
import SubscriptionSection from '../components/profile/SubscriptionSection';
import UsageSection from '../components/profile/UsageSection';
import SecuritySection from '../components/profile/SecuritySection';
import PreferencesSection from '../components/profile/PreferencesSection';
import BillingHistorySection from '../components/profile/BillingHistorySection';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #fef3f3 0%, #fdf4e3 50%, #f0fdf4 100%);
  padding: 100px 0 60px;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 clamp(24px, 5vw, 48px);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const Sidebar = styled.nav`
  background: white;
  border-radius: 20px;
  padding: 24px;
  height: fit-content;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 100px;

  @media (max-width: 1024px) {
    position: static;
    padding: 16px;
  }
`;

const SidebarTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 20px 0;
  padding: 0 8px;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;

  @media (max-width: 1024px) {
    flex-direction: row;
    overflow-x: auto;
    gap: 8px;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const NavItem = styled.li`
  @media (max-width: 1024px) {
    flex-shrink: 0;
  }
`;

const NavButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: ${({ active }) =>
    active
      ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%)'
      : 'transparent'};
  border: ${({ active }) =>
    active ? '2px solid rgba(236, 72, 153, 0.3)' : 'none'};
  border-radius: 12px;
  color: ${({ active }) => (active ? '#ec4899' : '#6b7280')};
  font-family: inherit;
  font-size: 14px;
  font-weight: ${({ active }) => (active ? '600' : '500')};
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;

  &:hover {
    background: ${({ active }) =>
      active
        ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(249, 115, 22, 0.15) 100%)'
        : 'rgba(0, 0, 0, 0.03)'};
    color: ${({ active }) => (active ? '#ec4899' : '#374151')};
  }

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  @media (max-width: 1024px) {
    padding: 10px 16px;
    white-space: nowrap;
    border: 2px solid ${({ active }) => (active ? '#ec4899' : '#e5e7eb')};

    span {
      ${({ active }) => !active && 'display: none;'}
    }
  }
`;

const Content = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  min-height: 600px;

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const ContentHeader = styled.div`
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px solid #f3f4f6;
`;

const ContentTitle = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #1f2937;
  margin: 0 0 8px 0;
`;

const ContentSubtitle = styled.p`
  font-size: 15px;
  color: #6b7280;
  margin: 0;
`;

const sections = [
  {
    id: 'profile',
    name: 'Profile',
    icon: User,
    description: 'Manage your personal information',
  },
  {
    id: 'subscription',
    name: 'Subscription',
    icon: CreditCard,
    description: 'View and manage your plan',
  },
  {
    id: 'usage',
    name: 'Usage',
    icon: BarChart3,
    description: 'Track your image processing stats',
  },
  {
    id: 'security',
    name: 'Security',
    icon: Lock,
    description: 'Update password and security settings',
  },
  {
    id: 'preferences',
    name: 'Preferences',
    icon: Settings,
    description: 'Customize your app experience',
  },
  {
    id: 'billing',
    name: 'Billing History',
    icon: Receipt,
    description: 'View your payment records',
  },
];

const Profile = () => {
  const { section } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(section || 'profile');

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    navigate(`/profile/${sectionId}`);
  };

  const currentSection = sections.find((s) => s.id === activeSection);

  return (
    <PageContainer>
      <Container>
        <Grid>
          <Sidebar>
            <SidebarTitle>Account Settings</SidebarTitle>
            <NavList>
              {sections.map((section) => (
                <NavItem key={section.id}>
                  <NavButton
                    active={activeSection === section.id}
                    onClick={() => handleSectionChange(section.id)}
                  >
                    <section.icon />
                    <span>{section.name}</span>
                  </NavButton>
                </NavItem>
              ))}
            </NavList>
          </Sidebar>

          <Content>
            <ContentHeader>
              <ContentTitle>{currentSection?.name}</ContentTitle>
              <ContentSubtitle>{currentSection?.description}</ContentSubtitle>
            </ContentHeader>

            {/* Section components will be rendered here */}
            <div>
              {activeSection === 'profile' && <ProfileSection />}
              {activeSection === 'subscription' && <SubscriptionSection />}
              {activeSection === 'usage' && <UsageSection />}
              {activeSection === 'security' && <SecuritySection />}
              {activeSection === 'preferences' && <PreferencesSection />}
              {activeSection === 'billing' && <BillingHistorySection />}
            </div>
          </Content>
        </Grid>
      </Container>
    </PageContainer>
  );
};

export default Profile;
