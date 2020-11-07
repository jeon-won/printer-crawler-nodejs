// 현재 시간을 년월일시분초로 얻어옴
// 참고: https://gist.github.com/froop/962669

// yyyymmddhhmmss
const getCurrentTime = () => {
	var now = new Date();
	var res = "" + now.getFullYear() + padZero(now.getMonth() + 1)
		+ padZero(now.getDate()) + padZero(now.getHours())
		+ padZero(now.getMinutes()) + padZero(now.getSeconds());
	return res;
}

const padZero = (num) => {
	var result;
	if (num < 10) {
		result = "0" + num;
	} else {
		result = "" + num;
	}
	return result;
}

export default getCurrentTime;