// 生成随机数范围
export function randomInt(min, max) {
  const randomValue = Math.random();
  return Math.floor(min * (1 - randomValue) + max * randomValue);
}

//随机选择数组下标
export function createRandomPicker(arr) {
  arr = [...arr]; //copy数组，避免修改原数组

  function randomPick() {
    const len = arr.length - 1;
    const index = randomInt(0, len);
    const picked = arr[index];
    [arr[index], arr[len]] = [arr[len], arr[index]];
    return picked;
  }

  randomPick(); //抛弃第一次选择得结果

  return randomPick();
}
