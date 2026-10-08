import React, { createContext, useContext, useState, useEffect } from 'react';

const ContentContext = createContext(null);

export const ContentProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    foundation_name: 'Jehovah Jireh Alby Foundation',
    display_title: 'JEHOVAH JIREH ALBY FOUNDATION',
    description: 'Jehovah Jireh Alby Foundation is a Christian charitable foundation caring for orphans, street children, vulnerable children and the needy. Every child deserves love, hope, education and a future.',
    mission: 'To provide food, shelter, education, medical support and spiritual guidance to orphaned and less privileged children in Ghana.',
    vision: 'To see every vulnerable child smile, thrive, and know that God provides.',
    motto: 'The Lord will provide',
    scripture: 'Genesis 22:14',
    phone: '0248072279',
    email: 'Jehovahjirehalbyfoundation@gmail.com',
    tiktok: '@jjaf_ghana',
    instagram: 'Jehovah jireh Alby Foundation',
    snapchat: 'jjaf.foundation',
    momo_network: 'MTN Mobile Money / Telecel Cash / AT Money',
    momo_number: '0248072279',
    momo_account_name: 'Jehovah Jireh Alby Foundation',
    momo_instructions: 'Transfer directly to the foundation official number and enter your name as reference.',
    bank_name: 'Available upon request / Configurable in Admin',
    bank_account_name: 'Jehovah Jireh Alby Foundation',
    bank_account_number: 'Contact Administration for official swift & bank routing',
    bank_branch: 'Kumasi / Accra, Ghana',
    bank_instructions: 'Official bank transfer information can be configured by the foundation administration.',
    stats_public_visible: false,
    stat_children_supported: 0,
    stat_orphanages_supported: 0,
    stat_projects_completed: 1,
    stat_donations_received: 0,
    custom_logo_url: ''
  });

  const [projects, setProjects] = useState([]);
  const [whatWeDo, setWhatWeDo] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      const [settingsRes, projectsRes, whatRes, galleryRes] = await Promise.all([
        fetch('/api/settings').then(r => r.json()).catch(() => null),
        fetch('/api/projects').then(r => r.json()).catch(() => null),
        fetch('/api/what-we-do').then(r => r.json()).catch(() => null),
        fetch('/api/gallery').then(r => r.json()).catch(() => null)
      ]);

      if (settingsRes?.success && settingsRes.data) {
        setSettings(settingsRes.data);
      }
      if (projectsRes?.success && projectsRes.data) {
        setProjects(projectsRes.data);
      }
      if (whatRes?.success && whatRes.data) {
        setWhatWeDo(whatRes.data);
      }
      if (galleryRes?.success && galleryRes.data) {
        setGallery(galleryRes.data);
      }
    } catch (err) {
      console.error('Error loading foundation content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <ContentContext.Provider
      value={{
        settings,
        projects,
        whatWeDo,
        gallery,
        loading,
        refreshContent: fetchAll
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => useContext(ContentContext);
