const hexadecimalSharting = string => {
    const values = {
        "0": 0,
        "1": 1,
        "2": 2,
        "3": 3,
        "4": 4,
        "5": 5,
        "6": 6,
        "7": 7,
        "8": 8,
        "9": 9,
        "a": 10,
        "b": 11,
        "c": 12,
        "d": 13,
        "e": 14,
        "f": 15
    }
    let sum = 0
    for(let i = 0; i < string.length; i++) {
        sum += values[string[i]]
    }
    return sum % 2
}

function userGrouper(user) {
    return 
}