import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios({
      method: req.method,
      url: 'https://ap-south-1.aws.data.mongodb-api.com/app/data-iogss/endpoint/data/v1/action/findOne',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.MONGODB_API
      },
      data: req.body
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
