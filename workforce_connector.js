const auth = require('./auth');
const Location = require('./location');
const request = require('request-promise-native');

const directories = {
  enrollbusiness: {
    "domain":"enrollbusiness.com",
    "link":"https://us.enrollbusiness.com/"
  },
  brownbook: {
    "domain":"brownbook.net",
    "link":"http://www.brownbook.net/"
  },
  tupalo: {
    "domain":"tupalo.com",
    "link":"http://tupalo.com/"
  },
  getfave: {
    "domain":"getfave.com",
    "link":"https://www.getfave.com/"
  },
  ebusinesspages: {
    "domain":"ebusinesspages.com",
    "link":"http://ebusinesspages.com/"
  },
}

let token = null;

const workforceRequest = async (url, body) => {
  if(!token){
    const authResp = await auth();
    token = authResp.access_token;
  }
  console.log(body)
  request.post({
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    uri: url,
    body,
    json: true
  })
}

const createOperation = (directory, location) => {
  const directoryListing = directories[directory];
  const payload = {
    directory: {
      ...directoryListing,
      "usable_url": true
    },
    find_url_foreign_id: 'skip',
    location: {...location.payload , "_id": location.id}
  };
  return { payload, type: 'maintain_listing' };
}

const batchSendOperations = (operations) => {
  return workforceRequest(
    'http://localhost:4000/api/operations',
    operations
  )
}

module.exports = {
  createOperation,
  workforceRequest,
  batchSendOperations,
}
