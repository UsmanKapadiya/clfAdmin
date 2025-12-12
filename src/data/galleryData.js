// Gallery Photos Data - Organized by Year
export const GALLERY_DATA = {
  '2025': [
    {
      id: 1,
      title: '2025 Annual BBQ',
      year: '2025',
      subTitle: 'Richmond',
      catalogThumbnail: 'https://clfcanada.com/wp-content/uploads/2025/10/CLF_17_10-16-2025-438x246.jpg',
      photos: [
        { id: 1, src: 'https://clfcanada.com/wp-content/uploads/2014/05/rbbq_01-400x246.jpg' },
        { id: 2, src: 'https://clfcanada.com/wp-content/uploads/2014/05/rbbq_02-400x246.jpg' },
        { id: 3, src: 'https://clfcanada.com/wp-content/uploads/2014/05/rbbq_07-400x246.jpg' },
        { id: 4, src: 'https://clfcanada.com/wp-content/uploads/2025/10/CLF_05_10-16-2025-438x246.jpg' },
        { id: 5, src: 'https://clfcanada.com/wp-content/uploads/2025/10/CLF_01_10-16-2025-438x246.jpg' },
        { id: 6, src: 'https://clfcanada.com/wp-content/uploads/2025/10/CLF_03_10-16-2025-438x246.jpg' },
        { id: 7, src: 'https://clfcanada.com/wp-content/uploads/2014/05/rbbq_07-400x246.jpg' },
        { id: 8, src: 'https://clfcanada.com/wp-content/uploads/2025/10/CLF_05_10-16-2025-438x246.jpg' },
      ]
    },
    {
      id: 2,
      title: '2025 Lion Dance',
      year: '2025',
      subTitle: 'Crystal Mall',
      catalogThumbnail: 'https://clfcanada.com/wp-content/uploads/2014/05/crystalm_17-400x246.jpg',
      photos: [
        { id: 9, src: 'https://clfcanada.com/wp-content/uploads/2014/05/crystalm_01-400x246.jpg' },
        { id: 10, src: 'https://clfcanada.com/wp-content/uploads/2014/05/crystalm_02-400x246.jpg' },
        { id: 11, src: 'https://clfcanada.com/wp-content/uploads/2014/05/crystalm_03-400x246.jpg' },
      ]
    }
  ],
  '2024': [
    {
      id: 3,
      title: '2024 Tournament',
      year: '2024',
      subTitle: 'Vancouver Convention Center',
      catalogThumbnail: 'https://clfcanada.com/wp-content/uploads/2014/05/rbbq_01-400x246.jpg',
      photos: [
        { id: 12, src: 'https://clfcanada.com/wp-content/uploads/2014/05/rbbq_01-400x246.jpg' },
        { id: 13, src: 'https://clfcanada.com/wp-content/uploads/2014/05/rbbq_02-400x246.jpg' },
        { id: 14, src: 'https://clfcanada.com/wp-content/uploads/2014/05/rbbq_03-400x246.jpg' },
      ]
    },
    {
      id: 4,
      title: '2024 Spring Workshop',
      year: '2024',
      subTitle: 'Main Studio',
      catalogThumbnail: 'https://clfcanada.com/wp-content/uploads/2025/10/CLF_01_10-16-2025-438x246.jpg',
      photos: [
        { id: 15, src: 'https://clfcanada.com/wp-content/uploads/2025/10/CLF_01_10-16-2025-438x246.jpg' },
        { id: 16, src: 'https://clfcanada.com/wp-content/uploads/2025/10/CLF_03_10-16-2025-438x246.jpg' },
        { id: 17, src: 'https://clfcanada.com/wp-content/uploads/2025/10/CLF_05_10-16-2025-438x246.jpg' },
      ]
    }
  ],
  '2023': [
    {
      id: 5,
      title: '2023 Chinese New Year',
      year: '2023',
      subTitle: 'Chinatown',
      catalogThumbnail: 'https://clfcanada.com/wp-content/uploads/2014/05/crystalm_17-400x246.jpg',
      photos: [
        { id: 18, src: 'https://clfcanada.com/wp-content/uploads/2014/05/crystalm_17-400x246.jpg' },
        { id: 19, src: 'https://clfcanada.com/wp-content/uploads/2014/05/crystalm_01-400x246.jpg' },
        { id: 20, src: 'https://clfcanada.com/wp-content/uploads/2014/05/crystalm_02-400x246.jpg' },
      ]
    }
  ]
};

// Helper function to get all galleries as a flat array
export const getAllGalleries = () => {
  return Object.values(GALLERY_DATA).flat();
};

// Helper function to get gallery by ID
export const getGalleryById = (id) => {
  return getAllGalleries().find(gallery => gallery.id === parseInt(id));
};
