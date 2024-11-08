import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { file } = req.body;

  const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
  const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

  const formData = new URLSearchParams();
  formData.append('file', file);
  formData.append('upload_preset', 'public_uploads');  // Unsigned preset

  try {
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Basic ${Buffer.from(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`).toString('base64')}`,
      },
    });

    const result = await response.json();

    if (response.ok) {
      res.status(200).json({ url: result.secure_url });
    } else {
      res.status(response.status).json({ error: result.error.message });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload file.' });
  }
}
