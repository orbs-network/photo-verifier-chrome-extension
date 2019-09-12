const axios = require('axios');
const Chance = require('chance');
const {
  Client,
  argString,
  createAccount
} = require('orbs-client-sdk');

const VCHAIN = 1000;
const NODE_URL = 'https://node1.demonet.orbs.com/vchains/' + VCHAIN;
// const VCHAIN = 42;
// const NODE_URL = 'http://localhost:8080';
const HASH_SERVICE_URL = 'https://image-hash.herokuapp.com/hash';
const CONTRACT_NAME = 'ExtensionPhotoRegistry';

const chance = new Chance();
const { publicKey, privateKey } = createAccount();
const client = new Client(NODE_URL, VCHAIN, 'TEST_NET');

const calculateHash = url => {
  return axios.post(HASH_SERVICE_URL, { url }).then(res => res.data);
};

const buildImageDTO = (url, alt) => ({
  id: chance.guid(),
  type: 'picture',
  title: alt,
  url,
  author: {
    name: chance.name()
  },
  rightModel: {
    id: 'ap42',
    name: 'editorialOnly',
    restrictions: 'no online or web use'
  }
});

const registerImage = (hash, dto) => {
  const [tx] = client.createTransaction(
    publicKey,
    privateKey,
    CONTRACT_NAME,
    'register',
    [argString(hash), argString(JSON.stringify(dto))]
  );
  return client.sendTransaction(tx);
}

(async (urls) => {
  return Promise.all(urls.map(({ url, alt }) => {
    return calculateHash(url).then(hash => {
      return registerImage(hash, buildImageDTO(url, alt));
    });
  }));
})(require('./images.json'));