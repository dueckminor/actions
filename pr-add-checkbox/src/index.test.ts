// Jest provides 'test' and 'expect' globally, no need to require them.
import { createBody } from './index';

test('createBody generates checkboxes correctly', () => {
  const checkboxes = "test1=Run Test 1,test2=Run Test 2,test3";
  const expectedBody = `- [ ] <!--test1--> Run Test 1
- [ ] <!--test2--> Run Test 2
- [ ] <!--test3--> test3
`;
  expect(createBody(checkboxes)).toBe(expectedBody);
});

test('createBody handles empty input', () => {
  const checkboxes = "";
  const expectedBody = ``;
  expect(createBody(checkboxes)).toBe(expectedBody);
});

test('createBody handles input with extra spaces', () => {
  const checkboxes = " test1 = Run Test 1 , test2 ";
  const expectedBody = `- [ ] <!--test1--> Run Test 1
- [ ] <!--test2--> test2
`;
  expect(createBody(checkboxes)).toBe(expectedBody);
});