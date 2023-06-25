import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 10 },
    { duration: '2m', target: 20 },
    { duration: '2m', target: 30 },
    { duration: '2m', target: 50 },
    { duration: '3m', target: 5 }
  ],
  thresholds: {
    // 90% of requests must respond within 5s.
    http_req_duration: ['p(90) < 5000'],
  },
};

export default function () {
  const res = http.get('http://k8s-appns-foobarin-958f2a66f1-2063484544.ap-south-1.elb.amazonaws.com/api/process');
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
