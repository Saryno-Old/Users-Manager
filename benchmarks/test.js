import http from 'k6/http';
import { check, group, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '20s', target: 3000 }, // beyond the breaking point
  ],
  thresholds: {
    // fail the test if 95th percentile response goes above 500ms
    http_req_duration: [
      { threshold: 'p(95)<500', abortOnFail: true, delayAbortEval: '1m' },
    ],
  },
};

export default function() {
  const BASE_URL = 'http://localhost:3000'; // make sure this is not production
  let myObjects = http.get(`${BASE_URL}/`).json();
  check(myObjects, { 'retrieved crocodiles': obj => obj.hello === 'world' });
  sleep(1);
}
