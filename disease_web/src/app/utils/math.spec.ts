import { add } from './math';

describe("math.add", () => {
   it("adds two numbers", () => {
      expect(add(2, 5)).toEqual(7);
   })
})

