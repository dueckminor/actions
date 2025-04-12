"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Jest provides 'test' and 'expect' globally, no need to require them.
const index_1 = require("./index");
test('createBody generates checkboxes correctly', () => {
    const checkboxes = "test1=Run Test 1,test2=Run Test 2,test3";
    const expectedBody = `- [ ] <!--test1--> Run Test 1
- [ ] <!--test2--> Run Test 2
- [ ] <!--test3--> test3
`;
    expect((0, index_1.createBody)(checkboxes)).toBe(expectedBody);
});
test('createBody handles empty input', () => {
    const checkboxes = "";
    const expectedBody = ``;
    expect((0, index_1.createBody)(checkboxes)).toBe(expectedBody);
});
// test('createBody handles input with extra spaces', () => {
//   const checkboxes = " test1 = Run Test 1 , test2 ";
//   const expectedBody = `## Select which tests to run:
// - [ ] <!--test1--> Run Test 1
// - [ ] <!--test2--> test2
// `;
//   expect(createBody(checkboxes)).toBe(expectedBody);
// });
