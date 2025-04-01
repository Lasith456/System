import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 50 },   // Ramp-up to 50 VUs
    { duration: '1m', target: 50 },    // Stay at 50 VUs
    { duration: '30s', target: 0 },    // Ramp-down
  ],
};

export default function () {
  const res = http.get('https://system-53h6.onrender.com/api/ticket');
  sleep(1);
}
