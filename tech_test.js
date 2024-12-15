//1. Thuật toán kiểm tra chuỗi đối xứng.
const isPalindrome = (s) => {
    //Kiểm tra chuỗi có rỗng không
    if (s === "") {
        return false;
    }

    // Xóa space và chuyển chữ hoa thành chữ thường
    const str = s.replace(/\s+/g, '').toLowerCase();

    //Duyệt chuỗi và kiểm tra chuỗi, nếu có ký tự nào không khớp thì trả về False
    let left = 0;
    let right = str.length - 1;
    while (left < right) {
        if (str[left] !== str[right]) {
            return false; // Nếu có ký tự không khớp, không phải chuỗi đối xứng
        }
        left++;
        right--;
    }
    // Nếu đã duyệt hết chuỗi trả về True, là chuỗi đối xứng
    return true;
}

// Ví dụ
// console.log(isPalindrome("level")); // true
// console.log(isPalindrome("hello")); // false
// console.log(isPalindrome("")); // false
// console.log(isPalindrome("A Santa at NASA")); // true

// 2. Bài toán Two Sum
const twoSum = (nums, target) => {
    // Kiểm tra rỗng
    if (nums.length < 1)
        return [];

    // Tạo một object để lưu trữ các phần tử đã xét
    let result = [];
    let map = new Map();

    for (let i = 0; i < nums.length; i++) {
        const number = target - nums[i];

        // Kiểm tra xem number có tồn tại trong map không, nếu tồn tại thì thêm vào result
        if (map.has(number)) {
            result.push([map.get(number), i]);
        }

        // Thêm phần tử vào map với index của phần tử hiện tại nếu chưa có trong map
        map.set(nums[i], i);
    }

    return result;
}


console.log(twoSum([2, 7, 11, 15], 9)); // [[0, 1]]
console.log(twoSum([3, 2, 4, 3], 6)); // [[1, 2], [0, 3]]
console.log(twoSum([], 6)); // []