import axios from'axios');

module.exports = async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: 'https://ap-south-1.aws.data.mongodb-api.com/app/data-iogss/endpoint/data/v1/action/findOne',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.MONGODB_API_KEY // Make sure to set your MongoDB API key here
      },
      data: req.body
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
