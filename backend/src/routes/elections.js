const express = require('express');
const axios = require('axios');
const router = express.Router();

// GET /api/elections/:zip
// Fetches election information for a given ZIP code using Google Civic Information API
router.get('/:zip', async (req, res) => {
  const zip = req.params.zip;
  const apiKey = process.env.GOOGLE_CIVIC_API_KEY;

  if (!apiKey || apiKey === 'your_google_civic_api_key_here') {
    return res.status(500).json({ error: 'Google Civic API Key is not configured.' });
  }

  try {
    // The voterinfo endpoint requires a full address for accurate polling data.
    const encodedAddress = encodeURIComponent(zip);
    let url = `https://www.googleapis.com/civicinfo/v2/voterinfo?address=${encodedAddress}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      return res.json(response.data);
    } catch (error) {
      // If "Election unknown", try to fetch the list of elections and use the first one
      if (error.response?.data?.error?.message === 'Election unknown') {
        console.log('Default election unknown, fetching election list...');
        const electionsRes = await axios.get(`https://www.googleapis.com/civicinfo/v2/elections?key=${apiKey}`);
        const elections = electionsRes.data.elections;
        console.log({ elections })
        if (elections && elections.length > 0) {
          // Attempt to find an election that matches the state in the address
          const stateNames = [
            'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
            'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
            'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
            'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
            'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
          ];

          const decodedAddress = decodeURIComponent(encodedAddress).toLowerCase();
          const userState = stateNames.find(state => decodedAddress.includes(state.toLowerCase()));

          let selectedElection = elections.find(e => userState && e.name.includes(userState));

          // Fallback to the first non-test election if no state match
          if (!selectedElection) {
            selectedElection = elections.find(e => e.id !== '2000'); // 2000 is usually the test election
          }

          if (selectedElection) {
            console.log(`Retrying with electionId: ${selectedElection.id} (${selectedElection.name})`);
            url = `https://www.googleapis.com/civicinfo/v2/voterinfo?address=${encodedAddress}&electionId=${selectedElection.id}&key=${apiKey}`;
            const retryResponse = await axios.get(url);
            return res.json(retryResponse.data);
          }
        }
      }
      throw error; // Re-throw if it's a different error or no fallback possible
    }
  } catch (error) {
    console.error('Error fetching civic data:', JSON.stringify(error.response?.data || error.message));
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error?.message || 'Failed to fetch election data. Please make sure you entered a full US address.'
    });
  }
});

module.exports = router;
