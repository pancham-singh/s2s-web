export const isProduction = REACT_APP_ENV === 'production';
export const isRelease = REACT_APP_ENV === 'release';

let baseUrl = 'http://localhost:3000';

if (isProduction) {
  baseUrl = 'http://139.59.18.155:3000';
}

if (isRelease) {
  baseUrl = 'http://159.65.145.144:3000';
}

export const imagePath = (image) => {
  return image ? `${baseUrl}/static/images/${image}` : '';
};

export const apiUrls = {
  uploadedImage: (name) => (name ? `${baseUrl}/static/images/${name}` : ''),
  uploadImage: `${baseUrl}/upload-image`,
  graphql: baseUrl
};
