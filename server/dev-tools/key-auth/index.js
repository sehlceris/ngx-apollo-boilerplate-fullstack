const fs = require('fs');
const jwt = require('jsonwebtoken');

const publicKey = fs.readFileSync('./public.key', 'utf8');
const privateKey = fs.readFileSync('./private.key', 'utf8');

const signOptions = {
  expiresIn:  "12h",
  algorithm:  "RS256"
};

console.log('\n');
console.log('Public Key:');
console.log(publicKey);

console.log('\n');
console.log('Public Key (flattened):');
console.log(JSON.stringify(publicKey));

console.log('\n');
console.log('Private Key:');
console.log(privateKey);

console.log('\n');
console.log('Private Key (flattened):');
console.log(JSON.stringify(privateKey));

const payload = {
  test: true,
};

const token = jwt.sign(payload, privateKey, signOptions);

console.log('\n');
console.log('Token:');
console.log(token);

const decoded = jwt.decode(token, publicKey);

console.log('\n');
console.log('Decoded:');
console.log(decoded);

console.log('\n');